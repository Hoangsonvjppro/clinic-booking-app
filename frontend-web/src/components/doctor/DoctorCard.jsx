import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, ClockIcon } from '@heroicons/react/24/solid';
import { formatCurrency } from '../../utils/formatters';

const DoctorCard = ({ doctor }) => {
  const {
    id,
    userId,
    fullName,
    specialty,
    address,
    description,
    consultationFee = 50,
    rating = 4.8,
    reviewCount = 0,
    avatar,
    yearsOfExperience,
  } = doctor;

  return (
    <Link
      to={`/doctors/${id}`}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col h-full border border-gray-100 hover:border-primary-300"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={fullName}
              className="w-20 h-20 rounded-full object-cover border-2 border-primary-500"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
              {fullName?.charAt(0) || 'D'}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-gray-900 mb-1 truncate">
            Dr. {fullName}
          </h3>
          <p className="text-sm text-primary-600 font-medium mb-2">{specialty}</p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">{rating}</span>
            <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4 flex-1">
        {/* Location */}
        {address && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPinIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{address}</span>
          </div>
        )}

        {/* Experience */}
        {yearsOfExperience && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ClockIcon className="w-5 h-5 flex-shrink-0" />
            <span>{yearsOfExperience} years of experience</span>
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-2">{description}</p>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
        <div>
          <span className="text-xs text-gray-500">Consultation fee</span>
          <p className="text-lg font-bold text-primary-600">
            {formatCurrency(consultationFee)}
          </p>
        </div>

        <button className="px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors">
          Book Now
        </button>
      </div>
    </Link>
  );
};

export default DoctorCard;
