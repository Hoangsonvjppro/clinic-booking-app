import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  StarIcon,
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { getDoctorById, getDoctorAvailability } from '../../api/doctorApi';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  useEffect(() => {
    loadDoctor();
  }, [id]);

  const loadDoctor = async () => {
    setLoading(true);
    try {
      const response = await getDoctorById(id);
      setDoctor(response?.data || response);
    } catch (error) {
      console.error('Failed to load doctor:', error);
      // Mock data fallback
      setDoctor({
        id: id,
        fullName: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        rating: 4.9,
        reviewCount: 124,
        consultationFee: 150,
        experience: 15,
        location: 'Medical Center, Building A',
        address: '123 Healthcare Avenue, Medical District',
        phone: '+1 (555) 123-4567',
        email: 'dr.sarah@cliniccare.com',
        bio: 'Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in diagnosing and treating cardiovascular conditions. She specializes in preventive cardiology, heart failure management, and cardiac rehabilitation.',
        education: [
          { degree: 'MD', institution: 'Harvard Medical School', year: '2005' },
          { degree: 'Cardiology Fellowship', institution: 'Mayo Clinic', year: '2009' },
          { degree: 'Board Certified', institution: 'American Board of Internal Medicine', year: '2010' },
        ],
        languages: ['English', 'Spanish'],
        services: [
          'Heart Health Checkup',
          'ECG/EKG Testing',
          'Echocardiography',
          'Stress Testing',
          'Cardiac Risk Assessment',
          'Hypertension Management'
        ],
        reviews: [
          { id: 1, patientName: 'John D.', rating: 5, date: '2024-11-15', comment: 'Excellent doctor! Very thorough and caring.' },
          { id: 2, patientName: 'Mary S.', rating: 5, date: '2024-11-10', comment: 'Dr. Johnson took the time to explain everything clearly.' },
          { id: 3, patientName: 'Robert K.', rating: 4, date: '2024-11-05', comment: 'Great experience, highly recommended.' },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book an appointment');
      navigate('/login', { state: { from: `/doctors/${id}` } });
      return;
    }
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }
    navigate(`/booking/${id}`, { 
      state: { 
        doctor, 
        date: selectedDate, 
        time: selectedTime 
      } 
    });
  };

  const formatDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      full: date.toISOString().split('T')[0]
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="container-custom">
          <div className="bg-white rounded-xl p-8 animate-pulse">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-32 h-32 bg-slate-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-8 bg-slate-200 rounded w-1/3 mb-3"></div>
                <div className="h-5 bg-slate-200 rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Doctor not found</h2>
          <p className="text-slate-600 mb-4">The doctor you're looking for doesn't exist.</p>
          <Link to="/doctors" className="btn-primary">
            Browse Doctors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back button */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-custom py-4">
          <Link to="/doctors" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors">
            <ChevronLeftIcon className="w-5 h-5" />
            Back to Doctors
          </Link>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Profile Card */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-card">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                  {doctor.imageUrl ? (
                    <img 
                      src={doctor.imageUrl} 
                      alt={doctor.fullName}
                      className="w-32 h-32 rounded-full object-cover border-4 border-slate-100"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl font-bold">
                      {doctor.fullName?.charAt(0) || 'D'}
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-medical-500 rounded-full flex items-center justify-center border-4 border-white">
                    <CheckBadgeIcon className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                        {doctor.fullName}
                      </h1>
                      <p className="text-primary-600 font-semibold text-lg mt-1">
                        {doctor.specialty}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        {isFavorite ? (
                          <HeartSolidIcon className="w-6 h-6 text-red-500" />
                        ) : (
                          <HeartIcon className="w-6 h-6 text-slate-400" />
                        )}
                      </button>
                      <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                        <ShareIcon className="w-6 h-6 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 justify-center sm:justify-start">
                    <div className="flex items-center gap-1">
                      <StarSolidIcon className="w-5 h-5 text-amber-400" />
                      <span className="font-semibold text-slate-900">{doctor.rating}</span>
                      <span className="text-slate-500">({doctor.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <BriefcaseIcon className="w-5 h-5" />
                      <span>{doctor.experience}+ years</span>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600 justify-center sm:justify-start">
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{doctor.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="flex border-b border-slate-200">
                {['about', 'reviews', 'location'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* About Tab */}
                {activeTab === 'about' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">About</h3>
                      <p className="text-slate-600 leading-relaxed">{doctor.bio}</p>
                    </div>

                    {/* Education */}
                    {doctor.education && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <AcademicCapIcon className="w-5 h-5 text-primary-600" />
                          Education & Training
                        </h3>
                        <ul className="space-y-3">
                          {doctor.education.map((edu, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                              <div>
                                <p className="font-medium text-slate-900">{edu.degree}</p>
                                <p className="text-sm text-slate-600">{edu.institution} • {edu.year}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Services */}
                    {doctor.services && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-3">Services</h3>
                        <div className="flex flex-wrap gap-2">
                          {doctor.services.map((service, index) => (
                            <span key={index} className="badge-primary">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {doctor.languages && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-3">Languages</h3>
                        <div className="flex flex-wrap gap-2">
                          {doctor.languages.map((lang, index) => (
                            <span key={index} className="badge-neutral">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Rating Summary */}
                    <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-xl">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-slate-900">{doctor.rating}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarSolidIcon 
                              key={star}
                              className={`w-4 h-4 ${star <= Math.round(doctor.rating) ? 'text-amber-400' : 'text-slate-200'}`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{doctor.reviewCount} reviews</p>
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {doctor.reviews?.map((review) => (
                        <div key={review.id} className="border-b border-slate-100 pb-4 last:border-0">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                                {review.patientName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{review.patientName}</p>
                                <p className="text-sm text-slate-500">{review.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarSolidIcon 
                                  key={star}
                                  className={`w-4 h-4 ${star <= review.rating ? 'text-amber-400' : 'text-slate-200'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-600 mt-3">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Tab */}
                {activeTab === 'location' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-slate-900">{doctor.location}</p>
                        <p className="text-slate-600">{doctor.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="w-5 h-5 text-primary-600" />
                      <p className="text-slate-600">{doctor.phone}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <EnvelopeIcon className="w-5 h-5 text-primary-600" />
                      <p className="text-slate-600">{doctor.email}</p>
                    </div>

                    {/* Map Placeholder */}
                    <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center mt-4">
                      <p className="text-slate-500">Map will be displayed here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-card sticky top-24">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-slate-900">
                  ${doctor.consultationFee}
                </p>
                <p className="text-slate-500">per consultation</p>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CalendarDaysIcon className="w-5 h-5 text-primary-600" />
                  Select Date
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {dates.map((date) => {
                    const formatted = formatDate(date);
                    const isSelected = selectedDate === formatted.full;
                    return (
                      <button
                        key={formatted.full}
                        onClick={() => setSelectedDate(formatted.full)}
                        className={`p-2 rounded-lg text-center transition-all ${
                          isSelected
                            ? 'bg-primary-600 text-white'
                            : 'bg-slate-50 hover:bg-primary-50 text-slate-700'
                        }`}
                      >
                        <p className="text-xs">{formatted.day}</p>
                        <p className="text-lg font-semibold">{formatted.date}</p>
                        <p className="text-xs">{formatted.month}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-primary-600" />
                  Select Time
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        selectedTime === time
                          ? 'bg-primary-600 text-white'
                          : 'bg-slate-50 hover:bg-primary-50 text-slate-700'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                className="w-full btn-primary py-3 text-lg"
              >
                Book Appointment
              </button>

              <p className="text-center text-sm text-slate-500 mt-4">
                Free cancellation up to 24 hours before
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}