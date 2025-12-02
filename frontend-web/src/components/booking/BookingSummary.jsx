import { formatDate, formatCurrency } from '../../utils/formatters';
import { CalendarIcon, ClockIcon, UserIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const BookingSummary = ({ doctor, date, time, patientInfo, onConfirm, onEdit }) => {
  if (!doctor || !date || !time) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h3>

      <div className="space-y-4">
        {/* Doctor Info */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
          {doctor.avatar ? (
            <img
              src={doctor.avatar}
              alt={doctor.fullName}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-xl font-bold">
              {doctor.fullName?.charAt(0) || 'D'}
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-900">Dr. {doctor.fullName}</h4>
            <p className="text-sm text-primary-600">{doctor.specialty}</p>
            <p className="text-sm text-gray-600 mt-1">{doctor.address}</p>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            <span>{formatDate(date)}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <ClockIcon className="w-5 h-5 text-gray-400" />
            <span>{time}</span>
          </div>

          {patientInfo && (
            <div className="flex items-center gap-3 text-gray-700">
              <UserIcon className="w-5 h-5 text-gray-400" />
              <span>{patientInfo.fullName}</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-gray-700">
            <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
            <span className="font-semibold">{formatCurrency(doctor.consultationFee || 50)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <button
            onClick={onConfirm}
            className="w-full px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
          >
            Confirm Booking
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Edit Appointment
            </button>
          )}
        </div>
      </div>

      {/* Terms */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-gray-600">
          <span className="font-medium">Note:</span> You can cancel or reschedule this appointment
          up to 24 hours before the scheduled time.
        </p>
      </div>
    </div>
  );
};

export default BookingSummary;
