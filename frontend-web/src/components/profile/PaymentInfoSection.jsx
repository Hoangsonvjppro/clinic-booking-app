import { motion } from "framer-motion";
import { CreditCard, Building2 } from "lucide-react";

export default function PaymentSection() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <h3 className="text-xl font-semibold text-gray-800">Phương thức thanh toán</h3>

            <div className="grid md:grid-cols-2 gap-6">
            {/* Add Credit/Debit Card */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-teal-500 transition group cursor-pointer">
                <div className="bg-gray-100 group-hover:bg-teal-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition">
                <CreditCard className="w-10 h-10 text-gray-500 group-hover:text-teal-600" />
                </div>
                <p className="text-lg font-medium text-gray-700">Thêm thẻ tín dụng / ghi nợ</p>
                <p className="text-sm text-gray-500 mt-2">Visa, MasterCard, JCB...</p>
            </div>

            {/* Add Bank Account */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-teal-500 transition group cursor-pointer">
                <div className="bg-gray-100 group-hover:bg-teal-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition">
                <Building2 className="w-10 h-10 text-gray-500 group-hover:text-teal-600" />
                </div>
                <p className="text-lg font-medium text-gray-700">Thêm tài khoản ngân hàng</p>
                <p className="text-sm text-gray-500 mt-2">Chuyển khoản trực tiếp</p>
            </div>
            </div>

            <p className="text-sm text-gray-500 text-center mt-8">
            Bạn chưa liên kết phương thức thanh toán nào.
            </p>
        </motion.div>
        )
}