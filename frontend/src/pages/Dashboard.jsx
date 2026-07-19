import { useEffect, useState } from "react";
import {
    FaMoneyBillWave,
    FaWallet,
    FaChartLine,
    FaReceipt,
    FaRobot,
    FaArrowTrendUp,
    FaShieldHeart,
    FaBullseye,
} from "react-icons/fa6";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import SpendingChart from "../components/charts/SpendingChart";
import RecentTransactions from "../components/RecentTransactions";
import api from "../services/api";

export default function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [anomalies, setAnomalies] = useState([]);

    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Good Morning"
            : hour < 17
                ? "Good Afternoon"
                : "Good Evening";

    useEffect(() => {

        loadDashboard();

    }, []);

    async function loadDashboard() {

        try {

            const [dashboardRes, anomalyRes] = await Promise.all([
                api.get("/analytics/dashboard"),
                api.get("/analytics/anomalies"),
            ]);

            setDashboard(dashboardRes.data);
            setAnomalies(anomalyRes.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (

            <Layout>

                <div className="flex justify-center items-center h-[70vh]">

                    <h1 className="text-3xl font-bold text-white animate-pulse">

                        Loading Dashboard...

                    </h1>

                </div>

            </Layout>

        );

    }

    const savings =
        dashboard.total_income - dashboard.total_expense;

    const savingsRate =
        dashboard.total_income > 0
            ? (
                (savings / dashboard.total_income) *
                100
            ).toFixed(1)
            : 0;

    const health =
        savingsRate >= 35
            ? "Excellent"
            : savingsRate >= 20
                ? "Good"
                : "Needs Attention";

    return (

        <Layout>
            {anomalies.length > 0 && (
                <div className="mb-8 rounded-3xl border border-red-500/40 bg-gradient-to-r from-red-900/30 to-red-950/20 p-6 shadow-lg">

                    <div className="flex items-center gap-3 mb-4">
                        <div className="text-3xl">
                            ⚠️
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-red-400">
                                Anomaly Detected
                            </h2>

                            <p className="text-slate-300">
                                {anomalies.length} unusual transaction{anomalies.length > 1 ? "s" : ""} found.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {anomalies.slice(0, 3).map((item, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-red-500/20 bg-slate-900 p-5"
                            >
                                <div className="flex justify-between items-center">

                                    <div>

                                        <h3 className="text-white font-bold">
                                            {item.merchant}
                                        </h3>

                                        <p className="text-slate-400 text-sm">
                                            {item.category}
                                        </p>

                                    </div>

                                    <div className="text-right">

                                        <p className="text-red-400 text-xl font-bold">
                                            ₹{item.amount.toLocaleString()}
                                        </p>

                                    </div>

                                </div>

                                <p className="mt-3 text-red-300">
                                    {item.reason}
                                </p>

                            </div>
                        ))}
                    </div>

                </div>
            )}

            {/* HERO */}

            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 p-10 mb-10">

                <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />

                <div className="absolute left-0 bottom-0 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl" />

                <div className="relative z-10">

                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm mb-5">

                        🤖

                        AI Finance Copilot Active

                    </span>

                    <h1 className="text-5xl font-extrabold text-white leading-tight">

                        {greeting},{" "}

                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">

                            {user?.name || "User"}

                        </span>

                        👋

                    </h1>

                    <p className="mt-5 max-w-3xl text-slate-300 text-lg leading-8">

                        Your AI Copilot has analyzed your latest transactions
                        and prepared today's financial overview. Everything
                        important is summarized below.

                    </p>

                    <div className="flex flex-wrap gap-3 mt-8">

                        <div className="px-5 py-3 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 font-semibold">

                            🟢 Financial Health : {health}

                        </div>

                        <div className="px-5 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold">

                            🤖 AI Assistant Online

                        </div>

                        <div className="px-5 py-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-semibold">

                            💰 Savings Rate : {savingsRate}%

                        </div>

                    </div>

                </div>

            </div>

            {/* KPI CARDS */}

            <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">

                <StatCard
                    title="Income"
                    value={`₹${dashboard.total_income.toLocaleString()}`}
                    icon={<FaMoneyBillWave className="text-green-400" />}
                    color="text-green-400"
                />

                <StatCard
                    title="Expenses"
                    value={`₹${dashboard.total_expense.toLocaleString()}`}
                    icon={<FaChartLine className="text-red-400" />}
                    color="text-red-400"
                />

                <StatCard
                    title="Balance"
                    value={`₹${dashboard.balance.toLocaleString()}`}
                    icon={<FaWallet className="text-blue-400" />}
                    color="text-blue-400"
                />

                <StatCard
                    title="Transactions"
                    value={dashboard.transactions}
                    icon={<FaReceipt className="text-purple-400" />}
                    color="text-purple-400"
                />

            </div>

            {/* CHART + AI INSIGHTS */}

            <div className="grid xl:grid-cols-2 gap-6 mt-8">

                <SpendingChart />

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 hover:border-blue-500/30 transition-all duration-300">

                    <div className="flex items-center gap-4 mb-8">

                        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">

                            <FaRobot className="text-white text-2xl" />

                        </div>

                        <div>

                            <h2 className="text-white text-2xl font-bold">

                                AI Financial Insights

                            </h2>

                            <p className="text-slate-400">

                                Personalized summary generated from your finances

                            </p>

                        </div>

                    </div>

                    <div className="space-y-5">

                        <div className="flex gap-4">

                            <FaShieldHeart className="text-green-400 mt-1" />

                            <div>

                                <h3 className="text-white font-semibold">

                                    Financial Health

                                </h3>

                                <p className="text-slate-400">

                                    Your current financial health is rated
                                    <span className="text-green-400 font-semibold">

                                        {" "}{health}

                                    </span> based on your savings and spending.

                                </p>

                            </div>

                        </div>

                        <div className="flex gap-4">

                            <FaArrowTrendUp className="text-blue-400 mt-1" />

                            <div>

                                <h3 className="text-white font-semibold">

                                    Savings

                                </h3>

                                <p className="text-slate-400">

                                    You have saved

                                    <span className="text-blue-400 font-semibold">

                                        {" "}₹{savings.toLocaleString()}

                                    </span>

                                    {" "}this period.

                                </p>

                            </div>

                        </div>

                        <div className="flex gap-4">

                            <FaBullseye className="text-purple-400 mt-1" />

                            <div>

                                <h3 className="text-white font-semibold">

                                    Recommendation

                                </h3>

                                <p className="text-slate-400">

                                    Continue maintaining a savings rate above
                                    30% to keep your finances healthy and
                                    improve long-term stability.

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>            {/* RECENT TRANSACTIONS + AI COPILOT */}

            <div className="grid xl:grid-cols-3 gap-6 mt-8">

                <div className="xl:col-span-2">

                    <RecentTransactions />

                </div>

                <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 hover:border-blue-500/30 transition-all duration-300">

                    <div className="flex items-center gap-4 mb-8">

                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">

                            <FaRobot className="text-white text-3xl" />

                        </div>

                        <div>

                            <h2 className="text-2xl font-bold text-white">

                                AI Finance Copilot

                            </h2>

                            <p className="text-slate-400">

                                Your personal financial assistant

                            </p>

                        </div>

                    </div>

                    <div className="space-y-4">

                        <div className="rounded-2xl bg-slate-800/70 border border-slate-700 p-4 hover:border-blue-500/40 transition">

                            <h4 className="text-blue-400 font-semibold">

                                💬 Ask Anything

                            </h4>

                            <p className="text-slate-400 text-sm mt-2">

                                Chat naturally with your financial data.

                            </p>

                        </div>

                        <div className="rounded-2xl bg-slate-800/70 border border-slate-700 p-4 hover:border-blue-500/40 transition">

                            <h4 className="text-green-400 font-semibold">

                                📊 Spending Analysis

                            </h4>

                            <p className="text-slate-400 text-sm mt-2">

                                Discover where your money goes every month.

                            </p>

                        </div>

                        <div className="rounded-2xl bg-slate-800/70 border border-slate-700 p-4 hover:border-blue-500/40 transition">

                            <h4 className="text-purple-400 font-semibold">

                                📈 Expense Forecast

                            </h4>

                            <p className="text-slate-400 text-sm mt-2">

                                Predict future expenses using AI.

                            </p>

                        </div>

                        <div className="rounded-2xl bg-slate-800/70 border border-slate-700 p-4 hover:border-blue-500/40 transition">

                            <h4 className="text-yellow-400 font-semibold">

                                🎯 Smart Recommendations

                            </h4>

                            <p className="text-slate-400 text-sm mt-2">

                                Receive personalized saving suggestions.

                            </p>

                        </div>

                    </div>

                    <div className="mt-8 rounded-2xl bg-blue-500/10 border border-blue-500/20 p-5">

                        <p className="text-blue-300 font-semibold mb-2">

                            Try asking...

                        </p>

                        <ul className="space-y-2 text-slate-300 text-sm">

                            <li>• Where did I spend the most this month?</li>

                            <li>• Summarize my finances.</li>

                            <li>• Show all salary transactions.</li>

                            <li>• Forecast my expenses for next month.</li>

                            <li>• Give me saving recommendations.</li>

                        </ul>

                    </div>

                    <button
                        onClick={() => (window.location.href = "/chat")}
                        className="mt-8 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 text-lg font-bold text-white transition duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/30"
                    >
                        Open AI Assistant →
                    </button>

                </div>

            </div>

        </Layout>

    );

}