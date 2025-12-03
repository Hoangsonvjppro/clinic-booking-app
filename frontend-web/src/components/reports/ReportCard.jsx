import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  REVIEWING: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
};

const STATUS_LABELS = {
  PENDING: 'Chờ xử lý',
  REVIEWING: 'Đang xem xét',
  RESOLVED: 'Đã xử lý',
};

const REPORT_TYPE_LABELS = {
  UNPROFESSIONAL_BEHAVIOR: 'Hành vi không chuyên nghiệp',
  LATE_CANCELLATION: 'Hủy lịch muộn',
  NO_SHOW: 'Không đến theo lịch',
  OVERCHARGING: 'Tính phí quá cao',
  POOR_SERVICE: 'Dịch vụ kém',
  HARASSMENT: 'Quấy rối',
  ABUSIVE_BEHAVIOR: 'Hành vi lạm dụng',
  FAKE_BOOKING: 'Đặt lịch giả',
  OTHER: 'Khác',
};

const RESOLUTION_LABELS = {
  DISMISSED: 'Bác bỏ',
  WARNING_ISSUED: 'Đã cảnh báo',
  PENALTY_APPLIED: 'Đã xử phạt',
  ACCOUNT_SUSPENDED: 'Tài khoản bị tạm ngưng',
  ACCOUNT_BANNED: 'Tài khoản bị cấm',
};

const ReportCard = ({ report, onClick, showReported = true }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
      onClick={() => onClick?.(report)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">{report.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {REPORT_TYPE_LABELS[report.reportType] || report.reportType}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[report.status]}`}>
          {STATUS_LABELS[report.status] || report.status}
        </span>
      </div>

      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{report.description}</p>

      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
        {showReported && report.reportedName && (
          <div>
            <span className="text-gray-400">Người bị báo cáo:</span>{' '}
            <span className="text-gray-700">{report.reportedName}</span>
          </div>
        )}
        <div>
          <span className="text-gray-400">Ngày:</span>{' '}
          <span className="text-gray-700">{formatDate(report.createdAt)}</span>
        </div>
      </div>

      {report.status === 'RESOLVED' && report.resolution && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-sm text-gray-500">Kết quả: </span>
          <span className="text-sm font-medium text-gray-700">
            {RESOLUTION_LABELS[report.resolution] || report.resolution}
          </span>
        </div>
      )}
    </div>
  );
};

export default ReportCard;
