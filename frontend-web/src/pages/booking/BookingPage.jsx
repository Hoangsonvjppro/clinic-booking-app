import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { getDoctorById } from '../../api/doctorApi';
import { createAppointment } from '../../api/appointmentApi';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const steps = [
  { id: 1, name: 'Schedule', icon: CalendarDaysIcon },
  { id: 2, name: 'Patient Info', icon: UserIcon },
  { id: 3, name: 'Confirmation', icon: CheckCircleIcon },
];

export default function BookingPage() {
  const { doctorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [doctor, setDoctor] = useState(location.state?.doctor || null);
  const [loading, setLoading] = useState(!location.state?.doctor);
  const [submitting, setSubmitting] = useState(false);

  const [bookingData, setBookingData] = useState({
    date: location.state?.date || '',
    time: location.state?.time || '',
    patientName: user?.fullName || '',
    patientEmail: user?.email || '',
    patientPhone: user?.phone || '',
    symptoms: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  // Generate dates for the next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM'
  ];

  useEffect(() => {
    if (!doctor) {
      loadDoctor();
    }
  }, [doctorId]);

  const loadDoctor = async () => {
    setLoading(true);
    try {
      const response = await getDoctorById(doctorId);
      setDoctor(response?.data || response);
    } catch (error) {
      console.error('Failed to load doctor:', error);
      toast.error('Could not load doctor information');
      setDoctor(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      full: date.toISOString().split('T')[0],
      display: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    };
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!bookingData.date) newErrors.date = 'Please select a date';
      if (!bookingData.time) newErrors.time = 'Please select a time';
    }
    
    if (step === 2) {
      if (!bookingData.patientName.trim()) newErrors.patientName = 'Name is required';
      if (!bookingData.patientEmail.trim()) {
        newErrors.patientEmail = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(bookingData.patientEmail)) {
        newErrors.patientEmail = 'Please enter a valid email';
      }
      if (!bookingData.patientPhone.trim()) {
        newErrors.patientPhone = 'Phone number is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    
    setSubmitting(true);
    try {
      const appointmentData = {
        doctorId: doctor.id,
        patientId: user?.id,
        appointmentDate: bookingData.date,
        appointmentTime: bookingData.time,
        symptoms: bookingData.symptoms,
        notes: bookingData.notes,
      };
      
      const response = await createAppointment(appointmentData);
      toast.success('Appointment booked successfully!');
      navigate(`/payment/${response?.id || 'mock-id'}`, { 
        state: { 
          appointment: response,
          doctor,
          bookingData
        } 
      });
    } catch (error) {
      console.error('Failed to create appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-custom py-4">
          <Link to={`/doctors/${doctorId}`} className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors">
            <ChevronLeftIcon className="w-5 h-5" />
            Back to Doctor Profile
          </Link>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  currentStep >= step.id 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  <step.icon className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 md:w-24 h-1 mx-2 rounded ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-slate-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-card">
              {/* Step 1: Schedule */}
              {currentStep === 1 && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Select Date & Time</h2>
                  
                  {/* Date Selection */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <CalendarDaysIcon className="w-5 h-5 text-primary-600" />
                      Choose Date
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {dates.map((date) => {
                        const formatted = formatDate(date);
                        const isSelected = bookingData.date === formatted.full;
                        const isToday = date.toDateString() === new Date().toDateString();
                        return (
                          <button
                            key={formatted.full}
                            onClick={() => handleInputChange({ target: { name: 'date', value: formatted.full } })}
                            className={`p-3 rounded-xl text-center transition-all ${
                              isSelected
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'bg-slate-50 hover:bg-primary-50 text-slate-700 hover:border-primary-200 border border-transparent'
                            }`}
                          >
                            <p className="text-xs font-medium">{formatted.day}</p>
                            <p className="text-xl font-bold my-1">{formatted.date}</p>
                            <p className="text-xs">{formatted.month}</p>
                            {isToday && (
                              <p className={`text-xs mt-1 ${isSelected ? 'text-primary-200' : 'text-primary-600'}`}>Today</p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <ExclamationCircleIcon className="w-4 h-4" />
                        {errors.date}
                      </p>
                    )}
                  </div>

                  {/* Time Selection */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <ClockIcon className="w-5 h-5 text-primary-600" />
                      Choose Time
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleInputChange({ target: { name: 'time', value: time } })}
                          className={`py-3 px-4 rounded-xl font-medium transition-all ${
                            bookingData.time === time
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'bg-slate-50 hover:bg-primary-50 text-slate-700'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    {errors.time && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <ExclamationCircleIcon className="w-4 h-4" />
                        {errors.time}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Patient Info */}
              {currentStep === 2 && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Patient Information</h2>
                  
                  <div className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="input-label">Full Name *</label>
                        <input
                          type="text"
                          name="patientName"
                          value={bookingData.patientName}
                          onChange={handleInputChange}
                          className={`input-field ${errors.patientName ? 'input-field-error' : ''}`}
                          placeholder="Enter your full name"
                        />
                        {errors.patientName && <p className="input-error">{errors.patientName}</p>}
                      </div>
                      
                      <div>
                        <label className="input-label">Phone Number *</label>
                        <input
                          type="tel"
                          name="patientPhone"
                          value={bookingData.patientPhone}
                          onChange={handleInputChange}
                          className={`input-field ${errors.patientPhone ? 'input-field-error' : ''}`}
                          placeholder="+1 (555) 000-0000"
                        />
                        {errors.patientPhone && <p className="input-error">{errors.patientPhone}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="input-label">Email Address *</label>
                      <input
                        type="email"
                        name="patientEmail"
                        value={bookingData.patientEmail}
                        onChange={handleInputChange}
                        className={`input-field ${errors.patientEmail ? 'input-field-error' : ''}`}
                        placeholder="your@email.com"
                      />
                      {errors.patientEmail && <p className="input-error">{errors.patientEmail}</p>}
                    </div>

                    <div>
                      <label className="input-label">Symptoms / Reason for Visit</label>
                      <textarea
                        name="symptoms"
                        value={bookingData.symptoms}
                        onChange={handleInputChange}
                        rows={3}
                        className="input-field resize-none"
                        placeholder="Describe your symptoms or reason for this visit..."
                      />
                    </div>

                    <div>
                      <label className="input-label">Additional Notes</label>
                      <textarea
                        name="notes"
                        value={bookingData.notes}
                        onChange={handleInputChange}
                        rows={2}
                        className="input-field resize-none"
                        placeholder="Any additional information the doctor should know..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Review & Confirm</h2>
                  
                  <div className="space-y-6">
                    {/* Appointment Details */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h3 className="font-semibold text-slate-900 mb-4">Appointment Details</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <CalendarDaysIcon className="w-5 h-5 text-primary-600" />
                          <div>
                            <p className="text-sm text-slate-500">Date</p>
                            <p className="font-medium text-slate-900">
                              {bookingData.date ? formatDate(new Date(bookingData.date)).display : '-'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <ClockIcon className="w-5 h-5 text-primary-600" />
                          <div>
                            <p className="text-sm text-slate-500">Time</p>
                            <p className="font-medium text-slate-900">{bookingData.time || '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h3 className="font-semibold text-slate-900 mb-4">Patient Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Name</span>
                          <span className="font-medium text-slate-900">{bookingData.patientName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Email</span>
                          <span className="font-medium text-slate-900">{bookingData.patientEmail}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Phone</span>
                          <span className="font-medium text-slate-900">{bookingData.patientPhone}</span>
                        </div>
                        {bookingData.symptoms && (
                          <div>
                            <span className="text-slate-500 block mb-1">Symptoms</span>
                            <span className="text-slate-700">{bookingData.symptoms}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-primary-50 border border-primary-100 rounded-xl p-6">
                      <h3 className="font-semibold text-slate-900 mb-4">Payment Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Consultation Fee</span>
                          <span className="font-medium">${doctor?.consultationFee || 150}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Service Fee</span>
                          <span className="font-medium">$5</span>
                        </div>
                        <div className="border-t border-primary-200 pt-2 mt-2">
                          <div className="flex justify-between text-lg">
                            <span className="font-semibold text-slate-900">Total</span>
                            <span className="font-bold text-primary-600">${(doctor?.consultationFee || 150) + 5}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                {currentStep > 1 ? (
                  <button
                    onClick={handleBack}
                    className="btn-ghost flex items-center gap-2"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                    Back
                  </button>
                ) : (
                  <div></div>
                )}
                
                {currentStep < 3 ? (
                  <button onClick={handleNext} className="btn-primary flex items-center gap-2">
                    Continue
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-success flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCardIcon className="w-5 h-5" />
                        Proceed to Payment
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Doctor Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-card sticky top-24">
              <h3 className="font-semibold text-slate-900 mb-4">Booking Summary</h3>
              
              {/* Doctor Info */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                {doctor?.imageUrl ? (
                  <img 
                    src={doctor.imageUrl} 
                    alt={doctor.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl font-bold">
                    {doctor?.fullName?.charAt(0) || 'D'}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-900">{doctor?.fullName}</p>
                  <p className="text-sm text-primary-600">{doctor?.specialty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <StarSolidIcon className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-slate-600">{doctor?.rating} ({doctor?.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Selected Schedule */}
              {(bookingData.date || bookingData.time) && (
                <div className="py-4 border-b border-slate-100">
                  <p className="text-sm text-slate-500 mb-2">Selected Schedule</p>
                  {bookingData.date && (
                    <p className="flex items-center gap-2 text-slate-900">
                      <CalendarDaysIcon className="w-4 h-4 text-primary-600" />
                      {formatDate(new Date(bookingData.date)).display}
                    </p>
                  )}
                  {bookingData.time && (
                    <p className="flex items-center gap-2 text-slate-900 mt-1">
                      <ClockIcon className="w-4 h-4 text-primary-600" />
                      {bookingData.time}
                    </p>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">Consultation</span>
                  <span>${doctor?.consultationFee || 150}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">Service Fee</span>
                  <span>$5</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-slate-100">
                  <span>Total</span>
                  <span className="text-primary-600">${(doctor?.consultationFee || 150) + 5}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}