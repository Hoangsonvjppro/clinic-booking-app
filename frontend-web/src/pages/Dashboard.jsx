import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import DoctorCard from "../components/DoctorCard";
import DoctorQuickView from "../components/DoctorQuickView";
import NavigationBar from "../components/NavigationBar";
import { doctors } from "../utils/doctors";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie"
import axios from "axios";

export default function Dashboard() {
  const location = useLocation();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDark, setIsDark] = useState(localStorage.getItem("mode"))
  const [user, setUser] = useState()

  useEffect(() => {
    const token = Cookies.get("accessToken");
    // if (!Cookies.get("refreshToken")) {
    //   Cookies.remove("accessToken")
    // }
    console.log(token)
    axios.get("http://localhost:8081/api/v1/auth/me", {
      headers: {Authorization: `Bearer ${token}`},
    })
    .then((res) => {
      console.log(res)
      setUser(res.data)
    })
    .catch((res) => {
      console.log(res)
    })

  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("mode", isDark)
    console.log(user)
  }

  return (
    <div>
      <NavigationBar isDark={isDark} toggleTheme={toggleTheme} user={user} />
      
      <div className={`flex h-screen ${isDark ? "bg-slate-900 text-white" : "bg-gray-50 text-black"}`}>
        <Sidebar isDark={isDark} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search doctor or hospital..."
              className="border rounded-lg px-4 py-2 w-1/3"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {doctors.map((d) => (
              <DoctorCard
                key={d.id}
                doctor={d}
                onClick={() => setSelectedDoctor(d)}
                isDark={isDark}
              />
            ))}
          </div>
        </main>
        <DoctorQuickView
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          isDark={isDark}
        />
      </div>
    </div>
  );
}
