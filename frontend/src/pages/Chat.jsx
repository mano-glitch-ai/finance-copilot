import { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

import {
    FaPaperPlane,
    FaRobot,
    FaUser,
} from "react-icons/fa";

export default function Chat() {

    const [question, setQuestion] = useState("");

    const [loading, setLoading] = useState(false);

    const bottomRef = useRef(null);

    const [messages, setMessages] = useState([

        {

            sender: "ai",

            text:
                `👋 Welcome to AI Finance Copilot!

I can help you:

• Search your transactions

• Analyze your spending

• Forecast future expenses

• Answer finance questions using your uploaded statements

Try clicking one of the suggestions below.`,

            tools: [],

        },

    ]);

    useEffect(() => {

        bottomRef.current?.scrollIntoView({

            behavior: "smooth",

        });

    }, [messages]);

    async function sendMessage(customQuestion) {

        const q = customQuestion || question;

        if (!q.trim()) return;

        const userMessage = {

            sender: "user",

            text: q,

        };

        setMessages((prev) => [

            ...prev,

            userMessage,

        ]);

        setQuestion("");

        setLoading(true);

        try {

            const response = await api.post(

                "/chat",

                {

                    question: q,

                }

            );

            const aiMessage = {

                sender: "ai",

                text: response.data.answer,

                tools: response.data.tools || [],

            };

            setMessages((prev) => [

                ...prev,

                aiMessage,

            ]);

        }
        catch (err) {

            console.log(err);

            setMessages((prev) => [

                ...prev,

                {

                    sender: "ai",

                    text: "❌ Sorry, something went wrong while processing your request.",

                    tools: [],

                },

            ]);

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <Layout>

            <h1 className="text-4xl font-bold text-white mb-4">

                AI Finance Copilot

            </h1>

            <div className="flex flex-wrap gap-3 mb-6">

                {[
                    "Show my salary transactions",
                    "Analyze my spending",
                    "Forecast next month's expenses",
                    "Summarize my finances",
                ].map((prompt) => (

                    <button

                        key={prompt}

                        onClick={() => sendMessage(prompt)}

                        className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white hover:border-blue-500 hover:bg-slate-700 transition"

                    >

                        {prompt}

                    </button>

                ))}

            </div>

            <div className="bg-slate-900 rounded-2xl h-[75vh] flex flex-col">

                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {messages.map((msg, index) => (

                        <div

                            key={index}

                            className={`flex ${msg.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                                }`}

                        >

                            <div

                                className={`max-w-2xl rounded-2xl px-5 py-4 ${msg.sender === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-800 text-white"
                                    }`}

                            >

                                <div className="flex gap-3 items-start">

                                    {msg.sender === "ai"

                                        ? <FaRobot className="mt-1" />

                                        : <FaUser className="mt-1" />}

                                    <div className="flex-1">

                                        <p className="whitespace-pre-wrap">

                                            {msg.text}

                                        </p>

                                        {msg.tools && msg.tools.length > 0 && (

                                            <div className="mt-4 flex flex-wrap gap-2">

                                                {msg.tools.map((tool, i) => (

                                                    <span

                                                        key={i}

                                                        className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300"

                                                    >

                                                        {tool}

                                                    </span>

                                                ))}

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                    {loading && (

                        <div className="flex items-center gap-3 text-slate-400">

                            <FaRobot />

                            <span className="animate-pulse">

                                AI is thinking...

                            </span>

                        </div>

                    )}

                    <div ref={bottomRef}></div>

                </div>
                <div className="border-t border-slate-800 p-5">

                    <div className="flex gap-4">

                        <input

                            value={question}

                            onChange={(e) => setQuestion(e.target.value)}

                            onKeyDown={(e) => {

                                if (e.key === "Enter") {

                                    sendMessage();

                                }

                            }}

                            placeholder="Ask about spending, salary, analytics, forecasting..."

                            className="flex-1 rounded-xl bg-slate-800 px-5 py-4 text-white placeholder:text-slate-400 outline-none border border-slate-700 focus:border-blue-500"

                        />

                        <button

                            onClick={() => sendMessage()}

                            disabled={loading}

                            className="rounded-xl bg-blue-600 hover:bg-blue-700 transition px-6 disabled:opacity-50"

                        >

                            <FaPaperPlane className="text-white" />

                        </button>

                    </div>

                </div>

            </div>

        </Layout>

    );

}