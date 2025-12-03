import { useState, useEffect } from 'react';
import { Bell, Calendar, CheckCircle, AlertCircle, Info, X, Check, Filter, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const typeConfig = {
  appointment: { icon: Calendar, color: 'bg-blue-100 text-blue-600', label: 'Lịch hẹn' },
  reminder: { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-600', label: 'Nhắc nhở' },
  success: { icon: CheckCircle, color: 'bg-green-100 text-green-600', label: 'Thành công' },
  info: { icon: Info, color: 'bg-gray-100 text-gray-600', label: 'Thông báo' }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // TODO: Call API
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications([
        {
          id: 1,
          type: 'appointment',
          title: 'Lịch hẹn sắp tới',
          message: 'Bạn có lịch hẹn với BS. Nguyễn Văn An vào ngày mai lúc 09:00',
          time: '2 giờ trước',
          read: false
        },
        {
          id: 2,
          type: 'success',
          title: 'Đặt lịch thành công',
          message: 'Lịch hẹn của bạn với BS. Trần Thị Bình đã được xác nhận',
          time: '1 ngày trước',
          read: false
        },
        {
          id: 3,
          type: 'reminder',
          title: 'Nhắc nhở uống thuốc',
          message: 'Đừng quên uống thuốc Amlodipine 5mg theo chỉ định của bác sĩ',
          time: '2 ngày trước',
          read: true
        },
        {
          id: 4,
          type: 'info',
          title: 'Cập nhật hệ thống',
          message: 'Phòng khám đã cập nhật thông tin giờ làm việc mới',
          time: '3 ngày trước',
          read: true
        },
        {
          id: 5,
          type: 'appointment',
          title: 'Lịch hẹn đã hủy',
          message: 'Lịch hẹn với BS. Phạm Đức Dũng ngày 28/12 đã được hủy theo yêu cầu',
          time: '5 ngày trước',
          read: true
        },
        {
          id: 6,
          type: 'success',
          title: 'Thanh toán thành công',
          message: 'Bạn đã thanh toán 500,000đ cho lịch khám ngày 10/01/2025',
          time: '1 tuần trước',
          read: true
        }
      ]);
    } catch (error) {
      toast.error('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('Đã đánh dấu tất cả là đã đọc');
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Đã xóa thông báo');
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
          <p className="text-gray-500">
            {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo chưa đọc` : 'Không có thông báo mới'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium"
          >
            <Check className="w-4 h-4" />
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="mb-6">
        <div className="relative inline-block">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="all">Tất cả thông báo</option>
            <option value="unread">Chưa đọc</option>
            <option value="appointment">Lịch hẹn</option>
            <option value="reminder">Nhắc nhở</option>
            <option value="success">Thành công</option>
            <option value="info">Thông tin</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <Bell className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">Không có thông báo nào</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const TypeIcon = typeConfig[notification.type].icon;
            return (
              <div 
                key={notification.id} 
                className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all ${
                  !notification.read ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="p-4 flex gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${typeConfig[notification.type].color}`}>
                    <TypeIcon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                        <span className="text-xs text-gray-400 mt-1 block">{notification.time}</span>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Đánh dấu đã đọc"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Xóa"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
