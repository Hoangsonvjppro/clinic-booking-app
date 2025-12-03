import { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Star, Filter, Search, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const statusConfig = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
  NO_SHOW: { label: 'Không đến', color: 'bg-gray-100 text-gray-800' }
};

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // TODO: Call API
      await new Promise(resolve => setTimeout(resolve, 500));
      setBookings([
        {
          id: 1,
          doctorName: 'BS. Nguyễn Văn An',
          specialty: 'Tim mạch',
          date: '2025-01-15',
          time: '09:00',
          status: 'CONFIRMED',
          location: 'Phòng 301, Tầng 3',
          fee: 500000,
          hasReview: false
        },
        {
          id: 2,
          doctorName: 'BS. Trần Thị Bình',
          specialty: 'Da liễu',
          date: '2025-01-10',
          time: '14:30',
          status: 'COMPLETED',
          location: 'Phòng 205, Tầng 2',
          fee: 400000,
          hasReview: true,
          rating: 5
        },
        {
          id: 3,
          doctorName: 'BS. Lê Minh Châu',
          specialty: 'Nội tổng quát',
          date: '2025-01-05',
          time: '10:00',
          status: 'COMPLETED',
          location: 'Phòng 102, Tầng 1',
          fee: 350000,
          hasReview: false
        },
        {
          id: 4,
          doctorName: 'BS. Phạm Đức Dũng',
          specialty: 'Xương khớp',
          date: '2024-12-28',
          time: '11:30',
          status: 'CANCELLED',
          location: 'Phòng 401, Tầng 4',
          fee: 450000,
          hasReview: false
        },
        {
          id: 5,
          doctorName: 'BS. Hoàng Văn Em',
          specialty: 'Thần kinh',
          date: '2025-01-20',
          time: '08:30',
          status: 'PENDING',
          location: 'Phòng 502, Tầng 5',
          fee: 600000,
          hasReview: false
        }
      ]);
    } catch (error) {
      toast.error('Không thể tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedBooking) return;
    try {
      // TODO: Call API
      await new Promise(resolve => setTimeout(resolve, 500));
      setBookings(bookings.map(b => 
        b.id === selectedBooking.id ? { ...b, status: 'CANCELLED' } : b
      ));
      toast.success('Đã hủy lịch hẹn thành công');
      setCancelModalOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      toast.error('Không thể hủy lịch hẹn');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchFilter = filter === 'all' || booking.status === filter;
    const matchSearch = booking.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       booking.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lịch hẹn của tôi</h1>
        <p className="text-gray-500">Quản lý các lịch hẹn khám bệnh</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo bác sĩ, chuyên khoa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xác nhận</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">Không có lịch hẹn nào</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Doctor Info */}
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.doctorName}</h3>
                      <p className="text-sm text-gray-500">{booking.specialty}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{booking.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Date & Status */}
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[booking.status].color}`}>
                      {statusConfig[booking.status].label}
                    </span>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(booking.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {booking.time}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-blue-600">{formatCurrency(booking.fee)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                  {booking.status === 'COMPLETED' && !booking.hasReview && (
                    <Link
                      to={`/patient/review/${booking.id}`}
                      className="flex items-center gap-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium"
                    >
                      <Star className="w-4 h-4" />
                      Đánh giá
                    </Link>
                  )}
                  {booking.status === 'COMPLETED' && booking.hasReview && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      Đã đánh giá {booking.rating}/5
                    </div>
                  )}
                  {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setCancelModalOpen(true);
                      }}
                      className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium"
                    >
                      Hủy lịch
                    </button>
                  )}
                  <Link
                    to={`/patient/bookings/${booking.id}`}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium"
                  >
                    Chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cancel Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Xác nhận hủy lịch hẹn</h3>
              <button onClick={() => setCancelModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn hủy lịch hẹn với <strong>{selectedBooking?.doctorName}</strong> vào ngày <strong>{selectedBooking?.date}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Không
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hủy lịch hẹn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
