import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  StarIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { getDoctors, searchDoctors } from '../../api/doctorApi';
import toast from 'react-hot-toast';

const specialties = [
  'All Specialties',
  'General Medicine',
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'Ophthalmology',
  'Dentistry',
  'Gynecology',
  'Psychiatry',
];

const sortOptions = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'fee_low', label: 'Price: Low to High' },
  { value: 'fee_high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A-Z' },
];

export default function DoctorList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    specialty: searchParams.get('specialty') || 'All Specialties',
    sortBy: searchParams.get('sort') || 'rating',
    minRating: searchParams.get('minRating') || '',
    maxFee: searchParams.get('maxFee') || '',
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.specialty && filters.specialty !== 'All Specialties') {
        params.specialty = filters.specialty;
      }
      if (filters.sortBy) params.sort = filters.sortBy;
      
      const response = await getDoctors(params);
      setDoctors(response?.data || response || []);
    } catch (error) {
      console.error('Failed to load doctors:', error);
      // Mock data fallback
      setDoctors([
        { id: 1, fullName: 'Dr. Sarah Johnson', specialty: 'Cardiology', rating: 4.9, reviewCount: 124, consultationFee: 150, experience: 15, location: 'Medical Center', bio: 'Board-certified cardiologist with 15+ years of experience.' },
        { id: 2, fullName: 'Dr. Michael Chen', specialty: 'Neurology', rating: 4.8, reviewCount: 98, consultationFee: 180, experience: 12, location: 'City Hospital', bio: 'Specializing in neurological disorders and treatments.' },
        { id: 3, fullName: 'Dr. Emily Williams', specialty: 'Pediatrics', rating: 4.9, reviewCount: 156, consultationFee: 120, experience: 10, location: 'Children\'s Clinic', bio: 'Dedicated pediatrician caring for children of all ages.' },
        { id: 4, fullName: 'Dr. James Brown', specialty: 'Orthopedics', rating: 4.7, reviewCount: 87, consultationFee: 160, experience: 18, location: 'Bone & Joint Center', bio: 'Expert in sports medicine and joint replacement.' },
        { id: 5, fullName: 'Dr. Lisa Anderson', specialty: 'Dermatology', rating: 4.8, reviewCount: 112, consultationFee: 140, experience: 8, location: 'Skin Care Clinic', bio: 'Specializing in medical and cosmetic dermatology.' },
        { id: 6, fullName: 'Dr. Robert Taylor', specialty: 'General Medicine', rating: 4.6, reviewCount: 203, consultationFee: 100, experience: 20, location: 'Family Health Center', bio: 'Comprehensive primary care for the whole family.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadDoctors();
    
    // Update URL params
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.specialty !== 'All Specialties') params.set('specialty', filters.specialty);
    if (filters.sortBy) params.set('sort', filters.sortBy);
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      specialty: 'All Specialties',
      sortBy: 'rating',
      minRating: '',
      maxFee: '',
    });
    setSearchParams({});
  };

  const filteredDoctors = doctors.filter(doctor => {
    if (filters.specialty !== 'All Specialties' && doctor.specialty !== filters.specialty) {
      return false;
    }
    if (filters.minRating && doctor.rating < parseFloat(filters.minRating)) {
      return false;
    }
    if (filters.maxFee && doctor.consultationFee > parseFloat(filters.maxFee)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="container-custom py-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search doctors by name, specialty..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
            
            {/* Specialty Dropdown */}
            <div className="relative hidden md:block">
              <select
                value={filters.specialty}
                onChange={(e) => handleFilterChange('specialty', e.target.value)}
                className="appearance-none w-48 px-4 py-3 pr-10 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-700 cursor-pointer"
              >
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative hidden md:block">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="appearance-none w-44 px-4 py-3 pr-10 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-700 cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>

            {/* Filter Button (Mobile) */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-slate-600" />
            </button>

            <button type="submit" className="btn-primary px-6">
              Search
            </button>
          </form>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden mt-4 p-4 bg-slate-50 rounded-lg space-y-4 animate-slide-down">
              <div>
                <label className="input-label">Specialty</label>
                <select
                  value={filters.specialty}
                  onChange={(e) => handleFilterChange('specialty', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg"
                >
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="input-label">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {(filters.specialty !== 'All Specialties' || filters.search) && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-sm text-slate-500">Active filters:</span>
              {filters.specialty !== 'All Specialties' && (
                <span className="badge-primary flex items-center gap-1">
                  {filters.specialty}
                  <button onClick={() => handleFilterChange('specialty', 'All Specialties')}>
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              )}
              {filters.search && (
                <span className="badge-neutral flex items-center gap-1">
                  "{filters.search}"
                  <button onClick={() => handleFilterChange('search', '')}>
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container-custom py-8">
        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600">
            <span className="font-semibold text-slate-900">{filteredDoctors.length}</span> doctors found
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-slate-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <MagnifyingGlassIcon className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No doctors found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your search or filter criteria</p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Link
                key={doctor.id}
                to={`/doctors/${doctor.id}`}
                className="bg-white rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {doctor.imageUrl ? (
                      <img 
                        src={doctor.imageUrl} 
                        alt={doctor.fullName}
                        className="w-20 h-20 rounded-full object-cover border-4 border-slate-100"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                        {doctor.fullName?.charAt(0) || 'D'}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-medical-500 rounded-full flex items-center justify-center border-2 border-white">
                      <CheckBadgeIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors truncate">
                      {doctor.fullName}
                    </h3>
                    <p className="text-primary-600 font-medium text-sm mt-0.5">
                      {doctor.specialty || 'General Medicine'}
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      {doctor.experience || 10}+ years experience
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-2">
                      <StarSolidIcon className="w-4 h-4 text-amber-400" />
                      <span className="font-medium text-slate-900">{doctor.rating || 4.5}</span>
                      <span className="text-slate-400">({doctor.reviewCount || 0} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {doctor.bio && (
                  <p className="text-slate-600 text-sm mt-4 line-clamp-2">
                    {doctor.bio}
                  </p>
                )}

                {/* Location & Fee */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="truncate">{doctor.location || 'Medical Center'}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">
                      ${doctor.consultationFee || 100}
                    </p>
                    <p className="text-xs text-slate-500">per visit</p>
                  </div>
                </div>

                {/* Book Button */}
                <button className="w-full mt-4 btn-outline py-2.5 text-sm group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all">
                  Book Appointment
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}