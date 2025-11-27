import { useEffect, useState } from "react";
import InformationSection from "../components/profile/InformationSection";
import SettingsSection from "../components/profile/SettingsSection";
import SettingSidebar from "../components/SettingsSidebar";
import axios from "axios";
import Cookies from "js-cookie"
import { Routes, Route } from "react-router-dom";


export default function Profile() {
    const [user, setUser] = useState({})

    useEffect(() => {
        const token = Cookies.get("accessToken");
            console.log(token)
            axios.get("http://localhost:8081/api/v1/auth/me", {
            headers: {Authorization: `Bearer ${token}`},
        })
        .then((res) => {
            console.log(res)
            setUser(res.data)
        })
        .catch((res) => {
            console.log(res)
            setUser({})
        })
    }, [])
    

    

    return (
        <div className="flex min-h-screen bg-white text-gray-800">
        <SettingSidebar role={user.role} />

        <Routes>
            <Route path="/information" element={<InformationSection user={user} />} />
            <Route path="/setting" element={<SettingsSection user={user} />} />
        </Routes>
        </div>
    );
}
