from sqlalchemy import func

from app.models.transaction import Transaction


def get_dashboard_summary(db, user_id):

    income = db.query(
        func.sum(Transaction.amount)
    ).filter(
        Transaction.user_id == user_id,
        Transaction.transaction_type == "Income"
    ).scalar() or 0

    expense = db.query(
        func.sum(Transaction.amount)
    ).filter(
        Transaction.user_id == user_id,
        Transaction.transaction_type == "Expense"
    ).scalar() or 0

    total_transactions = db.query(
        Transaction
    ).filter(
        Transaction.user_id == user_id
    ).count()

    return {

        "total_income": float(income),

        "total_expense": float(expense),

        "balance": float(income - expense),

        "transactions": total_transactions

    }


def get_category_summary(db, user_id):

    results = db.query(

        Transaction.category,

        func.sum(Transaction.amount)

    ).filter(

        Transaction.user_id == user_id,

        Transaction.transaction_type == "Expense"

    ).group_by(

        Transaction.category

    ).all()

    return [

        {

            "category": category,

            "amount": float(amount)

        }

        for category, amount in results

    ]