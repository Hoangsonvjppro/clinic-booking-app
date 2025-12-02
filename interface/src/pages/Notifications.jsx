import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Trash2, Bell, BellOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { notifications as mockNotifications } from '../data/mockData';

const Notifications = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useApp();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all'); // 'all', 'personal', 'global'

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    return notif.type === filter;
  });

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const toggleStar = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isStarred: !notif.isStarred } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>

          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-all text-sm font-medium"
          >
            Đánh dấu tất cả đã đọc
          </button>
        </div>

        <h1 className="text-3xl font-bold text-slate-800 mb-6">Thông Báo</h1>

        {/* Filters */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-sky-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Tất cả ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('personal')}
            className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              filter === 'personal'
                ? 'bg-sky-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Cá nhân ({notifications.filter(n => n.type === 'personal').length})
          </button>
          <button
            onClick={() => setFilter('global')}
            className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              filter === 'global'
                ? 'bg-sky-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Hệ thống ({notifications.filter(n => n.type === 'global').length})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <BellOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Không có thông báo</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`bg-white rounded-xl shadow-sm p-4 sm:p-5 transition-all hover:shadow-md cursor-pointer ${
                  !notif.isRead ? 'border-l-4 border-sky-500' : ''
                }`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {notif.type === 'personal' && (
                        <span className="px-2 py-0.5 bg-sky-100 text-sky-700 text-xs rounded-full">
                          Cá nhân
                        </span>
                      )}
                      {notif.type === 'global' && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                          Hệ thống
                        </span>
                      )}
                      {!notif.isRead && (
                        <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">
                      {notif.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{notif.content}</p>
                    <p className="text-xs text-gray-500">{formatDate(notif.date)}</p>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(notif.id);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          notif.isStarred
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
