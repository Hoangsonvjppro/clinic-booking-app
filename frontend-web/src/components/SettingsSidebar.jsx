import { Home, User, Hospital, Settings, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";


export default function SettingSidebar( {role} ) {
  const location = useLocation()

  const menuItems = [
    { icon: <Settings size={20} />, label: "Cài đặt", location: "/profile/setting" },
    { icon: <User size={20} />, label: "Thông tin của bạn", location: "/profile/information" },
    role ? { icon: <Hospital size={20} />, label: "Trở thành bác sĩ", location: "/profile/doctor" } : { icon: <Hospital size={20} />, label: "Trở thành bác sĩ", location: "/doctor/form" },
    { icon: <MoreHorizontal size={20} />, label: "Thêm", location: "/profile/more" },
    { icon: <Home size={20} />, label: "Trở về trang chủ", location: "/" },
  ];

  return (
    <motion.aside
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="h-screen w-64 border-r border-gray-200 p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-2"></div>
          <h2 className="font-semibold text-gray-800">Tên</h2>
          <h3 className="text-blue-600 text-sm hover:underline">Email@email</h3>
        </div>
        <nav className="flex flex-col gap-3 mb-4">
          {menuItems.map((item, i) => {
            const isActive = location.pathname === item.location;
            return (
              <NavLink to={item.location}>
                <button
                  key={i}
                  className={`flex items-center w-full gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition ${isActive? "bg-gray-300" : ""}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </NavLink>
            )
          })}
        </nav>
      </div>
      <div className="text-center text-sm text-gray-400">© 2025</div>
    </motion.aside>
  );
}
