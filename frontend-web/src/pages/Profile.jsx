import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SettingsSection from "../components/SettingsSection";
import SettingSidebar from "../components/SettingsSidebar";
import EditSettingModal from "../components/EditSettingModal";
import EditPasswordModal from "../components/EditPasswordModal";
import axios from "axios";
import Cookies from "js-cookie"


export default function Profile() {
    const [user, setUser] = useState({})
    const [menteeProfile, setMenteeProfile] = useState([]);

    useEffect(() => {
        const token = Cookies.get("accessToken");
            console.log(token)
            axios.get("http://localhost:8081/api/v1/auth/me", {
            headers: {Authorization: `Bearer ${token}`},
        })
        .then((res) => {
            console.log(res)
            setUser(res.data)
            setMenteeProfile([
                { label: "Username", value: res.data.name, editable: true },
                { label: "Email", value: res.data.email, editable: false },
                { label: "Password", value: "**********", editable: true },
                { label: "Role", value: res.data.roles, editable: false },])
        })
        .catch((res) => {
            console.log(res)
            setUser({})
        })
    }, [])
    

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
        </div>
    );
}
