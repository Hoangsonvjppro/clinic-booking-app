import { useState } from "react";

export default function PrivacySection() {
    const [privacy, setPrivacy] = useState({
        followList: true,
        darkMode: false,
        cameraAccess: true,
        micAccess: true,
        hideInfo: false,
    });

    const toggle = (key) =>
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));


    const handleLogout = () => {    
        Cookies.remove("accessToken")
        Cookies.remove("refreshToken")
        Cookies.remove("tokenType")
        navigate("/")
        window.location.reload();
    }

    return (
        <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Cài đặt riêng tư
        </h2>

        <div className="space-y-4">

            {/* Ai có thể theo dõi bạn */}
            <div className="flex justify-between items-center p-4 border rounded-xl">
            <div>
                <p className="font-medium">Danh sách theo dõi</p>
                <p className="text-sm text-gray-500">
                Ai có thể xem bệnh viện bạn theo dõi
                </p>
            </div>

            <button
                onClick={() => toggle("followList")}
                className={`w-14 h-7 rounded-full p-1 transition ${
                privacy.followList ? "bg-teal-600" : "bg-gray-400"
                }`}
            >
                <div
                className={`bg-white w-5 h-5 rounded-full transition ${
                    privacy.followList ? "translate-x-7" : "translate-x-0"
                }`}
                />
            </button>
            </div>

            {/* Chế độ sáng / tối */}
            <div className="flex justify-between items-center p-4 border rounded-xl">
            <div>
                <p className="font-medium">Chế độ tối</p>
                <p className="text-sm text-gray-500">
                Bật hoặc tắt Dark Mode trong ứng dụng
                </p>
            </div>

            <button
                onClick={() => toggle("darkMode")}
                className={`w-14 h-7 rounded-full p-1 transition ${
                privacy.darkMode ? "bg-teal-600" : "bg-gray-400"
                }`}
            >
                <div
                className={`bg-white w-5 h-5 rounded-full transition ${
                    privacy.darkMode ? "translate-x-7" : "translate-x-0"
                }`}
                />
            </button>
            </div>

            {/* Truy cập Camera */}
            <div className="flex justify-between items-center p-4 border rounded-xl">
            <div>
                <p className="font-medium">Truy cập Camera</p>
                <p className="text-sm text-gray-500">
                Cho phép ứng dụng sử dụng camera
                </p>
            </div>

            <button
                onClick={() => toggle("cameraAccess")}
                className={`w-14 h-7 rounded-full p-1 transition ${
                privacy.cameraAccess ? "bg-teal-600" : "bg-gray-400"
                }`}
            >
                <div
                className={`bg-white w-5 h-5 rounded-full transition ${
                    privacy.cameraAccess ? "translate-x-7" : "translate-x-0"
                }`}
                />
            </button>
            </div>

            {/* Truy cập Micro */}
            <div className="flex justify-between items-center p-4 border rounded-xl">
            <div>
                <p className="font-medium">Truy cập Micro</p>
                <p className="text-sm text-gray-500">
                Cho phép ứng dụng thu âm/ghi âm
                </p>
            </div>

            <button
                onClick={() => toggle("micAccess")}
                className={`w-14 h-7 rounded-full p-1 transition ${
                privacy.micAccess ? "bg-teal-600" : "bg-gray-400"
                }`}
            >
                <div
                className={`bg-white w-5 h-5 rounded-full transition ${
                    privacy.micAccess ? "translate-x-7" : "translate-x-0"
                }`}
                />
            </button>
            </div>

            {/* Ẩn thông tin cá nhân */}
            <div className="flex justify-between items-center p-4 border rounded-xl">
            <div>
                <p className="font-medium">Ẩn thông tin cá nhân</p>
                <p className="text-sm text-gray-500">
                Người khác sẽ không thấy thông tin cơ bản của bạn
                </p>
            </div>

            <button
                onClick={() => toggle("hideInfo")}
                className={`w-14 h-7 rounded-full p-1 transition ${
                privacy.hideInfo ? "bg-teal-600" : "bg-gray-400"
                }`}
            >
                <div
                className={`bg-white w-5 h-5 rounded-full transition ${
                    privacy.hideInfo ? "translate-x-7" : "translate-x-0"
                }`}
                />
            </button>
            </div>

            <button onClick={handleLogout} className="bg-pink-700 hover:bg-pink-800 text-white px-6 py-2 mt-6 rounded-lg transition-colors">Thoát đăng nhập</button>
        </div>
        </div>
    );
}
