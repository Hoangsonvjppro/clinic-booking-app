import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  NoSymbolIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import {
  getAllPenalties,
  createPenalty,
  revokePenalty,
} from '../../api/adminApi';

const PENALTY_TYPE_OPTIONS = [
  { value: 'BOOKING_RESTRICTION', label: 'Hạn chế đặt lịch' },
  { value: 'FEE_INCREASE', label: 'Tăng phí' },
  { value: 'FEATURE_LOCK', label: 'Khóa tính năng' },
  { value: 'TEMPORARY_SUSPENSION', label: 'Tạm ngưng tài khoản' },
];

export default function PenaltyManagement() {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    penaltyType: '',
    activeOnly: true,
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });
  const [createForm, setCreateForm] = useState({
    userId: '',
    penaltyType: 'BOOKING_RESTRICTION',
    reason: '',
    multiplier: '1.0',
    effectiveFrom: '',
    effectiveUntil: '',
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  const fetchPenalties = async (page = 0) => {
    try {
      setLoading(true);
      const response = await getAllPenalties(
        filters.penaltyType,
        filters.activeOnly,
        page,
        pagination.size
      );
      setPenalties(response.data.content || []);
      setPagination({
        page: response.data.number || 0,
        size: response.data.size || 10,
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0,
      });
    } catch (error) {
      console.error('Error fetching penalties:', error);
      toast.error('Không thể tải danh sách hình phạt');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPenalties(0);
  }, [filters.penaltyType, filters.activeOnly]);

  const handleCreatePenalty = async () => {
    if (!createForm.userId || !createForm.reason) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const payload = {
        ...createForm,
        multiplier: parseFloat(createForm.multiplier) || 1.0,
        effectiveFrom: createForm.effectiveFrom
          ? new Date(createForm.effectiveFrom).toISOString()
          : new Date().toISOString(),
        effectiveUntil: createForm.effectiveUntil
          ? new Date(createForm.effectiveUntil).toISOString()
          : null,
      };
      await createPenalty(payload);
      toast.success('Đã tạo hình phạt thành công');
      setShowCreateModal(false);
      setCreateForm({
        userId: '',
        penaltyType: 'BOOKING_RESTRICTION',
        reason: '',
        multiplier: '1.0',
        effectiveFrom: '',
        effectiveUntil: '',
      });
      fetchPenalties(pagination.page);
    } catch (error) {
      console.error('Error creating penalty:', error);
      toast.error('Không thể tạo hình phạt');
    }
  };

  const handleRevokePenalty = async (penaltyId) => {
    if (!window.confirm('Bạn có chắc muốn thu hồi hình phạt này?')) return;

    try {
      await revokePenalty(penaltyId);
      toast.success('Đã thu hồi hình phạt');
      fetchPenalties(pagination.page);
    } catch (error) {
      console.error('Error revoking penalty:', error);
      toast.error('Không thể thu hồi hình phạt');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchPenalties(newPage);
    }
  };

  const isActive = (penalty) => {
    const now = new Date();
    const effectiveFrom = new Date(penalty.effectiveFrom);
    const effectiveUntil = penalty.effectiveUntil ? new Date(penalty.effectiveUntil) : null;
    return effectiveFrom <= now && (!effectiveUntil || effectiveUntil > now);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <NoSymbolIcon className="w-8 h-8 text-red-600" />
            Quản lý hình phạt
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <PlusIcon className="w-5 h-5" />
            Tạo hình phạt
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={filters.penaltyType}
                onChange={(e) => setFilters({ ...filters, penaltyType: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tất cả loại</option>
                {PENALTY_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={filters.activeOnly}
                  onChange={(e) => setFilters({ ...filters, activeOnly: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                Chỉ đang áp dụng
              </label>
            </div>
            <div className="flex-1 max-w-md relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Penalties Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
          ) : penalties.length === 0 ? (
            <div className="text-center py-12">
              <NoSymbolIcon className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Không có hình phạt</h3>
              <p className="text-gray-500">Chưa có hình phạt nào được tạo.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Người dùng</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Loại</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Lý do</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Hệ số</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Bắt đầu</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Kết thúc</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {penalties.map((penalty) => {
                  const active = isActive(penalty);
                  return (
                    <tr key={penalty.id} className={`hover:bg-gray-50 ${!active ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4 text-sm text-gray-900">{penalty.userName || penalty.userId}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {PENALTY_TYPE_OPTIONS.find((opt) => opt.value === penalty.penaltyType)?.label || penalty.penaltyType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{penalty.reason}</td>
                      <td className="px-6 py-4 text-sm">
                        {penalty.multiplier && penalty.multiplier > 1 ? (
                          <span className="text-orange-600 font-medium">x{penalty.multiplier}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(penalty.effectiveFrom)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {penalty.effectiveUntil ? formatDate(penalty.effectiveUntil) : 'Vĩnh viễn'}
                      </td>
                      <td className="px-6 py-4">
                        {active ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Đang áp dụng</span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">Hết hạn</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          {active && (
                            <button
                              onClick={() => handleRevokePenalty(penalty.id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                              title="Thu hồi hình phạt"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 py-4 border-t border-gray-200">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <span className="text-gray-600">
                Trang {pagination.page + 1} / {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages - 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          )}
        </div>

        {/* Create Penalty Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full">
              <div className="border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Tạo hình phạt mới</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={createForm.userId}
                    onChange={(e) => setCreateForm({ ...createForm, userId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                    placeholder="Nhập UUID của người dùng"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại hình phạt</label>
                    <select
                      value={createForm.penaltyType}
                      onChange={(e) => setCreateForm({ ...createForm, penaltyType: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                    >
                      {PENALTY_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hệ số phạt</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      value={createForm.multiplier}
                      onChange={(e) => setCreateForm({ ...createForm, multiplier: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lý do <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={createForm.reason}
                    onChange={(e) => setCreateForm({ ...createForm, reason: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                    placeholder="Nhập lý do hình phạt..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bắt đầu</label>
                    <input
                      type="datetime-local"
                      value={createForm.effectiveFrom}
                      onChange={(e) => setCreateForm({ ...createForm, effectiveFrom: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Để trống = ngay bây giờ</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kết thúc</label>
                    <input
                      type="datetime-local"
                      value={createForm.effectiveUntil}
                      onChange={(e) => setCreateForm({ ...createForm, effectiveUntil: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Để trống = vĩnh viễn</p>
                  </div>
                </div>
              </div>
              <div className="border-t px-6 py-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreatePenalty}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Tạo hình phạt
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
