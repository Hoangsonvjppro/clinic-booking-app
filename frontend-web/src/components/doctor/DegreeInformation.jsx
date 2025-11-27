import { 
  AcademicCapIcon, 
  DocumentTextIcon,
  ShieldCheckIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const DegreeInformation = ({ degrees = [], certifications = [], licenseNumber, licenseExpiry }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <AcademicCapIcon className="w-8 h-8 text-primary-600" />
        Professional Credentials
      </h2>

      {/* License Information */}
      {licenseNumber && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 mb-1">Medical License</h3>
              <p className="text-green-700 font-mono text-sm mb-1">
                License #: {licenseNumber}
              </p>
              {licenseExpiry && (
                <p className="text-green-600 text-xs flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  Valid until: {format(new Date(licenseExpiry), 'MMMM d, yyyy')}
                </p>
              )}
              <span className="inline-block mt-2 px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded">
                VERIFIED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Degrees */}
      {degrees.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AcademicCapIcon className="w-5 h-5 text-primary-600" />
            Academic Degrees
          </h3>
          <div className="space-y-3">
            {degrees.map((degree, index) => (
              <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{degree.degree}</h4>
                    <p className="text-gray-700 mt-1">{degree.field}</p>
                    <p className="text-gray-600 text-sm mt-1">{degree.institution}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-primary-600">
                      {degree.year}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-primary-600" />
            Certifications & Specializations
          </h3>
          <div className="space-y-3">
            {certifications.map((cert, index) => (
              <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                    <p className="text-gray-600 text-sm mt-1">{cert.issuingOrganization}</p>
                    {cert.description && (
                      <p className="text-gray-600 text-sm mt-2">{cert.description}</p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <span className="text-sm font-medium text-blue-600">
                      {cert.year}
                    </span>
                    {cert.expiryDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Expires: {format(new Date(cert.expiryDate), 'MM/yyyy')}
                      </p>
                    )}
                  </div>
                </div>
                {cert.verified && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                    VERIFIED
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {degrees.length === 0 && certifications.length === 0 && !licenseNumber && (
        <div className="text-center py-8 text-gray-500">
          <AcademicCapIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No credential information available</p>
        </div>
      )}
    </div>
  );
};

export default DegreeInformation;
