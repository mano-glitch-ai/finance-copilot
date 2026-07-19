import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaBell,
    FaCog,
    FaSearch,
    FaSignOutAlt,
} from "react-icons/fa";

export default function Navbar() {

    const navigate = useNavigate();

    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [search, setSearch] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const initials = user?.name
        ? user.name
            .split(" ")
            .map(word => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
        : "U";

    function logout() {

        if (!window.confirm("Are you sure you want to logout?")) return;

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    }

    function searchPage(e) {

        if (e.key !== "Enter") return;

        const value = search.toLowerCase().trim();

        if (value.includes("dashboard"))
            navigate("/dashboard");

        else if (value.includes("analytics"))
            navigate("/analytics");

        else if (value.includes("forecast"))
            navigate("/forecast");

        else if (value.includes("chat"))
            navigate("/chat");

        else if (value.includes("settings"))
            navigate("/settings");

        setSearch("");

    }

    return (

        <div className="bg-slate-900 border-b border-slate-800 h-20 flex items-center justify-between px-8">

            <h1
                onClick={() => navigate("/dashboard")}
                className="text-white text-3xl font-bold cursor-pointer hover:text-blue-400 transition duration-200"
            >
                AI Finance Copilot
            </h1>

            <div className="flex items-center gap-6 relative">

                <div className="relative">

                    <FaSearch className="absolute left-4 top-3 text-slate-400" />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={searchPage}
                        placeholder="Search pages..."
                        className="w-80 bg-slate-800 rounded-xl pl-11 pr-4 py-2 text-white outline-none border border-slate-700 focus:border-blue-500"
                    />

                </div>

                {/* Notifications */}

                <div className="relative">

                    <button
                        onClick={() =>
                            setShowNotifications(!showNotifications)
                        }
                    >

                        <FaBell className="text-white text-xl cursor-pointer hover:text-blue-400 transition" />

                    </button>

                    {showNotifications && (

                        <div className="absolute right-0 mt-4 w-80 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 z-50">

                            <h3 className="text-white font-bold mb-4">

                                Notifications

                            </h3>

                            <div className="space-y-4 text-sm">

                                <div className="text-green-400">

                                    ✅ AI analyzed your latest transactions

                                </div>

                                <div className="text-blue-400">

                                    📈 Forecast updated successfully

                                </div>

                                <div className="text-purple-400">

                                    💰 Budget health is Excellent

                                </div>

                            </div>

                        </div>

                    )}

                </div>

                {/* Profile */}

                <div className="relative">

                    <button
                        onClick={() =>
                            setShowProfile(!showProfile)
                        }
                    >

                        <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg hover:bg-blue-700 transition">

                            {initials}

                        </div>

                    </button>

                    {showProfile && (

                        <div className="absolute right-0 mt-4 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden z-50">

                            <div className="p-5 border-b border-slate-700">

                                <h3 className="text-white font-bold">

                                    {user?.name}

                                </h3>

                                <p className="text-slate-400 text-sm">

                                    {user?.email}

                                </p>

                            </div>

                            <button
                                onClick={() => navigate("/dashboard")}
                                className="w-full text-left px-5 py-3 hover:bg-slate-800 text-white"
                            >
                                🏠 Dashboard
                            </button>

                            <button
                                onClick={() => navigate("/analytics")}
                                className="w-full text-left px-5 py-3 hover:bg-slate-800 text-white"
                            >
                                📊 Analytics
                            </button>

                            <button
                                onClick={() => navigate("/forecast")}
                                className="w-full text-left px-5 py-3 hover:bg-slate-800 text-white"
                            >
                                📈 Forecast
                            </button>

                            <button
                                onClick={() => navigate("/chat")}
                                className="w-full text-left px-5 py-3 hover:bg-slate-800 text-white"
                            >
                                🤖 AI Assistant
                            </button>

                            <button
                                onClick={() => navigate("/settings")}
                                className="w-full text-left px-5 py-3 hover:bg-slate-800 text-white flex items-center gap-2"
                            >
                                <FaCog />

                                Settings
                            </button>

                            <button
                                onClick={logout}
                                className="w-full text-left px-5 py-3 hover:bg-red-900/30 text-red-400 flex items-center gap-2"
                            >
                                <FaSignOutAlt />

                                Logout
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}