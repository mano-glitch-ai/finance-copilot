import { useEffect, useState } from "react";
import api from "../services/api";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from "recharts";

function Forecast() {

    const [forecast, setForecast] = useState([]);

    const [days, setDays] = useState(30);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [message, setMessage] = useState("");

    useEffect(() => {

        fetchForecast(days);

    }, []);

    async function fetchForecast(selectedDays) {

        try {

            setLoading(true);

            setError("");

            setMessage("");

            const response = await api.get(`/forecast?days=${selectedDays}`);

            if (Array.isArray(response.data)) {

                setForecast(response.data);

            }

            else {

                setForecast([]);

                setMessage(response.data.message);

            }

        }

        catch (err) {

            console.error(err);

            setError(

                err.response?.data?.detail ||

                "Unable to load forecast."

            );

        }

        finally {

            setLoading(false);

        }

    }

    function formatMoney(value) {

        return `₹${Number(value).toLocaleString("en-IN")}`;

    }

    const totalExpense = forecast.reduce(

        (sum, item) => sum + item.predicted_expense,

        0

    );

    const averageExpense =

        forecast.length > 0

            ? totalExpense / forecast.length

            : 0;

    const highestExpense =

        forecast.length > 0

            ? Math.max(...forecast.map(f => f.predicted_expense))

            : 0;

    const lowestExpense =

        forecast.length > 0

            ? Math.min(...forecast.map(f => f.predicted_expense))

            : 0;

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-950 flex items-center justify-center">

                <div className="text-2xl text-white">

                    Generating Forecast...

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

    if (message) {

        return (

            <div className="min-h-screen bg-slate-950 flex items-center justify-center">

                <div className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center">

                    <h2 className="text-2xl font-bold text-white">

                        Forecast

                    </h2>

                    <p className="mt-4 text-slate-400">

                        {message}

                    </p>

                </div>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-slate-950 p-8">

            <div className="mx-auto max-w-7xl">

                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-4xl font-bold text-white">

                            Expense Forecast

                        </h1>

                        <p className="mt-2 text-slate-400">

                            AI-powered expense prediction using Prophet

                        </p>

                    </div>

                    <select

                        value={days}

                        onChange={(e) => {

                            const value = Number(e.target.value);

                            setDays(value);

                            fetchForecast(value);

                        }}

                        className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"

                    >

                        <option value={7}>7 Days</option>

                        <option value={14}>14 Days</option>

                        <option value={30}>30 Days</option>

                        <option value={60}>60 Days</option>

                        <option value={90}>90 Days</option>

                    </select>

                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

                        <p className="text-slate-400">

                            Total Forecast

                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-blue-400">

                            {formatMoney(totalExpense)}

                        </h2>

                    </div>

                    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

                        <p className="text-slate-400">

                            Average / Day

                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-green-400">

                            {formatMoney(averageExpense)}

                        </h2>

                    </div>

                    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

                        <p className="text-slate-400">

                            Highest Prediction

                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-red-400">

                            {formatMoney(highestExpense)}

                        </h2>

                    </div>

                    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

                        <p className="text-slate-400">

                            Lowest Prediction

                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-yellow-400">

                            {formatMoney(lowestExpense)}

                        </h2>

                    </div>

                </div>

                <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 p-6">

                    <h2 className="mb-5 text-xl font-bold text-white">

                        Forecast Trend

                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={380}
                    >

                        <LineChart
                            data={forecast}
                        >

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="date" />

                            <YAxis />

                            <Tooltip />

                            <Legend />

                            <Line
                                type="monotone"
                                dataKey="predicted_expense"
                                stroke="#3B82F6"
                                strokeWidth={3}
                            />

                            <Line dataKey="lower_bound"
                                stroke="#F59E0B"
                                strokeDasharray="5 5"
                                strokeWidth={2}
                                dot={false}
                                name="Lower Bound"
                            />

                            <Line
                                type="monotone"
                                dataKey="upper_bound"
                                stroke="#22C55E"
                                strokeDasharray="5 5"
                                strokeWidth={2}
                                dot={false}
                                name="Upper Bound"
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

                <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 p-6">

                    <h2 className="mb-6 text-xl font-bold text-white">

                        Forecast Details

                    </h2>

                    <div className="overflow-x-auto">

                        <table className="min-w-full">

                            <thead>

                                <tr className="border-b border-slate-700 text-left">

                                    <th className="py-3 text-slate-400">

                                        Date

                                    </th>

                                    <th className="py-3 text-right text-slate-400">

                                        Predicted Expense

                                    </th>

                                    <th className="py-3 text-right text-slate-400">

                                        Lower Bound

                                    </th>

                                    <th className="py-3 text-right text-slate-400">

                                        Upper Bound

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {forecast.map((item, index) => (

                                    <tr
                                        key={index}
                                        className="border-b border-slate-800 hover:bg-slate-800/40"
                                    >

                                        <td className="py-4 text-white">

                                            {item.date}

                                        </td>

                                        <td className="py-4 text-right font-semibold text-blue-400">

                                            {formatMoney(item.predicted_expense)}

                                        </td>

                                        <td className="py-4 text-right text-yellow-400">

                                            {formatMoney(item.lower_bound)}

                                        </td>

                                        <td className="py-4 text-right text-green-400">

                                            {formatMoney(item.upper_bound)}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Forecast;