import React from 'react';
import { Star } from 'lucide-react';

const DoctorCard = ({ doctor, onClick }) => {
  return (
    <div
      onClick={() => onClick && onClick(doctor)}
      className="flex-shrink-0 w-40 sm:w-48 cursor-pointer group"
    >
      <div className="text-center p-4 rounded-xl hover:bg-sky-50 transition-all duration-300">
        {/* Avatar */}
        <div className="relative inline-block mb-3">
          <img
            src={doctor.avatarUrl}
            alt={doctor.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300"
          />
          {/* Online Status Indicator */}
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        {/* Doctor Info */}
        <h3 className="font-semibold text-slate-800 text-sm sm:text-base mb-1 group-hover:text-sky-600 transition-colors">
          {doctor.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-2">{doctor.specialty}</p>

        {/* Rating */}
        {doctor.rating && (
          <div className="flex items-center justify-center space-x-1 text-xs">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-slate-700">{doctor.rating}</span>
            <span className="text-gray-500">({doctor.reviewCount})</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;
