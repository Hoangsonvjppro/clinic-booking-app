import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Check, Calendar, Clock, User, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import NavigationBar from "../components/NavigationBar";
import { doctors } from "../utils/doctors";
import DateTimePicker from "../components/DateTimePicker";
import BookingSummary from "../components/BookingSummary";

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(localStorage.getItem("mode"))

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("mode", isDark)
  }
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({
    doctorId: null,
    date: null,
    timeSlot: null,
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    reason: "",
  });
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const doctorId = parseInt(searchParams.get("doctorId"), 10);
    
    if (doctorId) {
      const doctor = doctors.find((d) => d.id === doctorId);
      if (doctor) {
        setSelectedDoctor(doctor);
        setBookingData(prev => ({ ...prev, doctorId }));
        setCurrentStep(2);
      }
    }
  }, [location]);

  const steps = [
    { number: 1, title: "Chọn Bác Sĩ", icon: User },
    { number: 2, title: "Chọn Ngày & Giờ", icon: Calendar },
    { number: 3, title: "Thông Tin", icon: FileText },
    { number: 4, title: "Xác Nhận", icon: Check },
  ];

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingData(prev => ({ ...prev, doctorId: doctor.id }));
    setCurrentStep(2);
  };

  const handleDateTimeSelect = (date, timeSlot) => {
    setBookingData(prev => ({ ...prev, date, timeSlot }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedDoctor !== null;
      case 2:
        return bookingData.date && bookingData.timeSlot;
      case 3:
        return (
          bookingData.patientName.trim() &&
          bookingData.patientPhone.trim() &&
          bookingData.patientEmail.trim()
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirm = () => {
    // TODO: Call API to create appointment
    console.log("Booking Data:", bookingData);
    navigate("/payment", { state: { bookingData, doctor: selectedDoctor } });
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-900 text-white" : "bg-gray-100 text-black"}`}>
      <NavigationBar isDark={isDark} toggleTheme={toggleTheme} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      currentStep >= step.number
                        ? "bg-blue-600 border-blue-600 text-white"
                        : isDark
                        ? "border-gray-600 text-gray-400"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    <step.icon size={20} />
                  </div>
                  <span className={`mt-2 text-sm font-medium hidden md:block ${currentStep >= step.number ? "text-blue-600" : ""}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      currentStep > step.number
                        ? "bg-blue-600"
                        : isDark
                        ? "bg-gray-700"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className={`rounded-xl shadow-lg p-6 md:p-8 min-h-[500px] ${isDark ? "bg-slate-950" : "bg-white"}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Select Doctor */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Chọn Bác Sĩ</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {doctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        onClick={() => handleDoctorSelect(doctor)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                          selectedDoctor?.id === doctor.id
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                            : isDark
                            ? "border-gray-700 hover:border-gray-600"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <img
                            src={doctor.avatar}
                            alt={doctor.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{doctor.name}</h3>
                            <p className="text-sm text-blue-600">{doctor.specialty}</p>
                            <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                              {doctor.hospital}
                            </p>
                            <p className="text-xs mt-1 flex items-center">
                              ⭐ {doctor.rating}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Select Date & Time */}
              {currentStep === 2 && selectedDoctor && (
                <div>
                  <h2 className="text-2xl font-bold mb-2">Chọn Ngày & Giờ Khám</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Bác sĩ: <span className="font-semibold text-blue-600">{selectedDoctor.name}</span>
                  </p>
                  <DateTimePicker
                    isDark={isDark}
                    selectedDate={bookingData.date}
                    selectedTime={bookingData.timeSlot}
                    onDateTimeSelect={handleDateTimeSelect}
                  />
                </div>
              )}

              {/* Step 3: Patient Information */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Thông Tin Bệnh Nhân</h2>
                  <div className="space-y-4 max-w-2xl">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="patientName"
                        value={bookingData.patientName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          isDark
                            ? "bg-slate-900 border-gray-700 focus:border-blue-500"
                            : "bg-white border-gray-300 focus:border-blue-500"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="patientPhone"
                        value={bookingData.patientPhone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          isDark
                            ? "bg-slate-900 border-gray-700 focus:border-blue-500"
                            : "bg-white border-gray-300 focus:border-blue-500"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        placeholder="0912345678"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="patientEmail"
                        value={bookingData.patientEmail}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          isDark
                            ? "bg-slate-900 border-gray-700 focus:border-blue-500"
                            : "bg-white border-gray-300 focus:border-blue-500"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        placeholder="example@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Lý do khám
                      </label>
                      <textarea
                        name="reason"
                        value={bookingData.reason}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          isDark
                            ? "bg-slate-900 border-gray-700 focus:border-blue-500"
                            : "bg-white border-gray-300 focus:border-blue-500"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        placeholder="Mô tả triệu chứng hoặc lý do khám..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Xác Nhận Thông Tin</h2>
                  <BookingSummary
                    doctor={selectedDoctor}
                    bookingData={bookingData}
                    isDark={isDark}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 1
                ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-700"
                : isDark
                ? "bg-slate-800 hover:bg-slate-700 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            <ChevronLeft size={20} className="mr-2" />
            Quay lại
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                !canProceed()
                  ? "opacity-50 cursor-not-allowed bg-blue-300"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Tiếp theo
              <ChevronRight size={20} className="ml-2" />
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="flex items-center px-6 py-3 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white transition-all"
            >
              <Check size={20} className="mr-2" />
              Xác nhận & Thanh toán
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
