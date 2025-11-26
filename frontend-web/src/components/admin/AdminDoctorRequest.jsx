import React, { useState, useMemo } from "react";
import { Check, X, Download, Eye, XCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";

const requests = [
  { id: 1, name: "Dr. Michael Chen", email: "m.chen@med.com", phone: "0912345678", specialty: "Pediatrician", licenseNumber: "MD-2021-08765", issuedDate: "2021-05-15", documents: [ /* ... */ ] },
  { id: 2, name: "Dr. Sarah Johnson", email: "sarah@clinic.com", phone: "0901234567", specialty: "Cardiologist", licenseNumber: "MD-2019-04521", issuedDate: "2019-11-20", documents: [ /* ... */ ] },
  { id: 3, name: "Dr. James Williams", email: "james.williams@health.org", phone: "0934567890", specialty: "Neurologist", licenseNumber: "MD-2020-11234", issuedDate: "2020-08-10", documents: [ /* ... */ ] },
  { id: 4, name: "Dr. Lisa Park", email: "lisa@medpro.com", phone: "0945678901", specialty: "Dermatologist", licenseNumber: "MD-2022-05678", issuedDate: "2022-03-22", documents: [ /* ... */ ] },
  { id: 5, name: "Dr. David Lee", email: "david@clinic.org", phone: "0956789012", specialty: "Orthopedist", licenseNumber: "MD-2020-09876", issuedDate: "2020-07-15", documents: [ /* ... */ ] },
  { id: 6, name: "Dr. Anna Brown", email: "anna@healthcare.vn", phone: "0967890123", specialty: "Psychiatrist", licenseNumber: "MD-2023-11223", issuedDate: "2023-01-10", documents: [ /* ... */ ] },
  // Add more if needed...
];

export default function DoctorRequestPage({ isDark }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Filter + Pagination
  const filteredAndPaginated = useMemo(() => {
    let filtered = requests;

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      filtered = requests.filter(req =>
        req.name.toLowerCase().includes(lower) ||
        req.email.toLowerCase().includes(lower) ||
        req.phone.includes(searchTerm) ||
        req.specialty?.toLowerCase().includes(lower) ||
        req.licenseNumber.toLowerCase().includes(lower)
      );
    }

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const items = filtered.slice(start, end);

    return { items, totalPages, totalItems: filtered.length };
  }, [searchTerm, currentPage]);

  const { items, totalPages, totalItems } = filteredAndPaginated;

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openModal = (doctor) => {
    setSelectedDoctor(doctor);
    setZoomedImage(null);
  };

  const closeModal = () => {
    setSelectedDoctor(null);
    setZoomedImage(null);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 p-8 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-4xl font-bold mb-8 ${isDark ? "text-white" : "text-gray-800"}`}>
          Doctor Verification Requests
        </h1>

        {/* Search Bar */}
        <div className="relative max-w-2xl mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input
            type="text"
            placeholder="Search by name, email, phone, specialty, or license..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className={`w-full pl-14 pr-6 py-5 text-lg border-2 rounded-2xl focus:outline-none transition-all shadow-md hover:shadow-lg ${
              isDark
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500"
                : "bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-indigo-500"
            }`}
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Table */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <tr>
                <th className="px-8 py-6 text-left font-bold">Doctor Name</th>
                <th className="px-8 py-6 text-left">Email</th>
                <th className="px-8 py-6 text-left">Phone</th>
                <th className="px-8 py-6 text-left">Specialty</th>
                <th className="px-8 py-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" className={`text-center py-20 text-xl ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    No doctors found matching "<strong>{searchTerm}</strong>"
                  </td>
                </tr>
              ) : (
                items.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => openModal(req)}
                    className={`border-t transition cursor-pointer ${
                      isDark
                        ? "hover:bg-gray-700 border-gray-700"
                        : "hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 border-gray-200"
                    }`}
                  >
                    <td className={`px-8 py-6 font-bold text-lg ${isDark ? "text-indigo-400" : "text-indigo-700"}`}>
                      {req.name}
                    </td>
                    <td className={`px-8 py-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{req.email}</td>
                    <td className={`px-8 py-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{req.phone}</td>
                    <td className={`px-8 py-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{req.specialty || "-"}</td>
                    <td className="px-8 py-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-center gap-4">
                        <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-xl transition transform hover:scale-110">
                          <Check size={18} />
                        </button>
                        <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-xl transition transform hover:scale-110">
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-10">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed" : isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"} ${isDark ? "border-gray-600 text-white" : "border-gray-300"}`}
            >
              <ChevronLeft size={20} /> Previous
            </button>

            <div className={`flex gap-2 ${isDark ? "text-white" : "text-gray-800"}`}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`w-12 h-12 rounded-xl font-semibold transition ${
                    currentPage === pageNum
                      ? "bg-indigo-600 text-white shadow-lg"
                      : isDark
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed" : isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"} ${isDark ? "border-gray-600 text-white" : "border-gray-300"}`}
            >
              Next <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* MODAL & FULLSCREEN IMAGE (unchanged – same as before) */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl shadow-2xl max-w-6xl w-full max-h-[92vh] overflow-hidden flex flex-col ${isDark ? "bg-gray-800" : "bg-white"}`}>
            {/* Header */}
            <div className={`flex justify-between items-center p-8 border-b ${isDark ? "bg-gray-900/50 border-gray-700" : "bg-gradient-to-r from-indigo-50 to-purple-50"}`}>
              <div>
                <h2 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
                  {selectedDoctor.name}
                </h2>
                <p className={`text-xl font-medium ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>
                  {selectedDoctor.specialty}
                </p>
              </div>
              <button onClick={closeModal} className={`${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}>
                <XCircle className="w-10 h-10" />
              </button>
            </div>

            {/* Rest of modal content... */}
            {/* (Same as your previous version – omitted for brevity) */}
          </div>
        </div>
      )}

      {/* Fullscreen zoom... */}
      {zoomedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-10 cursor-zoom-out" onClick={() => setZoomedImage(null)}>
          <img src={zoomedImage} alt="Zoomed" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
          <button className="absolute top-8 right-8 text-white hover:text-gray-300" onClick={() => setZoomedImage(null)}>
            <XCircle className="w-14 h-14" />
          </button>
        </div>
      )}
    </div>
  );
}