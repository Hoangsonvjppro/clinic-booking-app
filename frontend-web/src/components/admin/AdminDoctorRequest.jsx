import React, { useState, useMemo, useEffect } from "react";
import { Check, X, Download, Eye, XCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios"
import Cookies from "js-cookie"

// const requests = [
//   { id: 1, name: "Dr. Michael Chen", email: "m.chen@med.com", phone: "0912345678", specialty: "Pediatrician", licenseNumber: "MD-2021-08765", issuedDate: "2021-05-15", documents: [ /* ... */ ] },
//   { id: 2, name: "Dr. Sarah Johnson", email: "sarah@clinic.com", phone: "0901234567", specialty: "Cardiologist", licenseNumber: "MD-2019-04521", issuedDate: "2019-11-20", documents: [ /* ... */ ] },
//   { id: 3, name: "Dr. James Williams", email: "james.williams@health.org", phone: "0934567890", specialty: "Neurologist", licenseNumber: "MD-2020-11234", issuedDate: "2020-08-10", documents: [ /* ... */ ] },
//   { id: 4, name: "Dr. Lisa Park", email: "lisa@medpro.com", phone: "0945678901", specialty: "Dermatologist", licenseNumber: "MD-2022-05678", issuedDate: "2022-03-22", documents: [ /* ... */ ] },
//   { id: 5, name: "Dr. David Lee", email: "david@clinic.org", phone: "0956789012", specialty: "Orthopedist", licenseNumber: "MD-2020-09876", issuedDate: "2020-07-15", documents: [ /* ... */ ] },
//   { id: 6, name: "Dr. Anna Brown", email: "anna@healthcare.vn", phone: "0967890123", specialty: "Psychiatrist", licenseNumber: "MD-2023-11223", issuedDate: "2023-01-10", documents: [ /* ... */ ] },
//   // Add more if needed...
// ];

export default function DoctorRequestPage({ isDark }) {
  const [requests, setRequests] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const token = Cookies.get("accessToken")
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("http://localhost:8083/api/doctor/all-application")
        setRequests(res.data.filter(req => req.status === "PENDING"))
        console.log(res)
      } catch(err) {
        console.log(err)
      }
    })()
  }, [])

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
  }, [requests, searchTerm, currentPage]);

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

  const approveApplication = async (applicationId) => {
    console.log("Approve")
    try {
      const res = await axios.put(
        `http://localhost:8083/api/doctor/approve?id=${applicationId}`, {});
      console.log("Approved:", res.data);
      setRequests(prev =>
        prev.map(req =>
          req.id === applicationId ? { ...req, status: "APPROVED" } : req
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const rejectApplication = async (applicationId) => {
    console.log("Reject")
    try {
      const res = await axios.put(
        `http://localhost:8083/api/doctor/reject?id=${applicationId}`, {});
      console.log("Rejected:", res.data);
      setRequests(prev =>
        prev.map(req => 
          req.id === applicationId ? {...req, status: "REJECTED"} : req 
        )
      );
    } catch (err) {
      console.error(err);
    }
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
            placeholder="Tìm kiếm theo tên, email, số điện thoại, chuyên ngành"
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
            <thead className={`bg-gradient-to-r ${isDark ? "from-slate-800 to-black text-white" : "from-gray-200 to-slate-200 text-black"}`}>
              <tr>
                <th className="px-8 py-6 text-left font-bold">Tên bác sĩ</th>
                <th className="px-8 py-6 text-left">Email</th>
                <th className="px-8 py-6 text-left">Số điện thoại</th>
                <th className="px-8 py-6 text-left">Chuyên ngành</th>
                <th className="px-8 py-6 text-center">Xác nhận</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" className={`text-center py-20 text-xl ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Không tìm thấy yêu cầu làm bác sĩ ...
                  </td>
                </tr>
              ) : (
                items.filter(i => i.status === "PENDING").map((req) => (
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
                        <button onClick={() => {approveApplication(req.id)}} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-xl transition transform hover:scale-110">
                          <Check size={18} />
                        </button>
                        <button onClick={() => {rejectApplication(req.id)}} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-xl transition transform hover:scale-110">
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

            <span className={`font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
              Page {currentPage} of {totalPages || 1}
            </span>

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