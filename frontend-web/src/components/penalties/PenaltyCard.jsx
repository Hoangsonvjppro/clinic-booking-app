import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const PENALTY_TYPE_CONFIG = {
  BOOKING_RESTRICTION: {
    label: 'Hạn chế đặt lịch',
    icon: '🚫',
    description: 'Bạn bị hạn chế số lần đặt lịch trong thời gian này.',
  },
  FEE_INCREASE: {
    label: 'Tăng phí',
    icon: '💰',
    description: 'Phí dịch vụ của bạn sẽ tăng trong thời gian này.',
  },
  FEATURE_LOCK: {
    label: 'Khóa tính năng',
    icon: '🔒',
    description: 'Một số tính năng bị khóa trong thời gian này.',
  },
  TEMPORARY_SUSPENSION: {
    label: 'Tạm ngưng tài khoản',
    icon: '⏸️',
    description: 'Tài khoản của bạn bị tạm ngưng trong thời gian này.',
  },
};

const PenaltyCard = ({ penalty }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  const isActive = () => {
    const now = new Date();
    const effectiveFrom = new Date(penalty.effectiveFrom);
    const effectiveUntil = penalty.effectiveUntil ? new Date(penalty.effectiveUntil) : null;
    
    return effectiveFrom <= now && (!effectiveUntil || effectiveUntil > now);
  };

  const getTimeRemaining = () => {
    if (!penalty.effectiveUntil) return 'Vĩnh viễn';
    
    const now = new Date();
    const until = new Date(penalty.effectiveUntil);
    const diff = until - now;
    
    if (diff <= 0) return 'Đã hết hạn';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} ngày ${hours} giờ`;
    return `${hours} giờ`;
  };

  const typeConfig = PENALTY_TYPE_CONFIG[penalty.penaltyType] || {
    label: penalty.penaltyType,
    icon: '⚠️',
    description: 'Bạn đang bị hình phạt.',
  };

  const active = isActive();

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
        active ? 'border-red-500' : 'border-gray-300 opacity-60'
      }`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <span className="text-3xl">{typeConfig.icon}</span>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-gray-800">{typeConfig.label}</h3>
              {active ? (
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  Đang áp dụng
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                  Đã hết hạn
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-1">{penalty.reason || typeConfig.description}</p>

            {penalty.multiplier && penalty.multiplier > 1 && (
              <div className="mt-2 p-2 bg-orange-50 rounded-lg inline-block">
                <span className="text-orange-700 font-medium">
                  Hệ số phạt: x{penalty.multiplier}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Bắt đầu:</span>
            <p className="text-gray-700 font-medium">{formatDate(penalty.effectiveFrom)}</p>
          </div>
          <div>
            <span className="text-gray-500">Kết thúc:</span>
            <p className="text-gray-700 font-medium">
              {penalty.effectiveUntil ? formatDate(penalty.effectiveUntil) : 'Vĩnh viễn'}
            </p>
          </div>
          {active && (
            <div>
              <span className="text-gray-500">Còn lại:</span>
              <p className="text-red-600 font-medium">{getTimeRemaining()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PenaltyCard;
