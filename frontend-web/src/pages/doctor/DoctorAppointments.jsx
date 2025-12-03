import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, FileText, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, completed, cancelled
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchAppointments();
  }, [filter, selectedDate]);

  const fetchAppointments = async () => {
    try {
      // TODO: Call actual API
      // const response = await api.get(`/api/v1/doctors/me/appointments?date=${selectedDate}&status=${filter}`);
      // setAppointments(response.data);
      
      // Mock data
      setAppointments([
        { id: 1, patientName: 'Nguyễn Văn A', phone: '0901234567', date: '2025-12-04', time: '08:00', type: 'Khám tổng quát', status: 'completed', notes: 'Bệnh nhân có tiền sử cao huyết áp' },
        { id: 2, patientName: 'Trần Thị B', phone: '0912345678', date: '2025-12-04', time: '09:00', type: 'Tái khám', status: 'completed', notes: 'Tái khám sau điều trị viêm họng' },
        { id: 3, patientName: 'Lê Văn C', phone: '0923456789', date: '2025-12-04', time: '10:00', type: 'Khám chuyên khoa', status: 'in-progress', notes: '' },
        { id: 4, patientName: 'Phạm Thị D', phone: '0934567890', date: '2025-12-04', time: '11:00', type: 'Tư vấn', status: 'pending', notes: '' },
        { id: 5, patientName: 'Hoàng Văn E', phone: '0945678901', date: '2025-12-04', time: '14:00', type: 'Khám tổng quát', status: 'pending', notes: '' },
        { id: 6, patientName: 'Ngô Thị F', phone: '0956789012', date: '2025-12-04', time: '15:00', type: 'Tái khám', status: 'pending', notes: '' },
        { id: 7, patientName: 'Vũ Văn G', phone: '0967890123', date: '2025-12-04', time: '16:00', type: 'Khám chuyên khoa', status: 'cancelled', notes: 'Bệnh nhân hủy do bận việc' },
      ]);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    const labels = {
      completed: 'Hoàn thành',
      'in-progress': 'Đang khám',
      pending: 'Chờ khám',
      cancelled: 'Đã hủy'
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesFilter = filter === 'all' || apt.status === filter;
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.phone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const handleStartExam = async (appointmentId) => {
    // TODO: Call API to update status
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'in-progress' } : apt
    ));
  };

  const handleCompleteExam = async (appointmentId) => {
    // TODO: Call API to update status
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'completed' } : apt
    ));
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý lịch khám</h1>
          <p className="text-gray-500">Xem và quản lý các cuộc hẹn của bạn</p>
        </div>
        
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex gap-2">
          {['all', 'pending', 'in-progress', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Tất cả' :
               status === 'pending' ? 'Chờ khám' :
               status === 'in-progress' ? 'Đang khám' :
               status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại khám</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ghi chú</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{apt.time}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{apt.patientName}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {apt.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{apt.type}</td>
                  <td className="px-4 py-4">{getStatusBadge(apt.status)}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 max-w-[200px] truncate">
                    {apt.notes || '-'}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {apt.status === 'pending' && (
                        <button 
                          onClick={() => handleStartExam(apt.id)}
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          Bắt đầu
                        </button>
                      )}
                      {apt.status === 'in-progress' && (
                        <button 
                          onClick={() => handleCompleteExam(apt.id)}
                          className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Hoàn thành
                        </button>
                      )}
                      <button className="px-3 py-1.5 border text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                        Chi tiết
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Không có lịch hẹn nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
