import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  StarIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { formatPhoneNumber, getInitials } from '../../utils/formatters';

const DoctorInformation = ({ doctor }) => {
  if (!doctor) return null;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => {
      const filled = index < Math.floor(rating);
      const partial = index === Math.floor(rating) && rating % 1 !== 0;
      
      return filled ? (
        <StarIconSolid key={index} className="w-5 h-5 text-yellow-400" />
      ) : partial ? (
        <div key={index} className="relative w-5 h-5">
          <StarIcon className="absolute w-5 h-5 text-yellow-400" />
          <div className="absolute overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
            <StarIconSolid className="w-5 h-5 text-yellow-400" />
          </div>
        </div>
      ) : (
        <StarIcon key={index} className="w-5 h-5 text-gray-300" />
      );
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with Avatar */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {doctor.avatar ? (
              <img
                src={doctor.avatar}
                alt={doctor.fullName}
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white flex items-center justify-center">
                <span className="text-4xl font-bold text-primary-600">
                  {getInitials(doctor.fullName)}
                </span>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1 text-white">
            <h1 className="text-3xl font-bold mb-2">{doctor.fullName}</h1>
            <p className="text-xl text-primary-100 mb-3">{doctor.specialty}</p>
            
            {/* Rating */}
            {doctor.rating && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">{renderStars(doctor.rating)}</div>
                <span className="text-white font-semibold">
                  {doctor.rating.toFixed(1)}
                </span>
                {doctor.reviewCount && (
                  <span className="text-primary-100">
                    ({doctor.reviewCount} reviews)
                  </span>
                )}
              </div>
            )}

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <BriefcaseIcon className="w-5 h-5" />
                <span>{doctor.yearsOfExperience || 0} years experience</span>
              </div>
              {doctor.totalPatients && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{doctor.totalPatients}+</span>
                  <span>patients treated</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
          <div className="space-y-3">
            {doctor.phone && (
              <div className="flex items-center gap-3 text-gray-700">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
                <span>{formatPhoneNumber(doctor.phone)}</span>
              </div>
            )}
            {doctor.email && (
              <div className="flex items-center gap-3 text-gray-700">
                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                <span>{doctor.email}</span>
              </div>
            )}
            {doctor.address && (
              <div className="flex items-center gap-3 text-gray-700">
                <MapPinIcon className="w-5 h-5 text-gray-400" />
                <span>{doctor.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* About */}
        {doctor.description && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
            <p className="text-gray-700 leading-relaxed">{doctor.description}</p>
          </div>
        )}

        {/* Education & Training */}
        {(doctor.education || doctor.training) && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AcademicCapIcon className="w-6 h-6 text-primary-600" />
              Education & Training
            </h3>
            <div className="space-y-2">
              {doctor.education && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{doctor.education}</p>
                </div>
              )}
              {doctor.training && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{doctor.training}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Languages */}
        {doctor.languages && doctor.languages.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <LanguageIcon className="w-6 h-6 text-primary-600" />
              Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {doctor.languages.map((lang, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Consultation Fee */}
        <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-gray-700">Consultation Fee</span>
          </div>
          <span className="text-2xl font-bold text-primary-600">
            ${doctor.consultationFee}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DoctorInformation;
