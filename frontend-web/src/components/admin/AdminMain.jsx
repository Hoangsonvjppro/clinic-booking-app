import React from "react";
import { Users, Stethoscope, UserCheck, CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Total Users", value: "2,845", change: "+18.2%", color: "bg-blue-500", icon: Users },
  { label: "Active Doctors", value: "127", change: "+5.4%", color: "bg-green-500", icon: Stethoscope },
  { label: "Pending Requests", value: "8", change: "+2", color: "bg-orange-500", icon: UserCheck },
  { label: "Today's Appointments", value: "342", change: "+12%", color: "bg-purple-500", icon: CalendarCheck },
];

export default function AdminMain({ isDark }) {
  return (
    <div
      className={`min-h-screen transition-all duration-500 p-8 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800"
      }`}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-4xl font-bold mb-10 ${
          isDark ? "text-white" : "text-gray-800"
        }`}
      >
        Admin Dashboard
      </motion.h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`${stat.color} text-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                <p className="text-4xl font-bold mt-3">{stat.value}</p>
                <p className="text-sm mt-2 opacity-90 flex items-center gap-1">
                  <span>Up</span> {stat.change}
                </p>
              </div>
              <stat.icon className="w-14 h-14 opacity-80" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl shadow-2xl p-8 border transition-all duration-500 ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-800"}`}>
            Recent Activity
          </h2>
          <div className="space-y-5">
            {[
              { text: "Dr. Sarah requested verification", time: "2 mins ago", dot: "bg-blue-500" },
              { text: "New appointment: John Doe to Dr. Chen", time: "15 mins ago", dot: "bg-green-500" },
              { text: "5-star review for Dr. Wong", time: "1 hour ago", dot: "bg-yellow-500" },
            ].map((act, i) => (
              <div key={i} className="flex items-center gap-5">
                <div className={`w-12 h-12 ${isDark ? "bg-gray-700" : "bg-gray-100"} rounded-full flex items-center justify-center shadow-md`}>
                  <div className={`w-5 h-5 ${act.dot} rounded-full`}></div>
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                    {act.text}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-2xl p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-5">
            {["View Requests", "Export Users", "Export Doctors", "System Settings"].map((action) => (
              <button
                key={action}
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 py-6 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-xl"
              >
                {action}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}