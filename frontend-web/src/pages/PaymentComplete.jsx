import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function PaymentComplete() {
    const [isDark, setIsDark] = useState(localStorage.getItem("mode"))

    const toggleTheme = () => {
        setIsDark(!isDark)
        document.documentElement.classList.toggle("dark")
        localStorage.setItem("mode", isDark)
    }

    const [orderId, setOrderId] = useState()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setOrderId(params.get("orderId"))
    }, [])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 text-center p-6">
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
        >
            <div className="flex justify-center mb-8"><svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#80ff80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-icon lucide-circle-check"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg></div>
                
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Thanh toán thành công!
            </h1>
            <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã thực hiện thanh toán. Giao dịch của bạn đã được xác nhận.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700">Mã giao dịch</p>
            <p className="font-semibold text-gray-800">{orderId}</p>
            </div>

            <button
            onClick={() => (window.location.href = "/")}
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-md transition"
            >
            Quay về trang chủ
            </button>
        </motion.div>
        </div>
    );
}
