import { useState, useEffect } from 'react';
import { Calendar, Users, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import api from '../../services/api';

export default function DoctorDashboard() {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    completedToday: 0,
    cancelledToday: 0,
    totalPatients: 0,
    monthlyRevenue: 0
  });
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // TODO: Call actual API when available
      // const response = await api.get('/api/v1/doctors/me/dashboard');
      // setStats(response.data.stats);
      // setTodaySchedule(response.data.todaySchedule);
      
      // Mock data for now
      setStats({
        todayAppointments: 8,
        pendingAppointments: 3,
        completedToday: 4,
        cancelledToday: 1,
        totalPatients: 156,
        monthlyRevenue: 45600000
      });
      
      setTodaySchedule([
        { id: 1, time: '08:00', patient: 'Nguyễn Văn A', type: 'Khám tổng quát', status: 'completed' },
        { id: 2, time: '09:00', patient: 'Trần Thị B', type: 'Tái khám', status: 'completed' },
        { id: 3, time: '10:00', patient: 'Lê Văn C', type: 'Khám chuyên khoa', status: 'completed' },
        { id: 4, time: '11:00', patient: 'Phạm Thị D', type: 'Tư vấn', status: 'completed' },
        { id: 5, time: '14:00', patient: 'Hoàng Văn E', type: 'Khám tổng quát', status: 'in-progress' },
        { id: 6, time: '15:00', patient: 'Ngô Thị F', type: 'Tái khám', status: 'pending' },
        { id: 7, time: '16:00', patient: 'Vũ Văn G', type: 'Khám chuyên khoa', status: 'pending' },
        { id: 8, time: '17:00', patient: 'Đặng Thị H', type: 'Tư vấn', status: 'pending' },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Hoàn thành</span>;
      case 'in-progress':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Đang khám</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Chờ khám</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Đã hủy</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Xin chào, {user.fullName || 'Bác sĩ'}!</h1>
        <p className="text-blue-100 mt-1">Chúc bạn một ngày làm việc hiệu quả</p>
        <p className="text-sm text-blue-200 mt-2">
          {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Lịch hẹn hôm nay</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đang chờ khám</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingAppointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đã hoàn thành</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đã hủy</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelledToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng bệnh nhân</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Doanh thu tháng</p>
              <p className="text-lg font-bold text-gray-900">{(stats.monthlyRevenue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Lịch khám hôm nay</h2>
        </div>
        <div className="divide-y">
          {todaySchedule.map((appointment) => (
            <div key={appointment.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="text-center min-w-[60px]">
                  <p className="text-lg font-semibold text-gray-900">{appointment.time}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{appointment.patient}</p>
                  <p className="text-sm text-gray-500">{appointment.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(appointment.status)}
                {appointment.status === 'pending' && (
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                    Bắt đầu khám
                  </button>
                )}
                {appointment.status === 'in-progress' && (
                  <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                    Hoàn thành
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
