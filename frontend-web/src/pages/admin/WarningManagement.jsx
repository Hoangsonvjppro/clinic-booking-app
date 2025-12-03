import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  ExclamationTriangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import {
  getAllWarnings,
  createWarning,
  deleteWarning,
} from '../../api/adminApi';

const WARNING_TYPE_OPTIONS = [
  { value: 'NO_SHOW', label: 'Không đến theo lịch' },
  { value: 'LATE_CANCELLATION', label: 'Hủy lịch muộn' },
  { value: 'REPORTED', label: 'Bị báo cáo' },
  { value: 'VIOLATION', label: 'Vi phạm quy định' },
  { value: 'SYSTEM', label: 'Cảnh báo hệ thống' },
];

const SEVERITY_OPTIONS = [
  { value: 'LOW', label: 'Nhẹ', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'MEDIUM', label: 'Trung bình', color: 'bg-orange-100 text-orange-800' },
  { value: 'HIGH', label: 'Nghiêm trọng', color: 'bg-red-100 text-red-800' },
];

export default function WarningManagement() {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [apiNotAvailable, setApiNotAvailable] = useState(false);
  const [filters, setFilters] = useState({
    warningType: '',
    severity: '',
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
    warningType: 'VIOLATION',
    severity: 'MEDIUM',
    message: '',
    expiresAt: '',
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  const fetchWarnings = async (page = 0) => {
    try {
      setLoading(true);
      setApiNotAvailable(false);
      const response = await getAllWarnings(
        filters.warningType,
        filters.severity,
        page,
        pagination.size
      );
      setWarnings(response.data.content || []);
      setPagination({
        page: response.data.number || 0,
        size: response.data.size || 10,
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0,
      });
    } catch (error) {
      console.error('Error fetching warnings:', error);
      if (error.response?.status === 404 || error.response?.status === 502) {
        setApiNotAvailable(true);
      } else {
        toast.error('Không thể tải danh sách cảnh báo');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarnings(0);
  }, [filters.warningType, filters.severity]);

  const handleCreateWarning = async () => {
    if (!createForm.userId || !createForm.message) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const payload = {
        ...createForm,
        expiresAt: createForm.expiresAt ? new Date(createForm.expiresAt).toISOString() : null,
      };
      await createWarning(payload);
      toast.success('Đã tạo cảnh báo thành công');
      setShowCreateModal(false);
      setCreateForm({
        userId: '',
        warningType: 'VIOLATION',
        severity: 'MEDIUM',
        message: '',
        expiresAt: '',
      });
      fetchWarnings(pagination.page);
    } catch (error) {
      console.error('Error creating warning:', error);
      toast.error('Không thể tạo cảnh báo');
    }
  };

  const handleDeleteWarning = async (warningId) => {
    if (!window.confirm('Bạn có chắc muốn xóa cảnh báo này?')) return;

    try {
      await deleteWarning(warningId);
      toast.success('Đã xóa cảnh báo');
      fetchWarnings(pagination.page);
    } catch (error) {
      console.error('Error deleting warning:', error);
      toast.error('Không thể xóa cảnh báo');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchWarnings(newPage);
    }
  };

  const getSeverityColor = (severity) => {
    const option = SEVERITY_OPTIONS.find((opt) => opt.value === severity);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
            Quản lý cảnh báo
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <PlusIcon className="w-5 h-5" />
            Tạo cảnh báo
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={filters.warningType}
                onChange={(e) => setFilters({ ...filters, warningType: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tất cả loại</option>
                {WARNING_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tất cả mức độ</option>
                {SEVERITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
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

        {/* Warnings Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
          ) : apiNotAvailable ? (
            <div className="text-center py-12">
              <ExclamationTriangleIcon className="w-12 h-12 text-yellow-400 mx-auto" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Tính năng đang phát triển</h3>
              <p className="text-gray-500">API quản lý cảnh báo đang được xây dựng.</p>
            </div>
          ) : warnings.length === 0 ? (
            <div className="text-center py-12">
              <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Không có cảnh báo</h3>
              <p className="text-gray-500">Chưa có cảnh báo nào được tạo.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Người dùng</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Loại</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Mức độ</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Nội dung</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Hết hạn</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {warnings.map((warning) => {
                  const isExpired = warning.expiresAt && new Date(warning.expiresAt) < new Date();
                  return (
                    <tr key={warning.id} className={`hover:bg-gray-50 ${isExpired ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4 text-sm text-gray-900">{warning.userName || warning.userId}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {WARNING_TYPE_OPTIONS.find((opt) => opt.value === warning.warningType)?.label || warning.warningType}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(warning.severity)}`}>
                          {SEVERITY_OPTIONS.find((opt) => opt.value === warning.severity)?.label || warning.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{warning.message}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(warning.createdAt)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {warning.expiresAt ? formatDate(warning.expiresAt) : 'Không giới hạn'}
                      </td>
                      <td className="px-6 py-4">
                        {warning.isRead ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">Đã đọc</span>
                        ) : isExpired ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">Hết hạn</span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Chưa đọc</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleDeleteWarning(warning.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                            title="Xóa cảnh báo"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
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

        {/* Create Warning Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full">
              <div className="border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Tạo cảnh báo mới</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại cảnh báo</label>
                    <select
                      value={createForm.warningType}
                      onChange={(e) => setCreateForm({ ...createForm, warningType: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                    >
                      {WARNING_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ</label>
                    <select
                      value={createForm.severity}
                      onChange={(e) => setCreateForm({ ...createForm, severity: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                    >
                      {SEVERITY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={createForm.message}
                    onChange={(e) => setCreateForm({ ...createForm, message: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                    placeholder="Nhập nội dung cảnh báo..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hết hạn (tùy chọn)</label>
                  <input
                    type="datetime-local"
                    value={createForm.expiresAt}
                    onChange={(e) => setCreateForm({ ...createForm, expiresAt: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  />
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
                  onClick={handleCreateWarning}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Tạo cảnh báo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
