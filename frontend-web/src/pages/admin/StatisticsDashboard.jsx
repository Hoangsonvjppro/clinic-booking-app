import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { getDashboardStatistics, getReportStatistics } from '../../api/adminApi';

export default function StatisticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [reportStats, setReportStats] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    fetchStatistics();
  }, [selectedPeriod]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const [dashboardRes, reportRes] = await Promise.all([
        getDashboardStatistics(selectedPeriod),
        getReportStatistics(selectedPeriod),
      ]);
      setDashboardStats(dashboardRes.data);
      setReportStats(reportRes.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast.error('Không thể tải thống kê');
      // Set mock data for display purposes
      setDashboardStats({
        totalUsers: 1250,
        totalDoctors: 45,
        totalPatients: 1200,
        totalAdmins: 5,
        totalAppointments: 3500,
        appointmentsThisPeriod: 180,
        appointmentGrowth: 12.5,
        totalReports: 45,
        pendingReports: 8,
        resolvedReports: 35,
        totalWarnings: 120,
        activeWarnings: 25,
        totalPenalties: 15,
        activePenalties: 5,
      });
      setReportStats({
        reportsByType: {
          NO_SHOW: 15,
          LATE_CANCELLATION: 10,
          UNPROFESSIONAL_BEHAVIOR: 8,
          POOR_SERVICE: 7,
          OTHER: 5,
        },
        reportsByStatus: {
          PENDING: 8,
          REVIEWING: 2,
          RESOLVED: 35,
        },
        resolutionsByType: {
          DISMISSED: 10,
          WARNING_ISSUED: 15,
          PENALTY_APPLIED: 8,
          ACCOUNT_SUSPENDED: 2,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, growth }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
          {growth !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growth >= 0 ? (
                <ArrowTrendingUpIcon className="w-4 h-4" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4" />
              )}
              <span>{Math.abs(growth)}% so với kỳ trước</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="container-custom">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="grid md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ChartBarIcon className="w-8 h-8 text-primary-600" />
            Thống kê hệ thống
          </h1>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
          >
            <option value="today">Hôm nay</option>
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
            <option value="year">Năm nay</option>
          </select>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tổng người dùng"
            value={dashboardStats?.totalUsers || 0}
            icon={UsersIcon}
            color="bg-primary-500"
            subtitle={`${dashboardStats?.totalDoctors || 0} bác sĩ, ${dashboardStats?.totalPatients || 0} bệnh nhân`}
          />
          <StatCard
            title="Lịch hẹn"
            value={dashboardStats?.totalAppointments || 0}
            icon={CalendarDaysIcon}
            color="bg-blue-500"
            subtitle={`${dashboardStats?.appointmentsThisPeriod || 0} trong kỳ này`}
            growth={dashboardStats?.appointmentGrowth}
          />
          <StatCard
            title="Báo cáo"
            value={dashboardStats?.totalReports || 0}
            icon={DocumentTextIcon}
            color="bg-yellow-500"
            subtitle={`${dashboardStats?.pendingReports || 0} chờ xử lý`}
          />
          <StatCard
            title="Hình phạt đang áp dụng"
            value={dashboardStats?.activePenalties || 0}
            icon={NoSymbolIcon}
            color="bg-red-500"
            subtitle={`${dashboardStats?.totalPenalties || 0} tổng cộng`}
          />
        </div>

        {/* Reports & Warnings Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Report Statistics */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-yellow-500" />
              Thống kê báo cáo
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Theo trạng thái</p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-yellow-50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-yellow-600">{reportStats?.reportsByStatus?.PENDING || 0}</p>
                    <p className="text-xs text-gray-500">Chờ xử lý</p>
                  </div>
                  <div className="flex-1 bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-blue-600">{reportStats?.reportsByStatus?.REVIEWING || 0}</p>
                    <p className="text-xs text-gray-500">Đang xem xét</p>
                  </div>
                  <div className="flex-1 bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-green-600">{reportStats?.reportsByStatus?.RESOLVED || 0}</p>
                    <p className="text-xs text-gray-500">Đã xử lý</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Theo loại báo cáo</p>
                <div className="space-y-2">
                  {reportStats?.reportsByType && Object.entries(reportStats.reportsByType).slice(0, 5).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{getReportTypeLabel(type)}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Warning Statistics */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
              Thống kê cảnh báo & hình phạt
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-3xl font-bold text-orange-600">{dashboardStats?.totalWarnings || 0}</p>
                  <p className="text-sm text-gray-500">Tổng cảnh báo</p>
                  <p className="text-xs text-orange-600 mt-1">{dashboardStats?.activeWarnings || 0} đang hiệu lực</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-3xl font-bold text-red-600">{dashboardStats?.totalPenalties || 0}</p>
                  <p className="text-sm text-gray-500">Tổng hình phạt</p>
                  <p className="text-xs text-red-600 mt-1">{dashboardStats?.activePenalties || 0} đang áp dụng</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Kết quả xử lý báo cáo</p>
                <div className="space-y-2">
                  {reportStats?.resolutionsByType && Object.entries(reportStats.resolutionsByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{getResolutionLabel(type)}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Truy cập nhanh</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <a
              href="/admin/reports"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <DocumentTextIcon className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="font-medium">Báo cáo</p>
                <p className="text-sm text-gray-500">{dashboardStats?.pendingReports || 0} chờ xử lý</p>
              </div>
            </a>
            <a
              href="/admin/warnings"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <ExclamationTriangleIcon className="w-8 h-8 text-orange-500" />
              <div>
                <p className="font-medium">Cảnh báo</p>
                <p className="text-sm text-gray-500">{dashboardStats?.activeWarnings || 0} đang hiệu lực</p>
              </div>
            </a>
            <a
              href="/admin/penalties"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <NoSymbolIcon className="w-8 h-8 text-red-500" />
              <div>
                <p className="font-medium">Hình phạt</p>
                <p className="text-sm text-gray-500">{dashboardStats?.activePenalties || 0} đang áp dụng</p>
              </div>
            </a>
            <a
              href="/admin/users"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <UsersIcon className="w-8 h-8 text-primary-500" />
              <div>
                <p className="font-medium">Người dùng</p>
                <p className="text-sm text-gray-500">{dashboardStats?.totalUsers || 0} người dùng</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function getReportTypeLabel(type) {
  const labels = {
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
  return labels[type] || type;
}

function getResolutionLabel(resolution) {
  const labels = {
    DISMISSED: 'Bác bỏ',
    WARNING_ISSUED: 'Đã cảnh báo',
    PENALTY_APPLIED: 'Đã xử phạt',
    ACCOUNT_SUSPENDED: 'Tạm ngưng TK',
    ACCOUNT_BANNED: 'Cấm TK',
  };
  return labels[resolution] || resolution;
}
