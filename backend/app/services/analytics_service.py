from collections import defaultdict

from sqlalchemy import func, extract

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

    total = sum(float(amount) for _, amount in results)

    return [

        {
            "category": category,
            "amount": float(amount),
            "percentage": round((float(amount) / total) * 100, 1) if total else 0
        }

        for category, amount in results

    ]


def get_monthly_expenses(db, user_id):

    results = db.query(

        extract("month", Transaction.date).label("month"),

        func.sum(Transaction.amount)

    ).filter(

        Transaction.user_id == user_id,

        Transaction.transaction_type == "Expense"

    ).group_by(

        extract("month", Transaction.date)

    ).order_by(

        extract("month", Transaction.date)

    ).all()

    month_names = [

        "",

        "Jan",

        "Feb",

        "Mar",

        "Apr",

        "May",

        "Jun",

        "Jul",

        "Aug",

        "Sep",

        "Oct",

        "Nov",

        "Dec"

    ]

    return [

        {

            "month": month_names[int(month)],

            "amount": float(amount)

        }

        for month, amount in results

    ]


def get_recent_transactions(db, user_id):

    rows = db.query(

        Transaction

    ).filter(

        Transaction.user_id == user_id

    ).order_by(

        Transaction.date.desc()

    ).limit(5).all()

    return [

        {

            "date": str(t.date),

            "merchant": t.merchant_name,

            "category": t.category,

            "amount": float(t.amount),

            "type": t.transaction_type

        }

        for t in rows

    ]


def get_anomalies(db, user_id):

    transactions = db.query(
        Transaction
    ).filter(
        Transaction.user_id == user_id,
        Transaction.transaction_type == "Expense"
    ).all()

    if not transactions:
        return []

    category_totals = defaultdict(float)
    category_counts = defaultdict(int)

    for t in transactions:
        category_totals[t.category] += float(t.amount)
        category_counts[t.category] += 1

    category_average = {
        category: category_totals[category] / category_counts[category]
        for category in category_totals
    }

    anomalies = []

    for t in transactions:

        average = category_average.get(t.category, 0)

        if average > 0 and float(t.amount) > average * 2:

            anomalies.append({

                "date": str(t.date),

                "merchant": t.merchant_name,

                "category": t.category,

                "amount": float(t.amount),

                "average": round(average, 2),

                "reason": f"{t.category} expense is unusually higher than your average spending."

            })

    anomalies.sort(
        key=lambda x: x["amount"],
        reverse=True
    )

    return anomalies