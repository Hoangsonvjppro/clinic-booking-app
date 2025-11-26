import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Star, MapPin, Calendar, Phone } from "lucide-react";
import { doctors } from "../utils/doctors";
import Cookies from "js-cookie"
import NavigationBar from "../components/NavigationBar";
import { use } from "react";

export default function DoctorPage() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(localStorage.getItem("mode"))

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("mode", isDark)
  }

  const searchParams = new URLSearchParams(location.search);
  const doctorId = parseInt(searchParams.get("id"), 10);

  const doctor = doctors.find((d) => d.id === doctorId);

  if (!doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Không tìm thấy bác sĩ hoặc bệnh viện.
      </div>
    );
  }

  return (
    <div className={`${isDark ? "bg-slate-900 text-white" : "bg-gray-100 text-black"}`}>
      <NavigationBar isDark={isDark} toggleTheme={toggleTheme} />
      <div className={`min-h-screen mx-10 mt-2 ${isDark ? "bg-slate-950" : "bg-white"}`}>
        {/* Naviation bar */}
        {/* Banner */}
        <div className="relative w-full h-60 md:h-72">
          <img
            src={doctor.banner}
            alt="Doctor Banner"
            className="w-full h-full object-cover"
          />
          {/* Avatar */}
          <div className="absolute -bottom-16 left-8 flex items-end space-x-4">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className={`w-32 h-32 rounded-full border-4 object-cover ${isDark ? "border-slate-950" : "border-white"}`}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="mt-20 pb-12 px-8 md:px-16">
          {/* Header info */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{doctor.name}</h1>
              <p className="text-blue-600 text-lg font-medium">{doctor.specialty}</p>
              <p className="">{doctor.hospital}</p>
              <div className="flex items-center mt-2 text-yellow-500">
                <Star className="w-5 h-5 fill-yellow-400" />
                <span className="ml-1">{doctor.rating}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex mt-4 md:mt-0 space-x-3">
              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
                <Calendar size={18} className="inline-block mr-2" />
                Đặt lịch khám
              </button>
              <button className={`px-5 py-2 rounded-lg transition ${isDark ? "bg-gray-800 text-amber-50 hover:bg-gray-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>
                <Phone size={18} className="inline-block mr-2" />
                Liên hệ
              </button>
            </div>
          </div>

          {/* About section */}
          <section className={`rounded-xl shadow-sm p-6 mb-6 ${isDark ? "bg-black shadow-gray-700" : "bg-white"}`}>
            <h2 className="text-xl font-semibold mb-3">Giới thiệu</h2>
            <p className="leading-relaxed">
              {doctor.about ||
                `${doctor.name} là chuyên gia ${doctor.specialty.toLowerCase()} tại ${doctor.hospital}, có ${doctor.experience.toLowerCase()}.`}
            </p>
          </section>

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" >
            <div className={`rounded-xl shadow-sm p-4 ${isDark ? "bg-black shadow-gray-700" : "bg-white"}`}>
              <h3 className="font-semibold mb-2">Kinh nghiệm</h3>
              <p>{doctor.experience}</p>
            </div>

            <div className={`rounded-xl shadow-sm p-4 ${isDark ? "bg-black shadow-gray-700" : "bg-white"}`}>
              <h3 className="font-semibold mb-2">Địa chỉ làm việc</h3>
              <p className="flex items-center">
                <MapPin size={16} className="mr-2 text-blue-600" /> {doctor.location}
              </p>
            </div>

            <div className={`rounded-xl shadow-sm p-4 ${isDark ? "bg-black shadow-gray-700" : "bg-white"}`}>
              <h3 className="font-semibold mb-2">Giờ làm việc</h3>
              <p>Thứ 2 - Thứ 7: 08:00 - 17:00</p>
              <p>Chủ nhật: Nghỉ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
