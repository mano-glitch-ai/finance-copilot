import { useEffect, useState } from "react";
import api from "../../services/api";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    Tooltip,
    CartesianGrid,
    YAxis,
} from "recharts";

export default function SpendingChart() {

    const [data, setData] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {

            const res = await api.get(
                "/analytics/monthly-expenses"
            );

            setData(res.data);

        } catch (err) {
            console.log(err);
        }
    }

    return (

        <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">

            <h2 className="text-white text-2xl font-bold mb-6">

                Monthly Expenses

            </h2>

            <div className="h-80">

                <ResponsiveContainer>

                    <LineChart data={data}>

                        <CartesianGrid stroke="#334155" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip
                            formatter={(value) => [
                                `₹${Number(value).toLocaleString()}`,
                                "Expense"
                            ]}
                        />

                        <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#3B82F6"
                            strokeWidth={4}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}