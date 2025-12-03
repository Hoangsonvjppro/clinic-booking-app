import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  DocumentTextIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import {
  getAllReports,
  getReportById,
  reviewReport,
  resolveReport,
} from '../../api/adminApi';

const STATUS_LABELS = {
  PENDING: 'Chờ xử lý',
  REVIEWING: 'Đang xem xét',
  RESOLVED: 'Đã xử lý',
};

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  REVIEWING: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
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

const RESOLUTION_OPTIONS = [
  { value: 'DISMISSED', label: 'Bác bỏ báo cáo' },
  { value: 'WARNING_ISSUED', label: 'Gửi cảnh báo' },
  { value: 'PENALTY_APPLIED', label: 'Áp dụng hình phạt' },
  { value: 'ACCOUNT_SUSPENDED', label: 'Tạm ngưng tài khoản' },
  { value: 'ACCOUNT_BANNED', label: 'Cấm tài khoản' },
];

export default function ReportManagement() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [apiNotAvailable, setApiNotAvailable] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });
  const [resolveForm, setResolveForm] = useState({
    resolution: '',
    adminNote: '',
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  const fetchReports = async (page = 0) => {
    try {
      setLoading(true);
      setApiNotAvailable(false);
      const response = await getAllReports(filters.status, page, pagination.size);
      setReports(response.data.content || []);
      setPagination({
        page: response.data.number || 0,
        size: response.data.size || 10,
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0,
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      if (error.response?.status === 404 || error.response?.status === 502) {
        setApiNotAvailable(true);
      } else {
        toast.error('Không thể tải danh sách báo cáo');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(0);
  }, [filters.status]);

  const handleViewReport = async (report) => {
    try {
      const response = await getReportById(report.id);
      setSelectedReport(response.data);
    } catch (error) {
      console.error('Error fetching report details:', error);
      toast.error('Không thể tải chi tiết báo cáo');
    }
  };

  const handleReviewReport = async (reportId) => {
    try {
      await reviewReport(reportId);
      toast.success('Đã bắt đầu xem xét báo cáo');
      fetchReports(pagination.page);
      if (selectedReport?.id === reportId) {
        setSelectedReport((prev) => ({ ...prev, status: 'REVIEWING' }));
      }
    } catch (error) {
      console.error('Error reviewing report:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const handleOpenResolve = (report) => {
    setSelectedReport(report);
    setResolveForm({ resolution: '', adminNote: '' });
    setShowResolveModal(true);
  };

  const handleResolveReport = async () => {
    if (!resolveForm.resolution) {
      toast.error('Vui lòng chọn quyết định');
      return;
    }

    try {
      await resolveReport(selectedReport.id, resolveForm);
      toast.success('Đã xử lý báo cáo thành công');
      setShowResolveModal(false);
      setSelectedReport(null);
      fetchReports(pagination.page);
    } catch (error) {
      console.error('Error resolving report:', error);
      toast.error('Không thể xử lý báo cáo');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchReports(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <DocumentTextIcon className="w-8 h-8 text-primary-600" />
            Quản lý báo cáo
          </h1>
          <div className="text-sm text-gray-500">
            Tổng: {pagination.totalElements} báo cáo
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="PENDING">Chờ xử lý</option>
                <option value="REVIEWING">Đang xem xét</option>
                <option value="RESOLVED">Đã xử lý</option>
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

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
          ) : apiNotAvailable ? (
            <div className="text-center py-12">
              <ExclamationTriangleIcon className="w-12 h-12 text-yellow-400 mx-auto" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Tính năng đang phát triển</h3>
              <p className="text-gray-500">API quản lý báo cáo đang được xây dựng.</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Không có báo cáo</h3>
              <p className="text-gray-500">Chưa có báo cáo nào được gửi.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Tiêu đề</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Loại</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Người báo cáo</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Người bị báo cáo</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ngày</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 line-clamp-1">{report.title}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {REPORT_TYPE_LABELS[report.reportType] || report.reportType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{report.reporterName || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{report.reportedName || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(report.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[report.status]}`}>
                        {STATUS_LABELS[report.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewReport(report)}
                          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        {report.status === 'PENDING' && (
                          <button
                            onClick={() => handleReviewReport(report.id)}
                            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                            title="Bắt đầu xem xét"
                          >
                            <ExclamationTriangleIcon className="w-5 h-5" />
                          </button>
                        )}
                        {(report.status === 'PENDING' || report.status === 'REVIEWING') && (
                          <button
                            onClick={() => handleOpenResolve(report)}
                            className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg"
                            title="Xử lý báo cáo"
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
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

        {/* Report Detail Modal */}
        {selectedReport && !showResolveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Chi tiết báo cáo</h2>
                <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-gray-600">
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedReport.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {REPORT_TYPE_LABELS[selectedReport.reportType]}
                    </span>
                    <span className={`px-2 py-1 rounded text-sm ${STATUS_COLORS[selectedReport.status]}`}>
                      {STATUS_LABELS[selectedReport.status]}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Mô tả</label>
                  <p className="mt-1 text-gray-700 whitespace-pre-wrap">{selectedReport.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Người báo cáo</label>
                    <p className="text-gray-700">{selectedReport.reporterName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Người bị báo cáo</label>
                    <p className="text-gray-700">{selectedReport.reportedName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Ngày tạo</label>
                    <p className="text-gray-700">{formatDate(selectedReport.createdAt)}</p>
                  </div>
                  {selectedReport.appointmentId && (
                    <div>
                      <label className="text-sm text-gray-500">Mã lịch hẹn</label>
                      <p className="text-gray-700 font-mono text-sm">{selectedReport.appointmentId}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Đóng
                </button>
                {selectedReport.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleOpenResolve(selectedReport)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Xử lý báo cáo
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Resolve Modal */}
        {showResolveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full">
              <div className="border-b px-6 py-4">
                <h2 className="text-xl font-bold">Xử lý báo cáo</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quyết định xử lý <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={resolveForm.resolution}
                    onChange={(e) => setResolveForm({ ...resolveForm, resolution: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">-- Chọn quyết định --</option>
                    {RESOLUTION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                  <textarea
                    value={resolveForm.adminNote}
                    onChange={(e) => setResolveForm({ ...resolveForm, adminNote: e.target.value })}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                    placeholder="Nhập ghi chú cho quyết định này..."
                  />
                </div>
              </div>
              <div className="border-t px-6 py-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={handleResolveReport}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
