import React, { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Star, Users, Plus, Pencil, Trash2 } from "lucide-react";

const initialDoctors = [
  { id: 1, name: "Dr. Emily Wong", email: "emily@med.com", phone: "0909876543", status: "Active", office: "123 Health St, District 1, HCMC", rating: 4.9, patients: 567, reviews: 123 },
  { id: 2, name: "Dr. James Chen", email: "james@clinic.com", phone: "0912345678", status: "Active", office: "456 Wellness Ave, District 3", rating: 4.7, patients: 412, reviews: 98 },
  { id: 3, name: "Dr. Sarah Kim", email: "sarah@health.org", phone: "0923456789", status: "Inactive", office: "789 Care Rd, District 7", rating: 4.8, patients: 298, reviews: 76 },
  { id: 1, name: "Dr. Emily Wong", email: "emily@med.com", phone: "0909876543", status: "Active", office: "123 Health St, District 1, HCMC", rating: 4.9, patients: 567, reviews: 123 },
  { id: 2, name: "Dr. James Chen", email: "james@clinic.com", phone: "0912345678", status: "Active", office: "456 Wellness Ave, District 3", rating: 4.7, patients: 412, reviews: 98 },
  { id: 3, name: "Dr. Sarah Kim", email: "sarah@health.org", phone: "0923456789", status: "Inactive", office: "789 Care Rd, District 7", rating: 4.8, patients: 298, reviews: 76 },
  { id: 1, name: "Dr. Emily Wong", email: "emily@med.com", phone: "0909876543", status: "Active", office: "123 Health St, District 1, HCMC", rating: 4.9, patients: 567, reviews: 123 },
  { id: 2, name: "Dr. James Chen", email: "james@clinic.com", phone: "0912345678", status: "Active", office: "456 Wellness Ave, District 3", rating: 4.7, patients: 412, reviews: 98 },
  { id: 3, name: "Dr. Sarah Kim", email: "sarah@health.org", phone: "0923456789", status: "Inactive", office: "789 Care Rd, District 7", rating: 4.8, patients: 298, reviews: 76 },
];

export default function DoctorsPage({ isDark }) {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 3;

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.email.toLowerCase().includes(search.toLowerCase()) ||
    d.phone.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleCreate = () => {
    const name = prompt("Enter doctor name:");
    if (name) {
      setDoctors([...doctors, {
        id: Date.now(),
        name,
        email: "new@doctor.com",
        phone: "0000000000",
        status: "Active",
        office: "Not set",
        rating: 0,
        patients: 0,
        reviews: 0,
      }]);
    }
  };

  const handleEdit = (id) => {
    const doc = doctors.find(d => d.id === id);
    const newName = prompt("New name:", doc.name);
    if (newName) {
      setDoctors(doctors.map(d => d.id === id ? { ...d, name: newName } : d));
    }
  };

  const handleDelete = (id) => {
    if (confirm("Delete this doctor?")) {
      setDoctors(doctors.filter(d => d.id !== id));
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 p-8 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>Doctors</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search doctors..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className={`px-5 py-4 rounded-2xl border-2 w-80 shadow-md focus:outline-none transition ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500"
                  : "bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-indigo-500"
              }`}
            />
            <button onClick={handleCreate} className="flex items-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition shadow-lg">
              <Plus size={20} /> Add Doctor
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {paginated.map((doc) => (
            <div key={doc.id} className={`rounded-2xl shadow-2xl overflow-hidden ${isDark ? "bg-gray-800" : "bg-white"}`}>
              <div
                onClick={() => setExpanded(expanded === doc.id ? null : doc.id)}
                className={`flex items-center justify-between p-8 cursor-pointer transition ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}
              >
                <div className="grid grid-cols-4 gap-8 flex-1">
                  <div className={`font-bold text-lg ${isDark ? "text-white" : "text-gray-800"}`}>{doc.name}</div>
                  <div className={isDark ? "text-gray-300" : "text-gray-700"}>{doc.email}</div>
                  <div className={isDark ? "text-gray-300" : "text-gray-700"}>{doc.phone}</div>
                  <div>
                    <span className={`px-5 py-2 rounded-full font-bold text-sm ${
                      doc.status === "Active"
                        ? isDark ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
                        : isDark ? "bg-red-900/50 text-red-300" : "bg-red-100 text-red-700"
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(doc.id); }} className={`p-3 rounded-full ${isDark ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}>
                    <Pencil size={18} className={`${isDark ? "text-white" : "text-black"}`} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }} className="p-3 rounded-full hover:bg-red-100 text-red-600">
                    <Trash2 size={18} />
                  </button>
                  {expanded === doc.id ? <ChevronUp className={`${isDark ? "text-white" : "text-black"}`} /> : <ChevronDown className={`${isDark ? "text-white" : "text-black"}`} />}
                </div>
              </div>

              {expanded === doc.id && (
                <div className={`p-8 border-t ${isDark ? "bg-gray-900/50 border-t-gray-700" : "bg-gradient-to-r from-indigo-50 to-purple-50"}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-4">
                      <MapPin className="w-6 h-6 text-indigo-600" />
                      <div>
                        <p className="font-semibold">Office Address</p>
                        <p>{doc.office}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Star className="w-6 h-6 text-yellow-500" />
                      <span className="font-bold text-lg">{doc.rating} ({doc.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Users className="w-6 h-6 text-indigo-600" />
                      <span className="font-bold">{doc.patients} patients</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-6 mt-10">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className={`px-6 py-3 rounded-2xl border ${page === 1 ? "opacity-50 cursor-not-allowed" : isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"} ${isDark ? "text-white border-gray-600" : "border-gray-300"}`}>Previous</button>
          <span className={`font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>Page {page} of {totalPages || 1}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className={`px-6 py-3 rounded-2xl border ${page === totalPages ? "opacity-50 cursor-not-allowed" : isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"} ${isDark ? "text-white border-gray-600" : "border-gray-300"}`}>Next</button>
        </div>
      </div>
    </div>
  );
}