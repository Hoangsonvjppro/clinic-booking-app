import { Home, MessageSquare, Calendar, Trophy, Users, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const menuItems = [
  { icon: <Home size={20} />, label: "Home" },
  { icon: <MessageSquare size={20} />, label: "Messages" },
  { icon: <Calendar size={20} />, label: "Bookings" },
  { icon: <Trophy size={20} />, label: "Achievements" },
  { icon: <Users size={20} />, label: "Connections" },
  { icon: <MoreHorizontal size={20} />, label: "More" },
];

export default function SettingSidebar() {
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
          <h2 className="font-semibold text-gray-800">User Name</h2>
          <button className="text-blue-600 text-sm hover:underline">View profile</button>
        </div>
        <nav className="flex flex-col gap-3 mb-4">
          {menuItems.map((item, i) => (
            <button
              key={i}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <NavLink to="/">
          <button className="text-white bg-indigo-900 px-6 py-2 rounded-full w-full hover:bg-indigo-700 transition-color duration-200">Go back</button>
        </NavLink>
      </div>
      <div className="text-center text-sm text-gray-400">© 2025</div>
    </motion.aside>
  );
}
