import pandas as pd

from sqlalchemy.orm import Session

from app.models.transaction import Transaction


def load_user_transactions(
    db: Session,
    user_id: int
):

    transactions = db.query(
        Transaction
    ).filter(
        Transaction.user_id == user_id
    ).all()

    if not transactions:
        return pd.DataFrame()

    rows = []

    for txn in transactions:

        rows.append({

            "date": txn.date,

            "amount": txn.amount,

            "transaction_type": txn.transaction_type,

            "category": txn.category,

            "merchant_name": txn.merchant_name

        })

    return pd.DataFrame(rows)