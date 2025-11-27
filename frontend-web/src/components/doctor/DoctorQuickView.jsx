import { XMarkIcon, MapPinIcon, AcademicCapIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { formatCurrency } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

const DoctorQuickView = ({ doctor, onClose }) => {
  const navigate = useNavigate();

  if (!doctor) return null;

  const {
    id,
    fullName,
    specialty,
    address,
    description,
    consultationFee = 50,
    rating = 4.8,
    reviewCount = 0,
    avatar,
    yearsOfExperience,
    education,
    languages,
  } = doctor;

  const handleBookNow = () => {
    navigate(`/booking/${id}`);
  };

  const handleViewFull = () => {
    navigate(`/doctors/${id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Quick View</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Doctor Info */}
          <div className="flex items-start gap-6 mb-6">
            {/* Avatar */}
            {avatar ? (
              <img
                src={avatar}
                alt={fullName}
                className="w-24 h-24 rounded-full object-cover border-2 border-primary-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-white text-3xl font-bold">
                {fullName?.charAt(0) || 'D'}
              </div>
            )}

            {/* Details */}
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-1">
                Dr. {fullName}
              </h3>
              <p className="text-primary-600 font-medium mb-3">{specialty}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium text-gray-700">{rating}</span>
                <span className="text-gray-500">({reviewCount} reviews)</span>
              </div>

              {/* Consultation Fee */}
              <div className="inline-block px-4 py-2 bg-primary-50 rounded-lg">
                <span className="text-sm text-gray-600">Consultation fee: </span>
                <span className="text-lg font-bold text-primary-600">
                  {formatCurrency(consultationFee)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="space-y-3 mb-6">
            {address && (
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                <span className="text-gray-700">{address}</span>
              </div>
            )}

            {yearsOfExperience && (
              <div className="flex items-center gap-3">
                <BriefcaseIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{yearsOfExperience} years of experience</span>
              </div>
            )}

            {education && (
              <div className="flex items-start gap-3">
                <AcademicCapIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                <span className="text-gray-700">{education}</span>
              </div>
            )}

            {languages && languages.length > 0 && (
              <div className="flex items-start gap-3">
                <span className="text-gray-400">Languages:</span>
                <span className="text-gray-700">{languages.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">About</h4>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleBookNow}
              className="flex-1 px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              Book Appointment
            </button>
            <button
              onClick={handleViewFull}
              className="px-6 py-3 border-2 border-primary-500 text-primary-500 font-medium rounded-lg hover:bg-primary-50 transition-colors"
            >
              View Full Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorQuickView;
