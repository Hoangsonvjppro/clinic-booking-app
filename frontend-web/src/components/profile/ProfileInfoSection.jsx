import { motion } from "framer-motion";
import { MessageCircle, Calendar, Hospital, Star } from "lucide-react"

export default function ProfileSection( {stats, user} ) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Banner */}
            <div className="relative h-48 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-black opacity-20" />
            <button className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition">
                Thay đổi banner
            </button>
            </div>

            {/* Avatar + Stats */}
            <div className="flex items-end gap-8 -mt-20 relative z-10 px-8">
            <div className="relative">
                <img
                src={user.avatar || "/default-avatar.png"}
                alt="Avatar"
                className="w-40 h-40 rounded-full border-8 border-white shadow-2xl object-cover"
                draggable={false}
                />
                <button className="absolute bottom-2 right-2 bg-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-700 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                </button>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-6 flex-1">
                <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <p className="text-2xl font-bold">{stats.messages}</p>
                    <p className="text-gray-500 text-sm">Tin nhắn</p>
                </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                    <p className="text-2xl font-bold">{stats.bookings}</p>
                    <p className="text-gray-500 text-sm">Lịch đã đặt</p>
                </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                    <Hospital className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <p className="text-2xl font-bold">{stats.hospitals}</p>
                    <p className="text-gray-500 text-sm">Bệnh viện</p>
                </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                    <p className="text-2xl font-bold">{stats.reviews}</p>
                    <p className="text-gray-500 text-sm">Đánh giá</p>
                </div>
                </div>
            </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Thông tin cá nhân</h3>
            <div className="space-y-6">
                {[
                { label: "Họ và tên", value: user.name },
                { label: "Email", value: user.email },
                { label: "Số điện thoại", value: user.phone || "Chưa cung cấp" },
                { label: "Giới tính", value: user.gender || "Chưa cập nhật" },
                { label: "Ngày sinh", value: user.dob || "Chưa cập nhật" },
                { label: "Vai trò", value: Array.isArray(user.roles) ? user.roles.map(r => r.displayName).join(", ") : user.roles },
                ].map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0">
                    <div>
                    <p className="font-medium text-gray-700">{item.label}</p>
                    <p className="text-gray-900 text-lg mt-1">{item.value}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </motion.div>
        )
}