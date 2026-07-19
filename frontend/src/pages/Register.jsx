import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaUserPlus,
} from "react-icons/fa";

export default function Register() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    async function handleRegister(e) {

        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {

            await api.post("/auth/register", {
                full_name: fullName,
                email,
                password,
            });

            alert("Registration successful!");
            navigate("/login");

        } catch (err) {

            alert(
                err.response?.data?.detail ||
                "Registration failed."
            );

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">

            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-10">

                <div className="text-center mb-10">

                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-5">

                        <FaUserPlus className="text-3xl text-white" />

                    </div>

                    <h1 className="text-4xl font-bold text-white">

                        Create Account

                    </h1>

                    <p className="text-slate-400 mt-3">

                        Join AI Finance Copilot

                    </p>

                </div>

                <form
                    onSubmit={handleRegister}
                    className="space-y-5"
                >

                    <div className="relative">

                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-12 pr-4 py-3 text-white focus:border-blue-500 outline-none"
                        />

                    </div>

                    <div className="relative">

                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-12 pr-4 py-3 text-white focus:border-blue-500 outline-none"
                        />

                    </div>

                    <div className="relative">

                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-12 pr-12 py-3 text-white focus:border-blue-500 outline-none"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        >

                            {showPassword ? <FaEyeSlash /> : <FaEye />}

                        </button>

                    </div>

                    <div className="relative">

                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-12 pr-12 py-3 text-white focus:border-blue-500 outline-none"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        >

                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}

                        </button>

                    </div>                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl py-3 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                <div className="mt-8 text-center">

                    <p className="text-slate-400">

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="text-blue-400 hover:text-blue-300 font-semibold"
                        >
                            Login
                        </Link>

                    </p>

                </div>

            </div>

        </div>

    );

}