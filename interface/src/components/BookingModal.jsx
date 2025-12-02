import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { services, doctors, getAvailableDates } from '../data/mockData';

const BookingModal = () => {
  const { bookingModalOpen, setBookingModalOpen, isLoggedIn, user } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    service: '',
    customService: '',
    selectedDoctor: null,
    date: '',
    time: ''
  });
  const [errors, setErrors] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Auto-fill user data if logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        age: user.age?.toString() || '',
        phone: user.phone || ''
      }));
    }
  }, [isLoggedIn, user]);

  // Reset modal state when closed
  useEffect(() => {
    if (!bookingModalOpen) {
      setTimeout(() => {
        setCurrentStep(1);
        setFormData({
          name: isLoggedIn ? user?.name || '' : '',
          age: isLoggedIn ? user?.age?.toString() || '' : '',
          phone: isLoggedIn ? user?.phone || '' : '',
          service: '',
          customService: '',
          selectedDoctor: null,
          date: '',
          time: ''
        });
        setErrors({});
        setBookingSuccess(false);
      }, 300);
    }
  }, [bookingModalOpen, isLoggedIn, user]);

  // Update available times when doctor and date are selected
  useEffect(() => {
    if (formData.selectedDoctor && formData.date) {
      const doctor = doctors.find(d => d.id === formData.selectedDoctor);
      if (doctor) {
        setAvailableTimes(doctor.availableTimes || []);
      }
    }
  }, [formData.selectedDoctor, formData.date]);

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
    if (!formData.age || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Vui lòng nhập tuổi hợp lệ (1-120)';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.service && !formData.customService.trim()) {
      newErrors.service = 'Vui lòng chọn hoặc nhập dịch vụ';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Vui lòng chọn ngày khám';
    if (!formData.time) newErrors.time = 'Vui lòng chọn giờ khám';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    else if (currentStep === 3) isValid = validateStep3();

    if (isValid) {
      if (currentStep === 3) {
        handleSubmit();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = () => {
    // Mock booking submission
    console.log('Booking submitted:', formData);
    setBookingSuccess(true);
    
    // Close modal after 3 seconds
    setTimeout(() => {
      setBookingModalOpen(false);
    }, 3000);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!bookingModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => setBookingModalOpen(false)}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 transform transition-all">
          {/* Close Button */}
          <button
            onClick={() => setBookingModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Success Message */}
          {bookingSuccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Đặt Lịch Thành Công!
              </h3>
              <p className="text-gray-600 mb-4">
                Chúng tôi đã ghi nhận lịch hẹn của bạn
              </p>
              <div className="bg-sky-50 rounded-lg p-4 text-left max-w-md mx-auto">
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Họ tên:</strong> {formData.name}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Dịch vụ:</strong> {formData.service || formData.customService}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Ngày:</strong> {new Date(formData.date).toLocaleDateString('vi-VN')}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Giờ:</strong> {formData.time}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                  Đặt Lịch Khám Bệnh
                </h2>
                <p className="text-gray-600">
                  {currentStep === 1 && 'Thông tin cá nhân'}
                  {currentStep === 2 && 'Chọn dịch vụ khám'}
                  {currentStep === 3 && 'Chọn thời gian'}
                </p>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                          currentStep >= step
                            ? 'bg-sky-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {currentStep > step ? <Check className="w-5 h-5" /> : step}
                      </div>
                      <span className="text-xs mt-1 text-gray-600">
                        {step === 1 && 'Thông tin'}
                        {step === 2 && 'Dịch vụ'}
                        {step === 3 && 'Thời gian'}
                      </span>
                    </div>
                    {step < 3 && (
                      <div
                        className={`flex-1 h-1 mx-2 transition-all ${
                          currentStep > step ? 'bg-sky-500' : 'bg-gray-200'
                        }`}
                      ></div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Step Content */}
              <div className="mb-6">
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nguyễn Văn A"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tuổi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleChange('age', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                          errors.age ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="28"
                        min="1"
                        max="120"
                      />
                      {errors.age && (
                        <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0901234567"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Service Selection */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Chọn dịch vụ khám <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {services.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => {
                              handleChange('service', service.name);
                              handleChange('customService', '');
                            }}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                              formData.service === service.name
                                ? 'border-sky-500 bg-sky-50'
                                : 'border-gray-200 hover:border-sky-300'
                            }`}
                          >
                            <div className="font-medium text-slate-800 mb-1">
                              {service.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {service.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hoặc nhập dịch vụ khác
                      </label>
                      <input
                        type="text"
                        value={formData.customService}
                        onChange={(e) => {
                          handleChange('customService', e.target.value);
                          handleChange('service', '');
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Nhập tên dịch vụ..."
                      />
                    </div>

                    {errors.service && (
                      <p className="text-red-500 text-sm">{errors.service}</p>
                    )}
                  </div>
                )}

                {/* Step 3: Date & Time Selection */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    {/* Doctor Selection (Optional) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn bác sĩ (Tùy chọn)
                      </label>
                      <select
                        value={formData.selectedDoctor || ''}
                        onChange={(e) => handleChange('selectedDoctor', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="">Bác sĩ sẽ được phân bổ tự động</option>
                        {doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialty}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn ngày khám <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                        {getAvailableDates().slice(0, 10).map((date) => {
                          const dateObj = new Date(date);
                          const isAvailable = !formData.selectedDoctor || 
                            doctors.find(d => d.id === formData.selectedDoctor)?.availableDates.includes(date);
                          
                          return (
                            <button
                              key={date}
                              onClick={() => isAvailable && handleChange('date', date)}
                              disabled={!isAvailable}
                              className={`p-3 rounded-lg border-2 text-center transition-all ${
                                formData.date === date
                                  ? 'border-sky-500 bg-sky-50'
                                  : isAvailable
                                  ? 'border-gray-200 hover:border-sky-300'
                                  : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                              }`}
                            >
                              <div className="text-xs text-gray-600">
                                {dateObj.toLocaleDateString('vi-VN', { weekday: 'short' })}
                              </div>
                              <div className="font-semibold text-slate-800">
                                {dateObj.getDate()}/{dateObj.getMonth() + 1}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {errors.date && (
                        <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                      )}
                    </div>

                    {/* Time Selection */}
                    {formData.date && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Chọn giờ khám <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {(availableTimes.length > 0 ? availableTimes : [
                            '08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
                          ]).map((time) => (
                            <button
                              key={time}
                              onClick={() => handleChange('time', time)}
                              className={`px-3 py-2 rounded-lg border-2 text-center transition-all ${
                                formData.time === time
                                  ? 'border-sky-500 bg-sky-50 font-semibold'
                                  : 'border-gray-200 hover:border-sky-300'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                        {errors.time && (
                          <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevious}
                    className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Quay lại</span>
                  </button>
                )}
                
                <button
                  onClick={handleNext}
                  className={`flex items-center space-x-2 px-6 py-3 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 transition-all shadow-md hover:shadow-lg ${
                    currentStep === 1 ? 'ml-auto' : ''
                  }`}
                >
                  <span>{currentStep === 3 ? 'Xác nhận' : 'Tiếp theo'}</span>
                  {currentStep < 3 && <ChevronRight className="w-5 h-5" />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
