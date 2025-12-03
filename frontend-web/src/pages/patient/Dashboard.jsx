import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, CreditCard, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PatientDashboard() {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completed: 0,
    upcoming: 0,
    healthScore: 85
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // TODO: Call actual API
      setStats({
        totalAppointments: 12,
        completed: 8,
        upcoming: 2,
        healthScore: 85
      });
      
      setUpcomingAppointments([
        { id: 1, doctor: 'BS. Nguyễn Văn An', specialty: 'Tim mạch', date: '2025-12-05', time: '09:00', status: 'confirmed' },
        { id: 2, doctor: 'BS. Trần Thị Bình', specialty: 'Da liễu', date: '2025-12-07', time: '14:00', status: 'pending' },
      ]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">{getGreeting()}, {user.fullName || 'Bạn'}! 👋</h1>
        <p className="text-blue-100 mt-1">Chúc bạn một ngày tốt lành</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
              <p className="text-sm text-gray-500">Tổng lịch hẹn</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              <p className="text-sm text-gray-500">Đã hoàn thành</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
              <p className="text-sm text-gray-500">Sắp tới</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.healthScore}%</p>
              <p className="text-sm text-gray-500">Điểm sức khỏe</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/doctors" className="bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-100 rounded-lg w-fit mb-3">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Đặt lịch khám</h3>
          <p className="text-sm text-gray-500">Tìm bác sĩ phù hợp</p>
        </Link>

        <Link to="/patient/bookings" className="bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-green-100 rounded-lg w-fit mb-3">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Lịch hẹn của tôi</h3>
          <p className="text-sm text-gray-500">Xem và quản lý</p>
        </Link>

        <Link to="/patient/medical-records" className="bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-purple-100 rounded-lg w-fit mb-3">
            <Activity className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Hồ sơ sức khỏe</h3>
          <p className="text-sm text-gray-500">Xem lịch sử khám</p>
        </Link>

        <Link to="/patient/notifications" className="bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-yellow-100 rounded-lg w-fit mb-3">
            <CreditCard className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Thanh toán</h3>
          <p className="text-sm text-gray-500">Lịch sử giao dịch</p>
        </Link>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Lịch hẹn sắp tới</h2>
          <Link to="/patient/bookings" className="text-blue-600 text-sm hover:underline">Xem tất cả</Link>
        </div>
        <div className="divide-y">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((apt) => (
              <div key={apt.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">{apt.doctor.charAt(4)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{apt.doctor}</p>
                    <p className="text-sm text-gray-500">{apt.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{apt.date}</p>
                  <p className="text-sm text-gray-500">{apt.time}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Không có lịch hẹn sắp tới</p>
              <Link to="/doctors" className="text-blue-600 hover:underline mt-2 inline-block">Đặt lịch ngay</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
