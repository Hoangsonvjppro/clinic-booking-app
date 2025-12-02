import React from 'react';
import { Calendar, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Banner = () => {
  const { setBookingModalOpen, setConsultModalOpen } = useApp();

  return (
    <div className="relative bg-gradient-to-r from-sky-400 to-sky-600 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-10">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Đặt Lịch Khám Bệnh <span className="block mt-2">Nhanh Chóng & Tiện Lợi</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Kết nối với các bác sĩ hàng đầu, đặt lịch khám online, chăm sóc sức khỏe mọi lúc mọi nơi
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setBookingModalOpen(true)}
              className="group flex items-center space-x-3 px-8 py-4 bg-white text-sky-600 font-semibold rounded-xl hover:bg-sky-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
            >
              <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Đặt Lịch Khám Ngay</span>
            </button>

            <button
              onClick={() => setConsultModalOpen(true)}
              className="group flex items-center space-x-3 px-8 py-4 bg-sky-700 text-white font-semibold rounded-xl hover:bg-sky-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
            >
              <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Tư Vấn Khám Chữa Bệnh</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">100+</div>
              <div className="text-sm sm:text-base text-white/80">Bác sĩ chuyên khoa</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">50K+</div>
              <div className="text-sm sm:text-base text-white/80">Lượt khám thành công</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">4.9★</div>
              <div className="text-sm sm:text-base text-white/80">Đánh giá trung bình</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
