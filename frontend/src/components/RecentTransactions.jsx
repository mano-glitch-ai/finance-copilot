import { useEffect, useState } from "react";
import api from "../services/api";

export default function RecentTransactions() {

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {

        loadTransactions();

    }, []);

    async function loadTransactions() {

        try {

            const res = await api.get(
                "/analytics/recent-transactions"
            );

            setTransactions(res.data);

        }

        catch (err) {

            console.log(err);

        }

    }

    return (

        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8">

            <h2 className="text-2xl font-bold text-white mb-6">

                Recent Transactions

            </h2>

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>

                        <tr className="text-slate-400 border-b border-slate-800">

                            <th className="text-left py-3">

                                Date

                            </th>

                            <th className="text-left py-3">

                                Merchant

                            </th>

                            <th className="text-left py-3">

                                Category

                            </th>

                            <th className="text-right py-3">

                                Amount

                            </th>

                            <th className="text-right py-3">

                                Type

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            transactions.map((t, index) => (

                                <tr

                                    key={index}

                                    className="border-b border-slate-800 hover:bg-slate-800 transition"

                                >

                                    <td className="py-4 text-slate-300">

                                        {t.date}

                                    </td>

                                    <td className="text-white">

                                        {t.merchant}

                                    </td>

                                    <td className="text-slate-300">

                                        {t.category}

                                    </td>

                                    <td className="text-right font-semibold text-white">

                                        ₹{t.amount.toLocaleString()}

                                    </td>

                                    <td className="text-right">

                                        <span

                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${t.type === "Income"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-red-500/20 text-red-400"
                                                }`}

                                        >

                                            {t.type}

                                        </span>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}