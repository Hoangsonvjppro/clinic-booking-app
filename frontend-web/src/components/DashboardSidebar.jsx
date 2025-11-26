import React from "react";
import { Home, UserCheck, Users, Stethoscope } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const menu = [
  { icon: Home, label: "Dashboard", path: "/admin" },
  { icon: UserCheck, label: "Doctor Requests", path: "/admin/requests" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: Stethoscope, label: "Doctors", path: "/admin/doctors" },
];

export default function DashboardSidebar( { isDark } ) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={`h-screen w-64 shadow-2xl z-50 ${isDark ? "bg-gradient-to-b from-slate-800 to-black text-white" : "bg-gradient-to-b from-gray-50 to-white text-black"}`}>
      <div className="p-8">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Stethoscope className="w-9 h-9" />
          Clinic booking
        </h1>
      </div>

      <nav className="mt-10">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              whileHover={{ x: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-8 py-5 text-left transition-all ${
                isActive
                  ? "bg-blue-500 bg-opacity-20 border-l-4 font-semibold"
                  : "hover:bg-blue-400 hover:bg-opacity-10"
              }
              ${
                isDark ? "border-purple-300" : "border-purple-800"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-lg">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}