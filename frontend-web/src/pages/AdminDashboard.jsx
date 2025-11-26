import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminSidebar from "../components/DashboardSidebar";
import NavigationBar from "../components/NavigationBar";
import AdminMain from "../components/admin/AdminMain";
import DoctorRequestPage from "../components/admin/AdminDoctorRequest";
import UsersPage from "../components/admin/AdminUser";
import DoctorsPage from "../components/admin/AdminDoctor";

function AdminDashboard() {
  const [isDark, setIsDark] = useState(localStorage.getItem("mode"))
  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("mode", isDark)
  }

  return (
    <>
      <NavigationBar isDark={isDark} toggleTheme={toggleTheme} />
      <div className="flex">
        <AdminSidebar isDark={isDark} />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<AdminMain isDark={isDark} />} />
            <Route path="/requests" element={<DoctorRequestPage isDark={isDark} />} />
            <Route path="/users" element={<UsersPage isDark={isDark} />} />
            <Route path="/doctors" element={<DoctorsPage isDark={isDark} />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;