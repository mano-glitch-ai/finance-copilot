from sqlalchemy.orm import Session

from app.models.user import User

from app.services.ai.search_service import search_transactions
from app.services.analytics_service import (
    get_dashboard_summary,
    get_category_summary,
)
from app.services.forecasting.forecast_service import (
    generate_forecast,
)
from app.services.ai.answer_service import generate_answer


class FinanceOrchestrator:

    def __init__(
        self,
        db: Session,
        user: User
    ):

        self.db = db
        self.user = user

    # -------------------------
    # SEARCH
    # -------------------------

    def search(
        self,
        question: str
    ):

        docs = search_transactions(
            query=question,
            user_id=self.user.id
        )

        return "\n\n".join(
            doc.page_content
            for doc in docs
        )

    # -------------------------
    # ANALYTICS
    # -------------------------

    def analytics(self):

        dashboard = get_dashboard_summary(
            db=self.db,
            user_id=self.user.id
        )

        categories = get_category_summary(
            db=self.db,
            user_id=self.user.id
        )

        return f"""
Dashboard

Income: ₹{dashboard['total_income']}

Expense: ₹{dashboard['total_expense']}

Balance: ₹{dashboard['balance']}

Transactions: {dashboard['transactions']}

Categories:

{categories}
"""

    # -------------------------
    # FORECAST
    # -------------------------

    def forecast(self):

        forecast = generate_forecast(
            db=self.db,
            user_id=self.user.id,
            days=30
        )

        return str(forecast)

    # -------------------------
    # FINAL AI
    # -------------------------

    def answer(
        self,
        question: str,
        tools: list[str]
    ):

        context = ""

        if "search" in tools:

            context += "\n\n=== SEARCH ===\n"

            context += self.search(question)

        if "analytics" in tools:

            context += "\n\n=== ANALYTICS ===\n"

            context += self.analytics()

        if "forecast" in tools:

            context += "\n\n=== FORECAST ===\n"

            context += self.forecast()

        return generate_answer(
            question,
            context
        )