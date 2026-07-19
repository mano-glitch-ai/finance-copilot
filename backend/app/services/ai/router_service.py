import os
import json

from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

router_llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile",
    temperature=0
)


def route_question(question: str):

    prompt = f"""
You are the routing system for a Personal Finance AI Copilot.

Your job is ONLY to decide which tools should be executed.

You may choose ONE OR MORE tools.

Available tools:

------------------------------------------------
search
------------------------------------------------
Use when the user asks about:
- transactions
- merchants
- salary history
- purchases
- payments
- transaction lookup
- bank statement
- document search
- receipts
- transaction dates

------------------------------------------------
analytics
------------------------------------------------
Use when the user asks about:
- dashboard
- spending summary
- income
- expenses
- balance
- category analysis
- totals
- averages
- highest spending category
- monthly summary

------------------------------------------------
forecast
------------------------------------------------
Use when the user asks about:
- forecast
- prediction
- future expenses
- future spending
- next month
- expected spending
- projected expenses

------------------------------------------------
anomalies
------------------------------------------------
Use when the user asks about:
- unusual transactions
- suspicious transactions
- anomalies
- fraud
- weird spending
- abnormal expenses
- spending alerts
- outliers
- duplicate charges
- suspicious payments

------------------------------------------------
greeting
------------------------------------------------
Use only for greetings.

------------------------------------------------
out_of_scope
------------------------------------------------
Anything unrelated to personal finance.

Rules:

- Return ONLY JSON.
- Never explain your reasoning.
- Multiple tools are allowed.
- If analytics and forecast are both needed, return both.
- If analytics and anomalies are needed, return both.
- If search and analytics are needed, return both.
- If search and anomalies are needed, return both.

Examples

Question:
Show my salary transactions

Output:
{{"tools":["search"]}}

Question:
Give me my dashboard

Output:
{{"tools":["analytics"]}}

Question:
Forecast my expenses next month

Output:
{{"tools":["forecast"]}}

Question:
Any suspicious transactions?

Output:
{{"tools":["anomalies"]}}

Question:
Show my salary and summarize my finances

Output:
{{"tools":["search","analytics"]}}

Question:
Analyze my spending and tell me if anything looks unusual

Output:
{{"tools":["analytics","anomalies"]}}

Question:
Analyze my finances and predict next month

Output:
{{"tools":["analytics","forecast"]}}

Question:
Hello

Output:
{{"tools":["greeting"]}}

Question:
Who won the FIFA World Cup?

Output:
{{"tools":["out_of_scope"]}}

Question:

{question}
"""

    response = router_llm.invoke(prompt)

    try:
        result = json.loads(response.content)

        if "tools" not in result:
            return {"tools": ["out_of_scope"]}

        return result

    except Exception:
        return {
            "tools": ["out_of_scope"]
        }


def greeting_tool(question: str):

    return {
        "answer": "Hello! I'm your Personal Finance AI assistant."
    }


def out_of_scope_tool(question: str):

    return {
        "answer": "I can only answer questions related to your personal finances."
    }