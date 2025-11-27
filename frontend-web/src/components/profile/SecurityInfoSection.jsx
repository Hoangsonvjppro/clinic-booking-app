import { motion } from "framer-motion";

export default function SecuritySection( {profile, onEdit} ) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
        >
            <h3 className="text-xl font-semibold mb-6 border-b border-gray-200 pb-3">Thông tin tài khoản</h3>
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            {profile.map(({ label, value, editable }, index) => (
                <div
                key={index}
                className="flex justify-between items-center border-b border-gray-100 pb-5 last:border-0"
                >
                <div>
                    <p className="font-medium text-gray-800">{label}</p>
                    <p className="text-gray-600 text-lg mt-1">
                    {Array.isArray(value)
                        ? value.map((role, ind) =>
                            ind === value.length - 1 ? role.displayName : `${role.displayName}, `
                        )
                        : value || "N/A"}
                    </p>
                </div>
                {editable && (
                    <button
                    onClick={() => onEdit(label, value)}
                    className="text-teal-600 font-medium hover:underline transition"
                    >
                    {label === "Password" ? "Đổi mật khẩu" : "Chỉnh sửa"}
                    </button>
                )}
                </div>
            ))}
            </div>
        </motion.div>
    )
}