import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

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

const ReportDetailModal = ({ report, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Chi tiết báo cáo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title & Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {REPORT_TYPE_LABELS[report.reportType] || report.reportType}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                report.status === 'REVIEWING' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {STATUS_LABELS[report.status] || report.status}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Mô tả</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{report.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Người báo cáo</h4>
              <p className="text-gray-700">{report.reporterName || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Người bị báo cáo</h4>
              <p className="text-gray-700">{report.reportedName || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Ngày tạo</h4>
              <p className="text-gray-700">{formatDate(report.createdAt)}</p>
            </div>
            {report.appointmentId && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Mã lịch hẹn</h4>
                <p className="text-gray-700 font-mono text-sm">{report.appointmentId}</p>
              </div>
            )}
          </div>

          {/* Evidence */}
          {report.evidenceUrls && report.evidenceUrls.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Bằng chứng</h4>
              <div className="flex flex-wrap gap-2">
                {report.evidenceUrls.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg text-sm text-blue-600 hover:bg-gray-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Tệp {index + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Resolution (if resolved) */}
          {report.status === 'RESOLVED' && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Kết quả xử lý</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {report.resolution && (
                  <div>
                    <span className="text-sm text-gray-500">Quyết định: </span>
                    <span className="font-medium text-gray-900">
                      {RESOLUTION_LABELS[report.resolution] || report.resolution}
                    </span>
                  </div>
                )}
                {report.adminNote && (
                  <div>
                    <span className="text-sm text-gray-500">Ghi chú: </span>
                    <span className="text-gray-700">{report.adminNote}</span>
                  </div>
                )}
                {report.resolvedAt && (
                  <div>
                    <span className="text-sm text-gray-500">Ngày xử lý: </span>
                    <span className="text-gray-700">{formatDate(report.resolvedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
