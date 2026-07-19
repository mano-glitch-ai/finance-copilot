import { useEffect, useState } from "react";
import api from "../services/api";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from "recharts";

const COLORS = [
    "#3B82F6",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#EC4899",
    "#14B8A6"
];

function Analytics() {

    const [summary, setSummary] = useState({
        total_income: 0,
        total_expense: 0,
        balance: 0,
        transactions: 0
    });

    const [categories, setCategories] = useState([]);

    const [monthly, setMonthly] = useState([]);

    const [recent, setRecent] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        fetchAnalytics();

    }, []);

    async function fetchAnalytics() {

        try {

            setLoading(true);

            const [

                dashboardRes,

                categoryRes,

                monthlyRes,

                recentRes

            ] = await Promise.all([

                api.get("/analytics/dashboard"),

                api.get("/analytics/category-summary"),

                api.get("/analytics/monthly-expenses"),

                api.get("/analytics/recent-transactions")

            ]);

            setSummary(dashboardRes.data);

            setCategories(categoryRes.data);

            setMonthly(monthlyRes.data);

            setRecent(recentRes.data);

        }

        catch (err) {

            console.error(err);

            setError(

                err.response?.data?.detail ||

                "Failed to load analytics."

            );

        }

        finally {

            setLoading(false);

        }

    }

    function formatMoney(value) {

        return `₹${Number(value).toLocaleString("en-IN")}`;

    }

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-950 flex items-center justify-center">

                <div className="text-white text-2xl">

                    Loading Analytics...

                </div>

            </div>

        );

    }

    if (error) {

        return (

            <div className="min-h-screen bg-slate-950 flex items-center justify-center">

                <div className="rounded-xl bg-red-900/40 p-6 text-red-300">

                    {error}

                </div>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-slate-950 p-8">

            <div className="mx-auto max-w-7xl">

                <div className="mb-10">

                    <h1 className="text-4xl font-bold text-white">

                        Financial Analytics

                    </h1>

                    <p className="mt-2 text-slate-400">

                        Real-time insights into your financial activity

                    </p>

                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

                        <p className="text-slate-400">

                            Total Income

                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-green-400">

                            {formatMoney(summary.total_income)}

                        </h2>

                    </div>

                    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

                        <p className="text-slate-400">

                            Total Expenses

                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-red-400">

                            {formatMoney(summary.total_expense)}

                        </h2>

                    </div>

                    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

                        <p className="text-slate-400">

                            Current Balance

                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-blue-400">

                            {formatMoney(summary.balance)}

                        </h2>

                    </div>

                    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

                        <p className="text-slate-400">

                            Transactions

                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-yellow-400">

                            {summary.transactions}

                        </h2>

                    </div>

                </div>

                <div className="mt-10 grid gap-8 xl:grid-cols-2">

                    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

                        <h2 className="mb-5 text-xl font-bold text-white">

                            Monthly Expenses

                        </h2>

                        <ResponsiveContainer
                            width="100%"
                            height={330}
                        >

                            <LineChart
                                data={monthly}
                            >

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="month" />

                                <YAxis />

                                <Tooltip />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                />                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

                        <h2 className="mb-5 text-xl font-bold text-white">

                            Expense Categories

                        </h2>

                        <ResponsiveContainer
                            width="100%"
                            height={330}
                        >

                            <PieChart>

                                <Pie
                                    data={categories}
                                    dataKey="amount"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110}
                                    label={({ category, percentage }) =>
                                        `${category} (${percentage}%)`
                                    }
                                >

                                    {categories.map((entry, index) => (

                                        <Cell
                                            key={index}
                                            fill={COLORS[index % COLORS.length]}
                                        />

                                    ))}

                                </Pie>

                                <Tooltip />

                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                </div>

                <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 p-6">

                    <h2 className="mb-6 text-xl font-bold text-white">

                        Recent Transactions

                    </h2>

                    <div className="overflow-x-auto">

                        <table className="min-w-full">

                            <thead>

                                <tr className="border-b border-slate-700 text-left">

                                    <th className="py-3 text-slate-400">

                                        Date

                                    </th>

                                    <th className="py-3 text-slate-400">

                                        Merchant

                                    </th>

                                    <th className="py-3 text-slate-400">

                                        Category

                                    </th>

                                    <th className="py-3 text-slate-400">

                                        Type

                                    </th>

                                    <th className="py-3 text-right text-slate-400">

                                        Amount

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {recent.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan={5}
                                            className="py-10 text-center text-slate-500"
                                        >

                                            No transactions found.

                                        </td>

                                    </tr>

                                ) : (

                                    recent.map((transaction, index) => (

                                        <tr
                                            key={index}
                                            className="border-b border-slate-800 hover:bg-slate-800/40"
                                        >

                                            <td className="py-4 text-slate-300">

                                                {transaction.date}

                                            </td>

                                            <td className="py-4 text-white">

                                                {transaction.merchant}

                                            </td>

                                            <td className="py-4">

                                                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">

                                                    {transaction.category}

                                                </span>

                                            </td>

                                            <td className="py-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-sm font-medium ${transaction.type === "Income"
                                                            ? "bg-green-500/20 text-green-400"
                                                            : "bg-red-500/20 text-red-400"
                                                        }`}
                                                >

                                                    {transaction.type}

                                                </span>

                                            </td>

                                            <td
                                                className={`py-4 text-right font-semibold ${transaction.type === "Income"
                                                        ? "text-green-400"
                                                        : "text-red-400"
                                                    }`}
                                            >

                                                {formatMoney(transaction.amount)}

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Analytics;