import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  UsersIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ShieldExclamationIcon,
  XCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import {
  getAllUsers,
  getUserDetails,
  updateUserStatus,
} from '../../api/adminApi';

const ACCOUNT_STATUS_CONFIG = {
  ACTIVE: { label: 'Hoạt động', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  WARNED: { label: 'Bị cảnh báo', color: 'bg-yellow-100 text-yellow-800', icon: ExclamationTriangleIcon },
  SUSPENDED: { label: 'Tạm ngưng', color: 'bg-orange-100 text-orange-800', icon: ShieldExclamationIcon },
  BANNED: { label: 'Bị cấm', color: 'bg-red-100 text-red-800', icon: NoSymbolIcon },
};

const ROLE_LABELS = {
  PATIENT: 'Bệnh nhân',
  DOCTOR: 'Bác sĩ',
  ADMIN: 'Quản trị viên',
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });
  const [statusForm, setStatusForm] = useState({
    status: '',
    reason: '',
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  const fetchUsers = async (page = 0) => {
    try {
      setLoading(true);
      const response = await getAllUsers(
        filters.role,
        filters.status,
        page,
        pagination.size
      );
      setUsers(response.data.content || []);
      setPagination({
        page: response.data.number || 0,
        size: response.data.size || 10,
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0);
  }, [filters.role, filters.status]);

  const handleViewUser = async (user) => {
    try {
      const response = await getUserDetails(user.id);
      setSelectedUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      // Fall back to basic user info
      setSelectedUser(user);
    }
  };

  const handleOpenStatusModal = (user) => {
    setSelectedUser(user);
    setStatusForm({ status: user.accountStatus || 'ACTIVE', reason: '' });
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!statusForm.status) {
      toast.error('Vui lòng chọn trạng thái');
      return;
    }

    try {
      await updateUserStatus(selectedUser.id, statusForm.status, statusForm.reason);
      toast.success('Đã cập nhật trạng thái người dùng');
      setShowStatusModal(false);
      setSelectedUser(null);
      fetchUsers(pagination.page);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchUsers(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <UsersIcon className="w-8 h-8 text-primary-600" />
            Quản lý người dùng
          </h1>
          <div className="text-sm text-gray-500">
            Tổng: {pagination.totalElements} người dùng
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tất cả vai trò</option>
                <option value="PATIENT">Bệnh nhân</option>
                <option value="DOCTOR">Bác sĩ</option>
                <option value="ADMIN">Quản trị viên</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tất cả trạng thái</option>
                {Object.entries(ACCOUNT_STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 max-w-md relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm tên, email..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Không có người dùng</h3>
              <p className="text-gray-500">Chưa có người dùng nào phù hợp.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Người dùng</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Vai trò</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => {
                  const statusConfig = ACCOUNT_STATUS_CONFIG[user.accountStatus] || ACCOUNT_STATUS_CONFIG.ACTIVE;
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-medium">
                              {(user.name || user.email || '?')[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name || 'Chưa đặt tên'}</div>
                            <div className="text-sm text-gray-500 font-mono">{user.id?.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                          {ROLE_LABELS[user.role] || user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                            title="Xem chi tiết"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleOpenStatusModal(user)}
                            className="p-2 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-lg"
                            title="Thay đổi trạng thái"
                          >
                            <ShieldExclamationIcon className="w-5 h-5" />
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

        {/* User Detail Modal */}
        {selectedUser && !showStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Chi tiết người dùng</h2>
                <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-primary-600 font-bold">
                      {(selectedUser.name || selectedUser.email || '?')[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedUser.name || 'Chưa đặt tên'}</h3>
                    <p className="text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">ID</label>
                    <p className="text-gray-700 font-mono text-sm">{selectedUser.id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Vai trò</label>
                    <p className="text-gray-700">{ROLE_LABELS[selectedUser.role] || selectedUser.role}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Trạng thái tài khoản</label>
                    <p className="text-gray-700">{ACCOUNT_STATUS_CONFIG[selectedUser.accountStatus]?.label || selectedUser.accountStatus}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Ngày tạo</label>
                    <p className="text-gray-700">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>

                {/* Statistics if available */}
                {selectedUser.statistics && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Thống kê</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-primary-600">{selectedUser.statistics.totalAppointments || 0}</p>
                        <p className="text-sm text-gray-500">Tổng lịch hẹn</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-yellow-600">{selectedUser.statistics.totalWarnings || 0}</p>
                        <p className="text-sm text-gray-500">Cảnh báo</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-red-600">{selectedUser.statistics.totalPenalties || 0}</p>
                        <p className="text-sm text-gray-500">Hình phạt</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Đóng
                </button>
                <button
                  onClick={() => handleOpenStatusModal(selectedUser)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Thay đổi trạng thái
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Change Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full">
              <div className="border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Thay đổi trạng thái tài khoản</h2>
                <button onClick={() => setShowStatusModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Người dùng</p>
                  <p className="font-medium">{selectedUser?.name || selectedUser?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái mới <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={statusForm.status}
                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  >
                    {Object.entries(ACCOUNT_STATUS_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lý do</label>
                  <textarea
                    value={statusForm.reason}
                    onChange={(e) => setStatusForm({ ...statusForm, reason: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                    placeholder="Nhập lý do thay đổi trạng thái..."
                  />
                </div>
                {statusForm.status !== 'ACTIVE' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Lưu ý:</strong> Thay đổi này sẽ ảnh hưởng đến khả năng sử dụng hệ thống của người dùng.
                    </p>
                  </div>
                )}
              </div>
              <div className="border-t px-6 py-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
