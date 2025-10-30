import {
  Home,
  Users,
  Calendar,
  MessageSquare,
  Settings,
} from "lucide-react";

export default function Sidebar( {isDark} ) {
  return (
    <aside className={`w-64 bg-gray-50 h-screen p-4 border-r ${isDark ? "bg-slate-950 text-gray-100" : "bg-gray-100 text-gray-700"}`}>
      <h1 className="text-2xl font-bold mb-6 cursor-pointer">Clinic Booker</h1>
      <nav className="space-y-2">
        <SidebarItem icon={<Home size={18} />} text="Home" isDark={isDark} />
        <SidebarItem icon={<Users size={18} />} text="Đăng ký" isDark={isDark} />
        <SidebarItem icon={<Calendar size={18} />} text="Lịch khám của bạn" isDark={isDark} />
        <SidebarItem icon={<MessageSquare size={18} />} text="Tin nhắn" isDark={isDark} />
        <SidebarItem icon={<Settings size={18} />} text="Cài đặt" isDark={isDark} />
      </nav>
    </aside>
  );
}

function SidebarItem({ icon, text, isDark }) {
  return (
    <button className={`flex items-center space-x-3 w-full p-2 rounded-lg transition cursor-pointer ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}>
      {icon}
      <span>{text}</span>
    </button>
  );
}