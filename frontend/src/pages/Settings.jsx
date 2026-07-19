import { useNavigate } from "react-router-dom";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaMoon,
    FaSignOutAlt,
    FaShieldAlt,
    FaRobot,
} from "react-icons/fa";

import Layout from "../components/Layout";

export default function Settings() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const initials = user?.name
        ? user.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
        : "U";

    function logout() {

        if (!window.confirm("Logout from AI Finance Copilot?"))
            return;

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    }

    return (

        <Layout>

            <div className="mb-10">

                <h1 className="text-5xl font-bold text-white">

                    Settings

                </h1>

                <p className="text-slate-400 mt-3 text-lg">

                    Manage your account and application preferences.

                </p>

            </div>

            <div className="grid xl:grid-cols-3 gap-8">

                {/* LEFT */}

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

                    <div className="flex flex-col items-center">

                        <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">

                            {initials}

                        </div>

                        <h2 className="text-white text-2xl font-bold mt-6">

                            {user?.name}

                        </h2>

                        <p className="text-slate-400 mt-2">

                            {user?.email}

                        </p>

                        <div className="mt-6 px-5 py-2 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">

                            Account Active

                        </div>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="xl:col-span-2 space-y-6">

                    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">

                        <div className="flex items-center gap-3 mb-5">

                            <FaUser className="text-blue-400 text-xl" />

                            <h3 className="text-white text-xl font-semibold">

                                Profile

                            </h3>

                        </div>

                        <div className="space-y-5">

                            <div>

                                <p className="text-slate-400 text-sm">

                                    Full Name

                                </p>

                                <div className="mt-2 rounded-xl bg-slate-800 p-3 text-white">

                                    {user?.name}

                                </div>

                            </div>

                            <div>

                                <p className="text-slate-400 text-sm">

                                    Email

                                </p>

                                <div className="mt-2 rounded-xl bg-slate-800 p-3 text-white flex items-center gap-3">

                                    <FaEnvelope />

                                    {user?.email}

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">

                        <div className="flex items-center gap-3 mb-5">

                            <FaShieldAlt className="text-green-400 text-xl" />

                            <h3 className="text-white text-xl font-semibold">

                                Security

                            </h3>

                        </div>

                        <button className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 transition text-left p-4 flex items-center gap-4 text-white">

                            <FaLock />

                            Change Password (Coming Soon)

                        </button>

                    </div>

                    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">

                        <div className="flex items-center gap-3 mb-5">

                            <FaMoon className="text-purple-400 text-xl" />

                            <h3 className="text-white text-xl font-semibold">

                                Appearance

                            </h3>

                        </div>

                        <button className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 transition text-left p-4 text-white">

                            🌙 Dark Theme Enabled

                        </button>

                    </div>

                    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">

                        <div className="flex items-center gap-3 mb-5">

                            <FaRobot className="text-cyan-400 text-xl" />

                            <h3 className="text-white text-xl font-semibold">

                                About AI Finance Copilot

                            </h3>

                        </div>

                        <p className="text-slate-400 leading-8">

                            AI Finance Copilot helps you manage expenses,
                            analyze spending, forecast future costs and chat
                            with your financial data using AI-powered insights.

                        </p>

                    </div>

                    <button
                        onClick={logout}
                        className="w-full rounded-2xl bg-red-600 hover:bg-red-700 transition py-4 text-white font-bold text-lg flex items-center justify-center gap-3"
                    >

                        <FaSignOutAlt />

                        Logout

                    </button>

                </div>

            </div>

        </Layout>

    );

}