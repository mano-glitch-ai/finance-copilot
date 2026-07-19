import { useEffect, useState } from "react";

import api from "../../services/api";

import {

    ResponsiveContainer,

    PieChart,

    Pie,

    Tooltip,

    Cell

} from "recharts";

const colors = [

    "#3B82F6",

    "#22C55E",

    "#F97316",

    "#A855F7",

    "#EC4899",

    "#FACC15",

    "#06B6D4",

    "#EF4444"

];

export default function CategoryChart() {

    const [data, setData] = useState([]);

    useEffect(() => {

        loadData();

    }, []);

    async function loadData() {

        try {

            const res = await api.get(

                "/analytics/category-summary"

            );

            setData(res.data);

        }

        catch (err) {

            console.log(err);

        }

    }

    return (

        <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">

            <h2 className="text-white text-2xl font-bold mb-6">

                Expense Categories

            </h2>

            <div className="h-72">

                <ResponsiveContainer>

                    <PieChart>

                        <Pie

                            data={data}

                            dataKey="amount"

                            nameKey="category"

                            outerRadius={100}

                        >

                            {

                                data.map((entry, index) => (

                                    <Cell

                                        key={index}

                                        fill={colors[index % colors.length]}

                                    />

                                ))

                            }

                        </Pie>

                        <Tooltip

                            formatter={(value) => `₹${Number(value).toLocaleString()}`}

                        />

                    </PieChart>

                </ResponsiveContainer>

            </div>

            <div className="mt-6 space-y-3">

                {

                    data.map((item, index) => (

                        <div

                            key={index}

                            className="flex justify-between items-center text-white"

                        >

                            <div className="flex items-center gap-3">

                                <div

                                    className="w-4 h-4 rounded-full"

                                    style={{

                                        backgroundColor: colors[index % colors.length]

                                    }}

                                ></div>

                                <span>

                                    {item.category}

                                </span>

                            </div>

                            <div className="text-slate-300">

                                ₹{item.amount.toLocaleString()}

                                {" "}

                                ({item.percentage}%)

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    )

}