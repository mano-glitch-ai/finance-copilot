import {
    FaRobot,
    FaChartLine,
    FaUpload,
    FaComments,
    FaChartPie,
    FaHome
} from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";

const menu = [

    {
        title: "Dashboard",
        icon: <FaHome />,
        path: "/dashboard"
    },

    {
        title: "AI Chat",
        icon: <FaComments />,
        path: "/chat"
    },

    {
        title: "Upload",
        icon: <FaUpload />,
        path: "/upload"
    },

    {
        title: "Analytics",
        icon: <FaChartPie />,
        path: "/analytics"
    },

    {
        title: "Forecast",
        icon: <FaChartLine />,
        path: "/forecast"
    }

];

export default function Sidebar() {

    const location = useLocation();

    return (

        <div className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen">

            <div className="text-white text-2xl font-bold p-8 flex gap-3 items-center">

                <FaRobot />

                AI Finance

            </div>

            <div className="px-3">

                {

                    menu.map(item => (

                        <Link

                            key={item.path}

                            to={item.path}

                            className={`

flex

items-center

gap-3

mb-2

rounded-xl

px-5

py-4

transition

${location.pathname === item.path

                                    ?

                                    "bg-blue-600 text-white"

                                    :

                                    "text-slate-300 hover:bg-slate-800"

                                }

`}

                        >

                            {item.icon}

                            {item.title}

                        </Link>

                    ))

                }

            </div>

        </div>

    )

}