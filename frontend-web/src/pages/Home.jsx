import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon,
  HeartIcon,
  StarIcon,
  ArrowRightIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { getDoctors } from '../api/doctorApi';
import toast from 'react-hot-toast';

// Specialty data
const specialties = [
  { id: 1, name: 'General Medicine', icon: '🩺', description: 'Primary care & checkups' },
  { id: 2, name: 'Cardiology', icon: '❤️', description: 'Heart & cardiovascular' },
  { id: 3, name: 'Dermatology', icon: '🧴', description: 'Skin care & treatment' },
  { id: 4, name: 'Pediatrics', icon: '👶', description: 'Child healthcare' },
  { id: 5, name: 'Orthopedics', icon: '🦴', description: 'Bones & joints' },
  { id: 6, name: 'Neurology', icon: '🧠', description: 'Brain & nervous system' },
  { id: 7, name: 'Ophthalmology', icon: '👁️', description: 'Eye care & vision' },
  { id: 8, name: 'Dentistry', icon: '🦷', description: 'Dental care' },
];

const stats = [
  { label: 'Expert Doctors', value: '50+', icon: UserGroupIcon },
  { label: 'Happy Patients', value: '10K+', icon: HeartIcon },
  { label: 'Years Experience', value: '15+', icon: ShieldCheckIcon },
  { label: 'Available 24/7', value: '24/7', icon: ClockIcon },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadFeaturedDoctors();
  }, []);

  const loadFeaturedDoctors = async () => {
    try {
      const response = await getDoctors({ limit: 4, sort: 'rating' });
      setFeaturedDoctors(response?.data || response || []);
    } catch (error) {
      console.error('Failed to load doctors:', error);
      // Mock data fallback
      setFeaturedDoctors([
        { id: 1, fullName: 'Dr. Sarah Johnson', specialty: 'Cardiology', rating: 4.9, reviewCount: 124, consultationFee: 150, imageUrl: null },
        { id: 2, fullName: 'Dr. Michael Chen', specialty: 'Neurology', rating: 4.8, reviewCount: 98, consultationFee: 180, imageUrl: null },
        { id: 3, fullName: 'Dr. Emily Williams', specialty: 'Pediatrics', rating: 4.9, reviewCount: 156, consultationFee: 120, imageUrl: null },
        { id: 4, fullName: 'Dr. James Brown', specialty: 'Orthopedics', rating: 4.7, reviewCount: 87, consultationFee: 160, imageUrl: null },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-medical-50">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-medical-100 rounded-full opacity-50 blur-3xl"></div>
        </div>

        <div className="relative container-custom py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <ShieldCheckIcon className="w-4 h-4" />
                Trusted Healthcare Platform
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Your Health,{' '}
                <span className="text-primary-600">Our Priority</span>
              </h1>
              
              <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
                Connect with top-rated doctors, book appointments instantly, and receive quality healthcare from the comfort of your home.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto lg:mx-0">
                <div className="relative flex items-center">
                  <MagnifyingGlassIcon className="absolute left-4 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search doctors, specialties, symptoms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-32 py-4 bg-white border border-slate-200 rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 btn-primary py-2.5 px-6"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Quick actions */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link to="/doctors" className="btn-outline flex items-center gap-2">
                  <CalendarDaysIcon className="w-5 h-5" />
                  Book Appointment
                </Link>
                <Link to="/doctors" className="btn-ghost flex items-center gap-2">
                  Find a Doctor
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right content - Hero Image */}
            <div className="relative hidden lg:block animate-slide-up">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Decorative circles */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-medical-200 rounded-full opacity-20"></div>
                <div className="absolute inset-8 bg-gradient-to-br from-primary-100 to-medical-100 rounded-full"></div>
                
                {/* Main image placeholder */}
                <div className="absolute inset-16 bg-white rounded-full shadow-elevated flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-4">
                      <HeartIcon className="w-12 h-12 text-primary-600" />
                    </div>
                    <p className="text-slate-600 font-medium">Quality Healthcare</p>
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute top-20 -left-4 bg-white rounded-xl shadow-card p-4 animate-pulse-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-medical-100 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="w-6 h-6 text-medical-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Verified Doctors</p>
                      <p className="text-xs text-slate-500">100% Certified</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-20 -right-4 bg-white rounded-xl shadow-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <CalendarDaysIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Easy Booking</p>
                      <p className="text-xs text-slate-500">Book in 2 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-card hover:shadow-elevated transition-all duration-300"
              >
                <stat.icon className="w-8 h-8 mx-auto text-primary-600 mb-3" />
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Browse by Specialty</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Find the right specialist for your healthcare needs from our wide range of medical departments.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {specialties.map((specialty) => (
              <Link
                key={specialty.id}
                to={`/doctors?specialty=${encodeURIComponent(specialty.name)}`}
                className="group bg-slate-50 hover:bg-primary-50 rounded-xl p-6 text-center transition-all duration-300 hover:shadow-card"
              >
                <div className="text-4xl mb-3">{specialty.icon}</div>
                <h3 className="font-semibold text-slate-900 group-hover:text-primary-700 transition-colors">
                  {specialty.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{specialty.description}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/doctors" className="btn-outline inline-flex items-center gap-2">
              View All Specialties
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Doctors</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Meet our highly qualified medical professionals ready to provide you with the best care.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-5 bg-slate-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredDoctors.map((doctor) => (
                <Link
                  key={doctor.id}
                  to={`/doctors/${doctor.id}`}
                  className="card-hover text-center group"
                >
                  {/* Avatar */}
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    {doctor.imageUrl ? (
                      <img 
                        src={doctor.imageUrl} 
                        alt={doctor.fullName}
                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                        {doctor.fullName?.charAt(0) || 'D'}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-medical-500 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                    {doctor.fullName}
                  </h3>
                  <p className="text-sm text-primary-600 font-medium mt-1">
                    {doctor.specialty || 'General Medicine'}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarSolidIcon 
                        key={star}
                        className={`w-4 h-4 ${star <= Math.round(doctor.rating || 4.5) ? 'text-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                    <span className="text-sm text-slate-600 ml-1">
                      ({doctor.reviewCount || 0})
                    </span>
                  </div>

                  {/* Fee */}
                  <p className="text-lg font-semibold text-slate-900 mt-3">
                    ${doctor.consultationFee || 100}
                    <span className="text-sm font-normal text-slate-500"> /visit</span>
                  </p>

                  {/* Book button */}
                  <button className="mt-4 w-full btn-outline py-2 text-sm group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all">
                    Book Appointment
                  </button>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/doctors" className="btn-primary inline-flex items-center gap-2">
              View All Doctors
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Book your appointment in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Search Doctor',
                description: 'Browse through our extensive list of qualified doctors or search by specialty.',
                icon: MagnifyingGlassIcon,
                color: 'primary',
              },
              {
                step: '02',
                title: 'Book Appointment',
                description: 'Select your preferred date and time slot that fits your schedule.',
                icon: CalendarDaysIcon,
                color: 'medical',
              },
              {
                step: '03',
                title: 'Get Consultation',
                description: 'Visit the doctor at the scheduled time and receive quality healthcare.',
                icon: HeartIcon,
                color: 'primary',
              },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-slate-200">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary-500 rounded-full"></div>
                  </div>
                )}
                
                {/* Step number */}
                <div className={`relative z-10 w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                  item.color === 'medical' ? 'bg-medical-100' : 'bg-primary-100'
                }`}>
                  <item.icon className={`w-10 h-10 ${
                    item.color === 'medical' ? 'text-medical-600' : 'text-primary-600'
                  }`} />
                </div>
                
                <div className={`inline-block mt-4 px-3 py-1 rounded-full text-xs font-bold ${
                  item.color === 'medical' ? 'bg-medical-100 text-medical-700' : 'bg-primary-100 text-primary-700'
                }`}>
                  STEP {item.step}
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 mt-4">{item.title}</h3>
                <p className="text-slate-600 mt-2 max-w-xs mx-auto">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Take Care of Your Health?
          </h2>
          <p className="mt-4 text-primary-100 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied patients who trust ClinicCare for their healthcare needs.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-all shadow-lg">
              Get Started Free
            </Link>
            <Link to="/doctors" className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all">
              Browse Doctors
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <PhoneIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-400">24/7 Support</p>
                <p className="text-lg font-semibold">1-800-CLINIC</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-12 h-12 bg-medical-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPinIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Main Location</p>
                <p className="text-lg font-semibold">123 Medical Center Ave</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <ClockIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Working Hours</p>
                <p className="text-lg font-semibold">Mon-Sun: 24 Hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}