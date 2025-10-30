import React, {useState} from "react";

import NavigationBar from "../components/NavigationBar"
import axios from "axios";
import { useNavigate } from "react-router-dom"


export default function PaymentPage() {
    const [isDark, setIsDark] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState("momo");
    const [displayMethod, setDisplayMethod] = useState("webpay");

    const nav = useNavigate()

    let order = {
        doctor: "Nguyễn Văn A",
        time: "15:00",
        date: "12/2/25",
        address: "123/45 Đường Cách mạng Tháng tám, Phường 10, Quận 3",
        amount: "10000",
        user: "nguoidung"
    }

    const toggleTheme = () => {
        setIsDark(!isDark)
        document.documentElement.classList.toggle("dark")
    }

    const onPayment = async () => {
        let makePayment = {
            amount: order.amount,
            orderInfo: order.doctor + "\n" + order.time + "\n" + order.date + "\n" + order.address
        }
        axios.post('http://localhost:8080/api/momo/create', makePayment)
        .then(function(response) {
            console.log(response)
            window.open(response.data.payUrl)
        })
        .catch(function(err) {
            console.log(err)
        })
    }

    return (
        <div className={`min-h-screen flex flex-col items-center py-6 transition-colors duration-300 ${isDark ? "bg-cyan-950 text-white" : "bg-gray-50 text-gray-900"}`}>
            <NavigationBar isDark={isDark} toggleTheme={toggleTheme} />
            {/* Header */}
            <div className={`flex items-center mt-12 ${isDark ? "text-white" : "text-gray-900"}`}>
                <img
                    src="/logo.svg"
                    alt="Your Store"
                    className="w-16 h-16 mb-2"
                />
                <h1 className={`text-2xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>CLINIC BOOKER</h1>
            </div>

            {/* Progress Bar */}
            <div className={`flex items-center mb-8 text-sm transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>
            <div className={`flex items-center ${isDark ? "text-white" : "text-gray-900"}`}>
                <div className={`w-6 h-6 rounded-full border-2 border-red-600 flex items-center justify-center text-red-600 font-semibold transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>
                ✓
                </div>
                <span className={`ml-2 ${isDark ? "text-white" : "text-gray-900"}`}>Shipping</span>
            </div>
            <div className="w-16 h-[1px] bg-gray-300 mx-3"></div>
            <div className={`flex items-center ${isDark ? "text-white" : "text-gray-900"}`}>
                <div className={`w-6 h-6 rounded-full border-2 border-red-600 flex items-center justify-center text-red-600 font-semibold transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>
                2
                </div>
                <span className={`ml-2 font-medium text-red-600 transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>Review & Pay</span>
            </div>
            <div className="w-16 h-[1px] bg-gray-300 mx-3"></div>
            <div className={`flex items-center ${isDark ? "text-white" : "text-gray-900"}`}>
                <div className={`w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                3
                </div>
                <span className={`ml-2 ${isDark ? "text-white" : "text-gray-900"}`}>Complete</span>
            </div>
            </div>

            {/* Main Container */}
            <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
            {/* Payment Section */}
            <div className="md:col-span-2 border rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-6">3. Choose your payment methods</h2>

                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    {[
                    { id: "momo", name: "Ví MoMo", img: "https://test-payment.momo.vn/v2/gateway/images/logo-momo.png" },
                    { id: "later", name: "Ví trả sau", img: "https://test-payment.momo.vn/v2/gateway/images/credit/vts.png" },
                    { id: "atm", name: "Thẻ ATM nội địa", img: "https://test-payment.momo.vn/v2/gateway/images/credit/atm.svg" },
                    { id: "visa", name: "Thẻ Visa/Mastercard/JCB", img: "https://test-payment.momo.vn/v2/gateway/images/credit/logo-visa-master-jcb.svg" },
                    ].map((method) => (
                    <label
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center border rounded-xl p-4 cursor-pointer transition ${
                        paymentMethod === method.id
                            ? (isDark ? "border-pink-500 bg-slate-800" : "border-pink-500 bg-pink-50")
                            : (isDark ? "border-white-50 bg-neutral-900" : "border-gray-300 hover:border-pink-400")
                        }`}
                    >
                        <img src={method.img} alt={method.name} className="h-8 w-auto mr-3" />
                        <span className="font-medium text-sm flex-1">{method.name}</span>
                        <div
                        className={`w-4 h-4 rounded-full border-2 ${
                            paymentMethod === method.id
                            ? "border-pink-500 bg-pink-500"
                            : "border-gray-400"
                        }`}
                        ></div>
                    </label>
                    ))}
                </div>

                <h2 className="text-lg font-semibold mb-6">4. Display methods</h2>

                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    {[
                    {
                        id: "webpay",
                        name: "WebPay",
                        desc: "Applies on the website (Desktop/Mobile) platform",
                    },
                    {
                        id: "qrcode",
                        name: "QRCode Pay",
                        desc: "Applies on SmartTV/Kiot/Smart Phone/Tablet platform",
                    },
                    {
                        id: "mobileapp",
                        name: "MobileApp Pay",
                        desc: "Redirect to MoMo application directly. Mobile Browser Only",
                    },
                    ].map((option) => (
                    <label
                        key={option.id}
                        onClick={() => setDisplayMethod(option.id)}
                        className={`border rounded-xl p-4 cursor-pointer transition ${
                        displayMethod === option.id
                            ? (isDark ? "border-pink-500 bg-slate-800" : "border-pink-500 bg-pink-50")
                            : (isDark ? "border-white-50 bg-neutral-900" : "border-gray-300 hover:border-pink-400")
                        }`}
                    >
                        <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{option.name}</span>
                        <div
                            className={`w-4 h-4 rounded-full border-2 ${
                            displayMethod === option.id
                                ? "border-pink-500 bg-pink-500"
                                : "border-gray-400"
                            }`}
                        ></div>
                        </div>
                        <p className="text-xs">{option.desc}</p>
                    </label>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center">
                    <button className="hover:underline">
                    ← Back to delivery details
                    </button>
                    <button onClick={onPayment} className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition cursor-pointer">
                    Pay now
                    </button>
                </div>
                </div>

            {/* Order Summary */}
            <div className={`border rounded-2xl p-6 shadow-sm  transition-colors duration-300 ${isDark ? "text-white bg-gray-900" : "text-gray-900 bg-slate-100"}`}>
                <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Order Summary</h2>

                <div className="flex items-start justify-between mb-4">
                <div>
                    <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{order.doctor} <br />Thời gian: {order.time} - {order.date}</p>
                    <p className={`text-sm text-gray-500 transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Địa chỉ: {order.address} 
                    </p>
                </div>
                <span className={`font-semibold transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>{Number(order.amount).toLocaleString('en-US')}đ</span>
                </div>

                <div className="border-t my-4 transition-colors duration-300"></div>

                <p className={`text-sm text-gray-600 mb-2 transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>
                <strong>Discounts:</strong> Gift vouchers and promo codes applied.
                </p>
                <p className={`text-sm text-gray-600 mb-2 transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>
                    <strong>Ưu đãi:</strong> Nếu check up không tốn quá nhiều thời gian sẽ không  tính phí</p>

                <div className="border-t my-4 transition-colors duration-300"></div>

                <div className={`flex justify-between text-sm mb-1 transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>
                <span>Tổng</span>
                <span>{Number(order.amount).toLocaleString('en-US')}đ</span>
                </div>
                <div className={`flex justify-between text-sm mb-1 transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>
                <span>Giảm giá</span>
                <span>0đ</span>
                </div>
                <div className={`flex justify-between text-sm mb-3 transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>
                <span>VAT (20%)</span>
                <span>36,023đ</span>
                </div>

                <div className="border-t my-3 transition-colors duration-300"></div>

                <div className={`flex justify-between font-semibold text-lg transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}>
                <span>Tổng cộng</span>
                <span>136,023đ</span>
                </div>
            </div>
            </div>
        </div>
    );
}
