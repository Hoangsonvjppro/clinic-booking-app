import { useState, useEffect } from 'react';
import {
  UsersIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [apiNotAvailable, setApiNotAvailable] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // API endpoints are not yet implemented
      // Using placeholder data for now
      await new Promise(resolve => setTimeout(resolve, 300));
      setApiNotAvailable(true);
      setStats({});
      setRecentAppointments([]);
      setPendingDoctors([]);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      setStats({});
      setRecentAppointments([]);
      setPendingDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorApproval = (doctorId, approved) => {
    setPendingDoctors(prev => prev.filter(d => d.id !== doctorId));
    toast.success(approved ? 'Doctor approved successfully' : 'Application rejected');
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'badge-success',
      pending: 'badge-warning',
      cancelled: 'badge-error',
      completed: 'badge-info',
    };
    return <span className={styles[status] || 'badge-neutral'}>{status}</span>;
  };

  const statCards = [
    { label: 'Total Patients', value: stats.totalPatients, change: stats.patientGrowth, icon: UsersIcon, color: 'primary' },
    { label: 'Total Doctors', value: stats.totalDoctors, change: stats.doctorGrowth, icon: UserGroupIcon, color: 'medical' },
    { label: 'Today\'s Appointments', value: stats.todayAppointments, change: stats.appointmentChange, icon: CalendarDaysIcon, color: 'amber' },
    { label: 'Monthly Revenue', value: `$${(stats.monthlyRevenue || 0).toLocaleString()}`, change: stats.revenueGrowth, icon: CurrencyDollarIcon, color: 'emerald' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="container-custom">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="grid md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (apiNotAvailable) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Overview of your clinic's performance</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-card p-12 text-center">
            <ChartBarIcon className="w-16 h-16 text-yellow-400 mx-auto" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Dashboard đang phát triển</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Các API thống kê và báo cáo đang được xây dựng. Bạn có thể sử dụng các tính năng khác trong menu bên trái.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <a href="/admin/doctor-approvals" className="btn-primary py-2 px-6">
                Duyệt bác sĩ
              </a>
              <a href="/admin/settings" className="btn-outline py-2 px-6">
                Cài đặt
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Overview of your clinic's performance</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-outline py-2 px-4 flex items-center gap-2">
              <FunnelIcon className="w-4 h-4" />
              Filter
            </button>
            <button className="btn-primary py-2 px-4 flex items-center gap-2">
              <ChartBarIcon className="w-4 h-4" />
              Reports
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-card hover:shadow-elevated transition-all">
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${stat.change >= 0 ? 'text-medical-600' : 'text-red-500'}`}>
                  {stat.change >= 0 ? (
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4" />
                  )}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Appointments */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-card">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Recent Appointments</h2>
                <button className="text-primary-600 text-sm font-medium hover:underline">View All</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-3">Patient</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-3">Doctor</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-3">Time</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{apt.patient}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{apt.doctor}</td>
                      <td className="px-6 py-4">
                        <p className="text-slate-900">{apt.time}</p>
                        <p className="text-xs text-slate-500">{apt.date}</p>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(apt.status)}</td>
                      <td className="px-6 py-4">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                          <EyeIcon className="w-4 h-4 text-slate-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Doctor Applications */}
          <div className="bg-white rounded-xl shadow-card">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Pending Approvals</h2>
                <span className="badge-warning">{pendingDoctors.length}</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {pendingDoctors.length === 0 ? (
                <p className="text-center text-slate-500 py-4">No pending applications</p>
              ) : (
                pendingDoctors.map((doctor) => (
                  <div key={doctor.id} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-slate-900">{doctor.name}</p>
                        <p className="text-sm text-slate-500">{doctor.specialty}</p>
                      </div>
                      <span className="text-xs text-slate-400">{doctor.appliedDate}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDoctorApproval(doctor.id, true)}
                        className="flex-1 btn-success py-1.5 text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDoctorApproval(doctor.id, false)}
                        className="flex-1 btn-outline py-1.5 text-sm text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Add New Doctor', icon: UserGroupIcon, color: 'primary' },
              { label: 'Manage Patients', icon: UsersIcon, color: 'medical' },
              { label: 'View Schedule', icon: CalendarDaysIcon, color: 'amber' },
              { label: 'Financial Reports', icon: CurrencyDollarIcon, color: 'emerald' },
            ].map((action, index) => (
              <button
                key={index}
                className={`p-4 rounded-xl border-2 border-slate-100 hover:border-${action.color}-200 hover:bg-${action.color}-50 transition-all text-left`}
              >
                <action.icon className={`w-6 h-6 text-${action.color}-600 mb-2`} />
                <p className="font-medium text-slate-900">{action.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}