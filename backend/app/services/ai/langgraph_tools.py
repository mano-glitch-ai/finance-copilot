from app.services.ai.search_service import search_transactions

from app.services.analytics_service import (
    get_dashboard_summary,
    get_category_summary,
    get_anomalies,
)

from app.services.forecasting.forecast_service import (
    generate_forecast,
)

from app.services.ai.answer_service import generate_answer

from app.database.session import SessionLocal
from app.services.ai.langgraph_state import FinanceState


def tool_node(state: FinanceState):

    db = SessionLocal()

    context = ""

    try:

        # ---------------- SEARCH ----------------

        if "search" in state["tools"]:

            docs = search_transactions(
                query=state["question"],
                user_id=state["user_id"]
            )

            context += "\n\n=== SEARCH RESULTS ===\n\n"

            if docs:
                context += "\n\n".join(
                    doc.page_content
                    for doc in docs
                )
            else:
                context += "No matching transactions found."

        # ---------------- ANALYTICS ----------------

        if "analytics" in state["tools"]:

            dashboard = get_dashboard_summary(
                db=db,
                user_id=state["user_id"]
            )

            categories = get_category_summary(
                db=db,
                user_id=state["user_id"]
            )

            context += f"""

=== ANALYTICS ===

Total Income: ₹{dashboard['total_income']}

Total Expense: ₹{dashboard['total_expense']}

Current Balance: ₹{dashboard['balance']}

Total Transactions: {dashboard['transactions']}

Category Breakdown:

{categories}

"""

        # ---------------- ANOMALIES ----------------

        if "anomalies" in state["tools"]:

            anomalies = get_anomalies(
                db=db,
                user_id=state["user_id"]
            )

            context += "\n\n=== SPENDING ALERTS ===\n\n"

            if anomalies:

                for item in anomalies:

                    context += f"""
Date: {item['date']}
Merchant: {item['merchant']}
Category: {item['category']}
Amount: ₹{item['amount']}
Average: ₹{item['average']}
Reason: {item['reason']}

"""

            else:

                context += "No unusual transactions were detected."

        # ---------------- FORECAST ----------------

        if "forecast" in state["tools"]:

            forecast = generate_forecast(
                db=db,
                user_id=state["user_id"],
                days=30
            )

            context += f"""

=== FORECAST ===

{forecast}

"""

        return {

            **state,

            "context": context

        }

    finally:

        db.close()


def answer_node(state: FinanceState):

    answer = generate_answer(

        question=state["question"],

        context=state["context"]

    )

    return {

        **state,

        "answer": answer

    }