import { motion } from "framer-motion";
import { useState } from "react";

export default function MessageSection({ user, stats }) {
  const [settings, setSettings] = useState({
    allowStrangerMessages: true,
    markUnread: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Cài đặt tin nhắn
      </h2>

      {/* Cho phép người lạ nhắn tin */}
      <div className="flex justify-between items-center py-4 border-b">
        <div>
          <p className="font-medium">Nhận tin nhắn từ người lạ</p>
          <p className="text-gray-500 text-sm">
            Cho phép mọi người gửi tin nhắn cho bạn
          </p>
        </div>

        <button
          onClick={() => toggleSetting("allowStrangerMessages")}
          className={`w-14 h-7 rounded-full p-1 transition ${
            settings.allowStrangerMessages ? "bg-teal-600" : "bg-gray-400"
          }`}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full transition ${
              settings.allowStrangerMessages ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Đánh dấu là chưa đọc */}
      <div className="flex justify-between items-center py-4">
        <div>
          <p className="font-medium">Đánh dấu là chưa đọc</p>
          <p className="text-gray-500 text-sm">
            Tin nhắn mới sẽ luôn ở trạng thái chưa đọc
          </p>
        </div>

        <button
          onClick={() => toggleSetting("markUnread")}
          className={`w-14 h-7 rounded-full p-1 transition ${
            settings.markUnread ? "bg-teal-600" : "bg-gray-400"
          }`}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full transition ${
              settings.markUnread ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
