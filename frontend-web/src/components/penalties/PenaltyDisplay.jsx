import React, { useState, useEffect } from 'react';
import { getMyActivePenalties, getMyPenaltyHistory } from '../../api/penaltyApi';
import PenaltyCard from './PenaltyCard';
import toast from 'react-hot-toast';

const PenaltyDisplay = ({ showHistory = true }) => {
  const [activePenalties, setActivePenalties] = useState([]);
  const [historyPenalties, setHistoryPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistoryTab, setShowHistoryTab] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });

  const fetchActivePenalties = async () => {
    try {
      const response = await getMyActivePenalties();
      setActivePenalties(response.data || []);
    } catch (error) {
      console.error('Error fetching active penalties:', error);
    }
  };

  const fetchHistoryPenalties = async (page = 0) => {
    try {
      const response = await getMyPenaltyHistory(page, pagination.size);
      setHistoryPenalties(response.data.content || []);
      setPagination({
        page: response.data.number || 0,
        size: response.data.size || 10,
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0,
      });
    } catch (error) {
      console.error('Error fetching penalty history:', error);
      toast.error('Không thể tải lịch sử hình phạt');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchActivePenalties();
      if (showHistory) {
        await fetchHistoryPenalties(0);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (showHistoryTab && showHistory) {
      fetchHistoryPenalties(0);
    }
  }, [showHistoryTab]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchHistoryPenalties(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Hình phạt</h2>
        {activePenalties.length > 0 && (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
            {activePenalties.length} đang áp dụng
          </span>
        )}
      </div>

      {/* Active Penalties Alert */}
      {activePenalties.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">
              Bạn đang có {activePenalties.length} hình phạt đang áp dụng
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      {showHistory && (
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setShowHistoryTab(false)}
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              !showHistoryTab
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Đang áp dụng ({activePenalties.length})
          </button>
          <button
            onClick={() => setShowHistoryTab(true)}
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              showHistoryTab
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Lịch sử ({pagination.totalElements})
          </button>
        </div>
      )}

      {/* Content */}
      {!showHistoryTab ? (
        activePenalties.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Không có hình phạt</h3>
            <p className="mt-1 text-gray-500">
              Bạn không có hình phạt nào đang áp dụng. Tiếp tục duy trì thói quen tốt!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activePenalties.map((penalty) => (
              <PenaltyCard key={penalty.id} penalty={penalty} />
            ))}
          </div>
        )
      ) : (
        <>
          {historyPenalties.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">Không có lịch sử</h3>
              <p className="mt-1 text-gray-500">Bạn chưa từng bị hình phạt nào.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {historyPenalties.map((penalty) => (
                  <PenaltyCard key={penalty.id} penalty={penalty} />
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
        </>
      )}
    </div>
  );
};

export default PenaltyDisplay;
