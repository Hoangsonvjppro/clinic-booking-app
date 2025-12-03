import { useState, useEffect } from 'react';
import { Star, User, ThumbsUp, MessageSquare, Filter, ChevronDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // TODO: Call API
      await new Promise(resolve => setTimeout(resolve, 500));
      setReviews([
        {
          id: 1,
          doctorName: 'BS. Trần Thị Bình',
          specialty: 'Da liễu',
          appointmentDate: '2025-01-10',
          rating: 5,
          comment: 'Bác sĩ rất nhiệt tình, khám kỹ càng và tư vấn chi tiết. Rất hài lòng với dịch vụ!',
          createdAt: '2025-01-11',
          isAnonymous: false,
          helpful: 12
        },
        {
          id: 2,
          doctorName: 'BS. Lê Minh Châu',
          specialty: 'Nội tổng quát',
          appointmentDate: '2024-12-20',
          rating: 4,
          comment: 'Bác sĩ chuyên nghiệp, giải thích rõ ràng các vấn đề sức khỏe. Thời gian chờ hơi lâu.',
          createdAt: '2024-12-21',
          isAnonymous: false,
          helpful: 8
        },
        {
          id: 3,
          doctorName: 'BS. Hoàng Văn Em',
          specialty: 'Thần kinh',
          appointmentDate: '2024-12-15',
          rating: 5,
          comment: 'Bác sĩ rất giỏi, đã giúp tôi điều trị chứng đau đầu migraine hiệu quả.',
          createdAt: '2024-12-16',
          isAnonymous: true,
          helpful: 15
        }
      ]);
    } catch (error) {
      toast.error('Không thể tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchSearch = review.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       review.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filter === 'all' || review.rating === parseInt(filter);
    return matchSearch && matchFilter;
  });

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
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
        <h1 className="text-2xl font-bold text-gray-900">Đánh giá của tôi</h1>
        <p className="text-gray-500">Xem lại các đánh giá bạn đã viết</p>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
            <div className="flex items-center justify-center mt-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <p className="text-sm text-gray-500 mt-1">Đánh giá trung bình</p>
          </div>
          <div className="w-px h-16 bg-gray-200 hidden md:block"></div>
          <div className="flex-1 grid grid-cols-5 gap-2 w-full max-w-md">
            {[5, 4, 3, 2, 1].map(star => {
              const count = reviews.filter(r => r.rating === star).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex flex-col items-center">
                  <span className="text-sm text-gray-600">{star}★</span>
                  <div className="w-8 h-20 bg-gray-100 rounded-full overflow-hidden flex flex-col-reverse">
                    <div 
                      className="bg-yellow-400 transition-all duration-500"
                      style={{ height: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{count}</span>
                </div>
              );
            })}
          </div>
          <div className="text-center md:text-right">
            <div className="text-2xl font-bold text-gray-900">{reviews.length}</div>
            <p className="text-sm text-gray-500">Tổng đánh giá</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo bác sĩ, chuyên khoa..."
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
            <option value="all">Tất cả sao</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">Bạn chưa có đánh giá nào</p>
            <Link to="/patient/bookings" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
              Xem lịch hẹn đã hoàn thành để đánh giá
            </Link>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border shadow-sm p-5">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Doctor Info */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.doctorName}</h3>
                    <p className="text-sm text-gray-500">{review.specialty}</p>
                    <p className="text-xs text-gray-400">Khám ngày {formatDate(review.appointmentDate)}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="text-sm text-gray-500">({review.rating}/5)</span>
                </div>
              </div>

              {/* Comment */}
              <div className="mt-4">
                <p className="text-gray-700">{review.comment}</p>
                {review.isAnonymous && (
                  <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                    Đánh giá ẩn danh
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <span className="text-sm text-gray-400">
                  Đánh giá ngày {formatDate(review.createdAt)}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <ThumbsUp className="w-4 h-4" />
                  {review.helpful} người thấy hữu ích
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
