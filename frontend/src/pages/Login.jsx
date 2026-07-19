import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            console.log("Sending login request...");

            const response = await api.post("/auth/login", {
                email,
                password,
            });

            console.log("Response:", response.data);

            localStorage.setItem(
                "token",
                response.data.access_token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/dashboard");

        } catch (err) {

            console.error(err);

            if (err.response) {
                console.log("Backend Response:", err.response.data);
            }

            setError(
                err.response?.data?.detail ||
                err.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">

            <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-800/80 p-10 shadow-2xl backdrop-blur">

                <div className="mb-8 text-center">

                    <h1 className="text-5xl font-bold text-white">
                        AI Finance
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Personal Finance Copilot
                    </p>

                </div>

                <form onSubmit={handleLogin}>

                    <div className="mb-5">

                        <label className="mb-2 block text-slate-300">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-blue-500"
                        />

                    </div>

                    <div className="mb-6">

                        <label className="mb-2 block text-slate-300">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-blue-500"
                        />

                    </div>

                    {error && (

                        <div className="mb-5 rounded-xl bg-red-900/40 p-3 text-red-300">

                            {error}

                        </div>

                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-blue-600 py-3 text-lg font-semibold text-white transition hover:bg-blue-700"
                    >

                        {loading ? "Signing In..." : "Sign In"}

                    </button>

                </form>

                <div className="mt-8 text-center text-slate-400">

                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="font-semibold text-blue-400 hover:text-blue-300"
                    >
                        Create Account
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Login;