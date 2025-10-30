import { X } from "lucide-react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { NavLink } from "react-router-dom";

export default function DoctorQuickView({ doctor, onClose, isDark }) {
  return (
    <AnimatePresence>
      {doctor && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
          {/* Overlay background (fade-in) */}
          <div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration:0.2, ease:"easeInOut" }}
            className="absolute inset-0 bg-black/10 backdrop-blur-sm" />

          {/* Slide-in panel */}
          <motion.div
            key="panel"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ duration:0.2, type: "tween", damping:16 }}
            className={`relative w-96 h-full p-6 shadow-xl z-50 ${isDark ? "bg-slate-900 text-white" : "bg-white text-black"}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{doctor.name}</h2>
              <button onClick={onClose}>
                <X size={20} className="text-gray-500 hover:text-black" />
              </button>
            </div>

            <img
              src={doctor.banner}
              alt={doctor.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />

            <p className="text-gray-600 mb-2">
              <strong>Specialty:</strong> {doctor.specialty}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Location:</strong> {doctor.location}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Experience:</strong> {doctor.experience}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Rating:</strong> {doctor.rating} ⭐
            </p>

            <NavLink to={`/doctor-appointment?id=${doctor.id}`} activeClassName="active-link" >
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Book Appointment
                </button>
            </NavLink>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
