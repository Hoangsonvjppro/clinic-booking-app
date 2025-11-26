import React, { useState } from "react";

const initialUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "0901234567", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "0912345678", status: "Active" },
  { id: 3, name: "Alice Blue", email: "alice@example.com", phone: "0908899776", status: "Inactive" },
  { id: 4, name: "Michael Brown", email: "mike@med.com", phone: "0923456789", status: "Active" },
  { id: 5, name: "Sarah Green", email: "sarah@health.org", phone: "0934567890", status: "Active" },
];

export default function UsersPage({ isDark }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", status: "Active" });
  const [page, setPage] = useState(1);
  const perPage = 4;

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginatedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", phone: "", status: "Active" });
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm(user);
    setModalOpen(true);
  };

  const saveUser = () => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...form, id: editingUser.id } : u));
    } else {
      setUsers([...users, { ...form, id: Date.now() }]);
    }
    setModalOpen(false);
  };

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 p-8 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>Users</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className={`px-5 py-4 rounded-2xl border-2 w-80 shadow-md focus:outline-none transition ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500"
                  : "bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-indigo-500"
              }`}
            />
            <button
              onClick={openCreateModal}
              className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition shadow-lg"
            >
              + Add User
            </button>
          </div>
        </div>

        {/* Table */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <table className="w-full">
            <thead className={`bg-gradient-to-r ${isDark ? "from-slate-800 to-black text-white" : "from-gray-200 to-slate-200 text-black"}`}>
              <tr>
                <th className="px-8 py-5 text-left font-bold">Name</th>
                <th className="px-8 py-5 text-left">Email</th>
                <th className="px-8 py-5 text-left">Phone</th>
                <th className="px-8 py-5 text-left">Status</th>
                <th className="px-8 py-5 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className={`text-center py-20 text-xl ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    No users found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className={`border-t ${isDark ? "border-gray-700 hover:bg-gray-700" : "hover:bg-gray-50"}`}>
                    <td className={`px-8 py-6 font-medium ${isDark ? "text-gray-100" : "text-gray-800"}`}>{user.name}</td>
                    <td className={`px-8 py-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{user.email}</td>
                    <td className={`px-8 py-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{user.phone}</td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        user.status === "Active"
                          ? isDark ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
                          : isDark ? "bg-red-900/50 text-red-300" : "bg-red-100 text-red-700"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 space-x-3">
                      <button
                        onClick={() => openEditModal(user)}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-6 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className={`px-6 py-3 rounded-2xl border ${page === 1 ? "opacity-50 cursor-not-allowed" : isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"} ${isDark ? "border-gray-600 text-white" : "border-gray-300"}`}
          >
            Previous
          </button>
          <span className={`font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
            Page {page} of {totalPages || 1}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className={`px-6 py-3 rounded-2xl border ${page === totalPages ? "opacity-50 cursor-not-allowed" : isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"} ${isDark ? "border-gray-600 text-white" : "border-gray-300"}`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-2xl p-8 shadow-2xl ${isDark ? "bg-gray-800" : "bg-white"}`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-800"}`}>
              {editingUser ? "Edit User" : "Add New User"}
            </h2>
            <div className="space-y-5">
              <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={`w-full px-5 py-4 rounded-2xl border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={`w-full px-5 py-4 rounded-2xl border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} />
              <input type="text" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={`w-full px-5 py-4 rounded-2xl border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} />
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={`w-full px-5 py-4 rounded-2xl border ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={() => setModalOpen(false)} className={`px-6 py-3 rounded-xl ${isDark ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-300 hover:bg-gray-400"}`}>Cancel</button>
              <button onClick={saveUser} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}