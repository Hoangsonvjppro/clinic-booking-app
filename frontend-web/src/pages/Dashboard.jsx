import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import DoctorCard from "../components/DoctorCard";
import DoctorQuickView from "../components/DoctorQuickView";
import NavigationBar from "../components/NavigationBar";
import { doctors } from "../utils/doctors";

export default function Dashboard() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDark, setIsDark] = useState(localStorage.getItem("mode"))

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("mode", isDark)
  }

  return (
    <div>
      <NavigationBar isDark={isDark} toggleTheme={toggleTheme} />
      
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
