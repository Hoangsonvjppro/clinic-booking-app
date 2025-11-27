import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import MessageSection from "./MessageSettingSection";
import NotificationSection from "./NotificationSettingSection";
import PrivacySection from "./PrivacySerrtingSection";
import LanguageSection from "./LanguageSettingSection";

export default function SettingsSection({ user }) {
  const [profile, setProfile] = useState([
                { label: "Username", value: user.name, editable: true },
                { label: "Email", value: user.email, editable: false },
                { label: "Password", value: "**********", editable: true },
                { label: "Role", value: user.roles, editable: false },]);
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [activeTab, setActiveTab] = useState("Privacy")
  
  const stats = {
    messages: 42,
    bookings: 18,
    hospitals: 5,
    reviews: 4.8,
  };

  const handleEdit = (field, value) => {
      setEditingField(field);
      setEditingValue(value);
  };

  const handleSave = (field, newValue) => {
      setProfile((prev) =>
      prev.map((item) =>
          item.label === field ? { ...item, value: newValue } : item
      )
      );
      setEditingField(null);
  };
  return (
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 pr-24 flex-1 overflow-y-auto h-[75%]"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Thông tin tài khoản</h1>

      {/* Tabs */}
      <div className="border-b border-gray-300 flex gap-10 mb-8">
        <button
          onClick={() => setActiveTab("Privacy")}
          className={`pb-3 text-lg font-medium transition-all duration-75 relative ${
            activeTab === "Privacy"
              ? "text-teal-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Cài đặt riêng tư
          {activeTab === "Privacy" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 rounded-full"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("Chat")}
          className={`pb-3 text-lg font-medium transition-all duration-75 relative ${
            activeTab === "Chat"
              ? "text-teal-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Cài đặt tin nhắn
          {activeTab === "Chat" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 rounded-full"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("Notification")}
          className={`pb-3 text-lg font-medium transition-all duration-75 relative ${
            activeTab === "Notification"
              ? "text-teal-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Cài đặt thông báo
          {activeTab === "Notification" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 rounded-full"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("Language")}
          className={`pb-3 text-lg font-medium transition-all duration-75 relative ${
            activeTab === "Language"
              ? "text-teal-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Ngôn ngữ
          {activeTab === "Language" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 rounded-full"
            />
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === "Chat" && <MessageSection stats={stats} user={user} />}

      {activeTab === "Notification" && <NotificationSection />}

      {activeTab === "Privacy" && <PrivacySection profile={profile} onEdit={handleEdit} />}

      {activeTab === "Language" && <LanguageSection profile={profile} onEdit={handleEdit} />}

      {/* Modals */}
      <AnimatePresence>
        {editingField && editingField === "Password" && (
          <EditPasswordModal
            field={editingField}
            value={editingValue}
            onClose={() => setEditingField(null)}
            onSave={handleSave}
          />
        )}
        {editingField && editingField !== "Password" && (
          <EditSettingModal
            field={editingField}
            value={editingValue}
            onClose={() => setEditingField(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
