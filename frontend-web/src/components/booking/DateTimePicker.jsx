import { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay, isBefore } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { TIME_SLOTS } from '../../utils/constants';

const DateTimePicker = ({ onSelect, selectedDate, selectedTime, bookedSlots = [] }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));

  const weekDays = [...Array(7)].map((_, i) => addDays(currentWeekStart, i));

  const handlePrevWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const isSlotBooked = (date, time) => {
    return bookedSlots.some(
      (slot) => isSameDay(new Date(slot.date), date) && slot.time === time
    );
  };

  const isSlotPast = (date, time) => {
    const slotDateTime = new Date(date);
    const [hours, minutes] = time.split(':');
    slotDateTime.setHours(parseInt(hours), parseInt(minutes));
    return isBefore(slotDateTime, new Date());
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Date & Time</h3>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevWeek}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <span className="font-medium text-gray-700">
          {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
        </span>
        <button
          onClick={handleNextWeek}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Date Selection */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekDays.map((date, index) => {
          const isSelected = selectedDate && isSameDay(date, new Date(selectedDate));
          const isPast = isBefore(date, new Date()) && !isSameDay(date, new Date());

          return (
            <button
              key={index}
              onClick={() => !isPast && onSelect({ date: format(date, 'yyyy-MM-dd'), time: null })}
              disabled={isPast}
              className={`p-3 rounded-lg text-center transition-all ${
                isSelected
                  ? 'bg-primary-500 text-white'
                  : isPast
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-50 hover:bg-primary-50 text-gray-700'
              }`}
            >
              <div className="text-xs font-medium mb-1">{format(date, 'EEE')}</div>
              <div className="text-lg font-semibold">{format(date, 'd')}</div>
            </button>
          );
        })}
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Available Time Slots</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {TIME_SLOTS.map((time) => {
              const isBooked = isSlotBooked(new Date(selectedDate), time);
              const isPast = isSlotPast(new Date(selectedDate), time);
              const isSelected = selectedTime === time;
              const isDisabled = isBooked || isPast;

              return (
                <button
                  key={time}
                  onClick={() => !isDisabled && onSelect({ date: selectedDate, time })}
                  disabled={isDisabled}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-primary-500 text-white'
                      : isDisabled
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-50 hover:bg-primary-50 text-gray-700'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Info */}
      {selectedDate && selectedTime && (
        <div className="mt-4 p-4 bg-primary-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Selected: </span>
            {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')} at {selectedTime}
          </p>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
