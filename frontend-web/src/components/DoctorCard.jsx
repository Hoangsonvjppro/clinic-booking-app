import { MapPin, Star } from "lucide-react"

export default function DoctorCard({ doctor, onClick, isDark }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl shadow hover:shadow-lg cursor-pointer overflow-hidden transition ${isDark ? "bg-black text-white shadow-gray-800" : "bg-white text-black"}`}
    >
      <img
        src={doctor.banner}
        alt={doctor.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{doctor.name}</h3>
        <p className="text-sm text-gray-500">{doctor.specialty}</p>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
          <span className="flex items-center">
            <MapPin size={14} className="mr-1" />
            {doctor.location}
          </span>
          <span className="flex items-center">
            <Star size={14} className="text-yellow-400 mr-1" />
            {doctor.rating}
          </span>
        </div>
      </div>
    </div>
  );
}