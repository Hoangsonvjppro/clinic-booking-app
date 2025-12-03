import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const WARNING_TYPE_CONFIG = {
  NO_SHOW: {
    label: 'Không đến theo lịch',
    icon: '🚫',
    color: 'red',
  },
  LATE_CANCELLATION: {
    label: 'Hủy lịch muộn',
    icon: '⏰',
    color: 'orange',
  },
  REPORTED: {
    label: 'Bị báo cáo',
    icon: '⚠️',
    color: 'yellow',
  },
  VIOLATION: {
    label: 'Vi phạm quy định',
    icon: '❌',
    color: 'red',
  },
  SYSTEM: {
    label: 'Cảnh báo hệ thống',
    icon: '🔔',
    color: 'blue',
  },
};

const SEVERITY_CONFIG = {
  LOW: { label: 'Nhẹ', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
  MEDIUM: { label: 'Trung bình', bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
  HIGH: { label: 'Nghiêm trọng', bgColor: 'bg-red-100', textColor: 'text-red-800' },
};

const WarningCard = ({ warning, onMarkAsRead, showActions = true }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  const typeConfig = WARNING_TYPE_CONFIG[warning.warningType] || {
    label: warning.warningType,
    icon: '⚠️',
    color: 'gray',
  };

  const severityConfig = SEVERITY_CONFIG[warning.severity] || SEVERITY_CONFIG.MEDIUM;

  const isExpired = warning.expiresAt && new Date(warning.expiresAt) < new Date();

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-5 border-l-4 ${
        warning.isRead ? 'border-gray-300 opacity-75' : `border-${typeConfig.color}-500`
      } ${isExpired ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{typeConfig.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold ${warning.isRead ? 'text-gray-600' : 'text-gray-800'}`}>
                {typeConfig.label}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityConfig.bgColor} ${severityConfig.textColor}`}>
                {severityConfig.label}
              </span>
              {!warning.isRead && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Mới
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-1">{warning.message}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>{formatDate(warning.createdAt)}</span>
              {warning.expiresAt && (
                <span className={isExpired ? 'text-red-500' : ''}>
                  {isExpired ? 'Đã hết hạn' : `Hết hạn: ${formatDate(warning.expiresAt)}`}
                </span>
              )}
            </div>
          </div>
        </div>

        {showActions && !warning.isRead && (
          <button
            onClick={() => onMarkAsRead?.(warning.id)}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Đánh dấu đã đọc
          </button>
        )}
      </div>

      {warning.relatedReportId && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            Liên quan đến báo cáo #{warning.relatedReportId.substring(0, 8)}...
          </span>
        </div>
      )}
    </div>
  );
};

export default WarningCard;
