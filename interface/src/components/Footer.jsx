import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="font-bold text-xl">ClinicCare</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Nền tảng đặt lịch khám bệnh trực tuyến hàng đầu Việt Nam. Kết nối bạn với các bác sĩ uy tín.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-2 bg-slate-700 rounded-lg hover:bg-sky-500 transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-700 rounded-lg hover:bg-sky-500 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-700 rounded-lg hover:bg-sky-500 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-700 rounded-lg hover:bg-sky-500 transition-all">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-sky-400 transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="text-gray-400 hover:text-sky-400 transition-colors">
                  Đội ngũ bác sĩ
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-sky-400 transition-colors">
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-400 hover:text-sky-400 transition-colors">
                  Tin tức
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-sky-400 transition-colors">
                  Về chúng tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Dịch Vụ</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400 hover:text-sky-400 transition-colors cursor-pointer">
                Đặt lịch khám online
              </li>
              <li className="text-gray-400 hover:text-sky-400 transition-colors cursor-pointer">
                Tư vấn từ xa
              </li>
              <li className="text-gray-400 hover:text-sky-400 transition-colors cursor-pointer">
                Xét nghiệm tại nhà
              </li>
              <li className="text-gray-400 hover:text-sky-400 transition-colors cursor-pointer">
                Khám sức khỏe tổng quát
              </li>
              <li className="text-gray-400 hover:text-sky-400 transition-colors cursor-pointer">
                Chương trình chăm sóc
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Liên Hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>123 Nguyễn Huệ, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>1900 1234</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>support@cliniccare.vn</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-2">Giờ làm việc:</p>
              <p className="text-white text-sm">T2 - T7: 8:00 - 20:00</p>
              <p className="text-white text-sm">CN: 8:00 - 17:00</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 ClinicCare. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy" className="hover:text-sky-400 transition-colors">
              Chính sách bảo mật
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-sky-400 transition-colors">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
