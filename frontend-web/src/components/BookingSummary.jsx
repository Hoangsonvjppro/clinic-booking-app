import { Calendar, Clock, User, Mail, Phone, FileText, MapPin } from "lucide-react";

export default function BookingSummary({ doctor, bookingData, isDark }) {
  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Doctor Info */}
      <div className={`rounded-lg p-6 ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
        <h3 className="text-lg font-semibold mb-4">Thông Tin Bác Sĩ</h3>
        <div className="flex items-start space-x-4">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-lg">{doctor.name}</h4>
            <p className="text-blue-600 text-sm">{doctor.specialty}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <MapPin size={14} className="inline mr-1" />
              {doctor.hospital}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {doctor.location}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-yellow-500">
              ⭐ <span className="ml-1 font-semibold">{doctor.rating}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {doctor.experience}
            </p>
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className={`rounded-lg p-6 ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
        <h3 className="text-lg font-semibold mb-4">Chi Tiết Lịch Hẹn</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ngày khám</p>
              <p className="font-semibold">{formatDate(bookingData.date)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Clock size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Giờ khám</p>
              <p className="font-semibold">{bookingData.timeSlot}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Info */}
      <div className={`rounded-lg p-6 ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
        <h3 className="text-lg font-semibold mb-4">Thông Tin Bệnh Nhân</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <User size={20} className="text-gray-600 dark:text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Họ và tên</p>
              <p className="font-semibold">{bookingData.patientName}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Phone size={20} className="text-gray-600 dark:text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Số điện thoại</p>
              <p className="font-semibold">{bookingData.patientPhone}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Mail size={20} className="text-gray-600 dark:text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-semibold">{bookingData.patientEmail}</p>
            </div>
          </div>

          {bookingData.reason && (
            <div className="flex items-start space-x-3">
              <FileText size={20} className="text-gray-600 dark:text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Lý do khám</p>
                <p className="font-semibold">{bookingData.reason}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Price Info */}
      <div className={`rounded-lg p-6 border-2 ${isDark ? "bg-blue-900/20 border-blue-800" : "bg-blue-50 border-blue-200"}`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Phí khám dự kiến</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {doctor.priceRange}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              Thanh toán sau khám
            </p>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className={`rounded-lg p-4 ${isDark ? "bg-yellow-900/20" : "bg-yellow-50"}`}>
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          💡 <strong>Lưu ý:</strong> Vui lòng đến trước 15 phút so với giờ hẹn. 
          Mang theo CMND/CCCD và các kết quả xét nghiệm liên quan (nếu có).
        </p>
      </div>
    </div>
  );
}
