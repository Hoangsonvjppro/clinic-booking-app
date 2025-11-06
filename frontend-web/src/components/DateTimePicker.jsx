import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import { motion } from "motion/react";

export default function DateTimePicker({ isDark, selectedDate, selectedTime, onDateTimeSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(selectedDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(selectedTime);

  // Sample unavailable dates (can be fetched from API)
  const unavailableDates = [
    new Date(2025, 10, 10).toDateString(),
    new Date(2025, 10, 15).toDateString(),
    new Date(2025, 10, 20).toDateString(),
  ];

  // Sample booked time slots (can be fetched from API based on selected date)
  const bookedTimeSlots = {
    [new Date(2025, 10, 8).toDateString()]: ["08:00", "09:00", "14:00"],
    [new Date(2025, 10, 9).toDateString()]: ["10:00", "11:00", "15:30"],
  };

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  ];

  const monthNames = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
  ];

  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateUnavailable = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Past dates are unavailable
    if (date < today) return true;
    
    // Check if date is in unavailable list
    return unavailableDates.includes(date.toDateString());
  };

  const isDateSelected = (date) => {
    if (!date || !selectedDay) return false;
    return date.toDateString() === selectedDay.toDateString();
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (date) => {
    if (!date || isDateUnavailable(date)) return;
    setSelectedDay(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  };

  const handleTimeSelect = (time) => {
    const dateKey = selectedDay?.toDateString();
    const isBooked = bookedTimeSlots[dateKey]?.includes(time);
    
    if (isBooked) return;
    
    setSelectedTimeSlot(time);
    onDateTimeSelect(selectedDay, time);
  };

  const isTimeSlotBooked = (time) => {
    if (!selectedDay) return false;
    const dateKey = selectedDay.toDateString();
    return bookedTimeSlots[dateKey]?.includes(time) || false;
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar Section */}
      <div className={`rounded-lg p-6 ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <Calendar size={20} className="mr-2 text-blue-600" />
            Chọn Ngày
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevMonth}
              className={`p-2 rounded-lg transition-all ${
                isDark
                  ? "hover:bg-slate-800 text-gray-300"
                  : "hover:bg-gray-200 text-gray-600"
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-semibold text-lg min-w-[140px] text-center">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              onClick={handleNextMonth}
              className={`p-2 rounded-lg transition-all ${
                isDark
                  ? "hover:bg-slate-800 text-gray-300"
                  : "hover:bg-gray-200 text-gray-600"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const unavailable = isDateUnavailable(date);
            const selected = isDateSelected(date);
            const today = isToday(date);

            return (
              <motion.button
                key={date.toDateString()}
                onClick={() => handleDateSelect(date)}
                disabled={unavailable}
                whileHover={!unavailable ? { scale: 1.05 } : {}}
                whileTap={!unavailable ? { scale: 0.95 } : {}}
                className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                  selected
                    ? "bg-blue-600 text-white shadow-lg"
                    : unavailable
                    ? isDark
                      ? "bg-slate-800 text-gray-600 cursor-not-allowed line-through"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed line-through"
                    : today
                    ? isDark
                      ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    : isDark
                    ? "bg-slate-800 text-gray-300 hover:bg-slate-700"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {date.getDate()}
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-blue-600 mr-2"></div>
            <span className="text-gray-600 dark:text-gray-400">Đã chọn</span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded mr-2 ${isDark ? "bg-blue-900/30" : "bg-blue-100"}`}></div>
            <span className="text-gray-600 dark:text-gray-400">Hôm nay</span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded mr-2 ${isDark ? "bg-slate-800" : "bg-gray-200"}`}></div>
            <span className="text-gray-600 dark:text-gray-400">Không khả dụng</span>
          </div>
        </div>
      </div>

      {/* Time Slots Section */}
      <div className={`rounded-lg p-6 ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <Clock size={20} className="mr-2 text-green-600" />
          Chọn Giờ
        </h3>

        {!selectedDay ? (
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <Calendar size={48} className="mx-auto mb-3 opacity-50" />
              <p>Vui lòng chọn ngày trước</p>
            </div>
          </div>
        ) : (
          <div>
            <div className={`rounded-lg p-3 mb-4 ${isDark ? "bg-blue-900/20" : "bg-blue-50"}`}>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                📅 {selectedDay.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-2">
              {timeSlots.map((time) => {
                const booked = isTimeSlotBooked(time);
                const selected = selectedTimeSlot === time;

                return (
                  <motion.button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    disabled={booked}
                    whileHover={!booked ? { scale: 1.05 } : {}}
                    whileTap={!booked ? { scale: 0.95 } : {}}
                    className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                      selected
                        ? "bg-green-600 text-white shadow-lg"
                        : booked
                        ? isDark
                          ? "bg-slate-800 text-gray-600 cursor-not-allowed"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : isDark
                        ? "bg-slate-800 text-gray-300 hover:bg-slate-700"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {time}
                    {booked && <div className="text-xs text-red-500 mt-1">Đã đặt</div>}
                  </motion.button>
                );
              })}
            </div>

            {/* Selected Time Display */}
            {selectedTimeSlot && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-lg ${isDark ? "bg-green-900/20 border border-green-800" : "bg-green-50 border border-green-200"}`}
              >
                <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                  ✓ Đã chọn: {selectedTimeSlot}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
