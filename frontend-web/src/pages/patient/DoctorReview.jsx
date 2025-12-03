import { useState, useEffect } from 'react';
import { Star, Send, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function DoctorReview() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    // TODO: Fetch appointment details
    setAppointment({
      id: appointmentId,
      doctorName: 'BS. Nguyễn Văn An',
      specialty: 'Tim mạch',
      date: '2025-12-01',
      time: '09:00'
    });
  }, [appointmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API to submit review
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Đánh giá đã được gửi thành công!');
      navigate('/patient/bookings');
    } catch (error) {
      toast.error('Không thể gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const ratingLabels = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Back button */}
      <Link to="/patient/bookings" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </Link>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Đánh giá bác sĩ</h1>
        <p className="text-gray-500 mb-6">Chia sẻ trải nghiệm của bạn sau buổi khám</p>

        {/* Appointment Info */}
        {appointment && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="font-medium text-gray-900">{appointment.doctorName}</p>
            <p className="text-sm text-gray-500">{appointment.specialty}</p>
            <p className="text-sm text-gray-500">{appointment.date} lúc {appointment.time}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Đánh giá của bạn <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-10 h-10 ${
                      star <= (hoverRating || rating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
              {(hoverRating || rating) > 0 && (
                <span className="ml-3 text-gray-600 font-medium">
                  {ratingLabels[hoverRating || rating]}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhận xét của bạn
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Chia sẻ chi tiết về trải nghiệm khám bệnh của bạn..."
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Anonymous option */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">Đánh giá ẩn danh</span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Gửi đánh giá
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
