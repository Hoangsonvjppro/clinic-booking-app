import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, isBefore, startOfDay } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { getStatusColor } from '../../utils/formatters';

const PatientScheduler = ({ appointments = [], onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of week for calendar alignment
  const startDay = monthStart.getDay();
  const emptyDays = Array(startDay).fill(null);

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const getAppointmentsForDate = (date) => {
    return appointments.filter((apt) => 
      isSameDay(new Date(apt.appointmentDate), date)
    );
  };

  const hasAppointments = (date) => {
    return getAppointmentsForDate(date).length > 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Your Schedule</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-lg font-medium text-gray-900 min-w-[150px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Week Days */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for alignment */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Calendar days */}
          {daysInMonth.map((day) => {
            const dayAppointments = getAppointmentsForDate(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isPast = isBefore(day, startOfDay(new Date())) && !isToday(day);
            const hasApts = hasAppointments(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => onDateSelect?.(day)}
                disabled={isPast}
                className={`aspect-square p-2 rounded-lg text-sm font-medium transition-all relative ${
                  isSelected
                    ? 'bg-primary-600 text-white ring-2 ring-primary-300'
                    : isToday(day)
                    ? 'bg-primary-100 text-primary-700'
                    : isPast
                    ? 'text-gray-300 cursor-not-allowed'
                    : hasApts
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span>{format(day, 'd')}</span>
                  {hasApts && (
                    <div className="flex gap-1 mt-1">
                      {dayAppointments.slice(0, 3).map((apt, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-white' : getStatusColor(apt.status).replace('text-', 'bg-')
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Appointments for Selected Date */}
      {selectedDate && (
        <div className="border-t p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary-600" />
            Appointments on {format(selectedDate, 'MMMM d, yyyy')}
          </h4>
          
          {getAppointmentsForDate(selectedDate).length > 0 ? (
            <div className="space-y-2">
              {getAppointmentsForDate(selectedDate).map((apt) => (
                <div
                  key={apt.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{apt.doctorName}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(apt.appointmentDate), 'h:mm a')}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        apt.status
                      )} bg-opacity-10`}
                    >
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No appointments scheduled</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientScheduler;
