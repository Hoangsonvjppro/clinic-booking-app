import { useState } from "react";

export default function NotificationSection() {
  const [notification, setNotification] = useState({
    allowNotification: true,
    sound: true,
    vibrate: false,
  });

  const toggle = (key) =>
    setNotification((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Cài đặt thông báo
      </h2>

      {/* Cho phép thông báo */}
      <div className="flex justify-between items-center py-4 border-b">
        <div>
          <p className="font-medium">Nhận thông báo</p>
          <p className="text-gray-500 text-sm">
            Bật hoặc tắt toàn bộ thông báo
          </p>
        </div>

        <button
          onClick={() => toggle("allowNotification")}
          className={`w-14 h-7 rounded-full p-1 transition ${
            notification.allowNotification ? "bg-teal-600" : "bg-gray-400"
          }`}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full transition ${
              notification.allowNotification
                ? "translate-x-7"
                : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Âm thanh */}
      <div className="flex justify-between items-center py-4 border-b">
        <p className="font-medium">Âm thanh</p>

        <button
          onClick={() => toggle("sound")}
          className={`w-14 h-7 rounded-full p-1 transition ${
            notification.sound ? "bg-teal-600" : "bg-gray-400"
          }`}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full transition ${
              notification.sound ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Rung */}
      <div className="flex justify-between items-center py-4">
        <p className="font-medium">Rung</p>

        <button
          onClick={() => toggle("vibrate")}
          className={`w-14 h-7 rounded-full p-1 transition ${
            notification.vibrate ? "bg-teal-600" : "bg-gray-400"
          }`}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full transition ${
              notification.vibrate ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
