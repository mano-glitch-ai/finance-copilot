import { motion } from "framer-motion";

export default function StatCard({

    title,

    value,

    icon,

    color

}) {

    return (

        <motion.div

            whileHover={{ scale: 1.03 }}

            className="rounded-2xl bg-slate-900 p-6 shadow-xl"

        >

            <div className="flex justify-between">

                <div>

                    <p className="text-slate-400">

                        {title}

                    </p>

                    <h2 className={`text-4xl mt-4 font-bold ${color}`}>

                        {value}

                    </h2>

                </div>

                <div className="text-4xl">

                    {icon}

                </div>

            </div>

        </motion.div>

    )

}