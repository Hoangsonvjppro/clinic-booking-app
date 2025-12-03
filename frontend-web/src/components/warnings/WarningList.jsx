import React, { useState, useEffect } from 'react';
import { getMyWarnings, markWarningAsRead, markAllWarningsAsRead, getUnreadWarningCount } from '../../api/warningApi';
import WarningCard from './WarningCard';
import toast from 'react-hot-toast';

const WarningList = () => {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [includeExpired, setIncludeExpired] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });

  const fetchWarnings = async (page = 0) => {
    try {
      setLoading(true);
      const [warningsRes, countRes] = await Promise.all([
        getMyWarnings(includeExpired, page, pagination.size),
        getUnreadWarningCount(),
      ]);
      
      setWarnings(warningsRes.data.content || []);
      setPagination({
        page: warningsRes.data.number || 0,
        size: warningsRes.data.size || 10,
        totalElements: warningsRes.data.totalElements || 0,
        totalPages: warningsRes.data.totalPages || 0,
      });
      setUnreadCount(countRes.data || 0);
    } catch (error) {
      console.error('Error fetching warnings:', error);
      toast.error('Không thể tải danh sách cảnh báo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarnings(0);
  }, [includeExpired]);

  const handleMarkAsRead = async (warningId) => {
    try {
      await markWarningAsRead(warningId);
      setWarnings((prev) =>
        prev.map((w) => (w.id === warningId ? { ...w, isRead: true } : w))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success('Đã đánh dấu đã đọc');
    } catch (error) {
      console.error('Error marking warning as read:', error);
      toast.error('Không thể đánh dấu đã đọc');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllWarningsAsRead();
      setWarnings((prev) => prev.map((w) => ({ ...w, isRead: true })));
      setUnreadCount(0);
      toast.success('Đã đánh dấu tất cả là đã đọc');
    } catch (error) {
      console.error('Error marking all warnings as read:', error);
      toast.error('Không thể đánh dấu tất cả');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchWarnings(newPage);
    }
  };

  if (loading && warnings.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Cảnh báo</h2>
          {unreadCount > 0 && (
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              {unreadCount} chưa đọc
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={includeExpired}
              onChange={(e) => setIncludeExpired(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Hiển thị đã hết hạn
          </label>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>
      </div>

      {warnings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Không có cảnh báo</h3>
          <p className="mt-1 text-gray-500">
            Bạn không có cảnh báo nào. Tiếp tục duy trì thói quen tốt!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {warnings.map((warning) => (
              <WarningCard
                key={warning.id}
                warning={warning}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <span className="text-gray-600">
                Trang {pagination.page + 1} / {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages - 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WarningList;
