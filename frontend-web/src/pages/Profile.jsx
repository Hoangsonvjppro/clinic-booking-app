import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SettingsSection from "../components/SettingsSection";
import SettingSidebar from "../components/SettingsSidebar";
import EditSettingModal from "../components/EditSettingModal";
import axios from "axios";
import Cookies from "js-cookie"

export default function Profile() {
    const user = {}
    useEffect(() => {
        const token = Cookies.get("accessToken");
        axios.get("http://localhost:8081/api/v1/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then((res) => {
            console.log(res)
        })
        .catch((res) => {
            console.log(res)
        })
    }, [])
    
    const [menteeProfile, setMenteeProfile] = useState([
        { label: "Username", value: user.name, editable: true },
        { label: "Email", value: user.email, editable: true },
        { label: "Password", value: "**********", editable: true },
        { label: "Role", value: user.role, editable: true },
    ]);

    const [editingField, setEditingField] = useState(null);
    const [editingValue, setEditingValue] = useState("");

    const handleEdit = (field, value) => {
        setEditingField(field);
        setEditingValue(value);
    };

    const handleSave = (field, newValue) => {
        setMenteeProfile((prev) =>
        prev.map((item) =>
            item.label === field ? { ...item, value: newValue } : item
        )
        );
        setEditingField(null);
    };

    return (
        <div className="flex min-h-screen bg-white text-gray-800">
        <SettingSidebar />

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 flex-1 overflow-y-auto"
        >
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h1>

            <div className="border-b border-gray-200 flex gap-8 mb-4">
            <button className="pb-2 border-b-2 border-teal-600 text-teal-600 font-medium">
                Mentee profile
            </button>
            <button className="pb-2 text-gray-500 hover:text-gray-700">
                Personal Info
            </button>
            <button className="pb-2 text-gray-500 hover:text-gray-700">
                Login & Security
            </button>
            </div>

            <SettingsSection
            title="Mentee profile"
            items={menteeProfile}
            onEdit={handleEdit}
            />

            <AnimatePresence>
            {editingField && (
                <EditSettingModal
                field={editingField}
                value={editingValue}
                onClose={() => setEditingField(null)}
                onSave={handleSave}
                />
            )}
            </AnimatePresence>
        </motion.div>
        </div>
    );
}
