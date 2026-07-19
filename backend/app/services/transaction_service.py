from app.models.transaction import Transaction


def save_transactions(
    transactions,
    db,
    user_id,
    document_id
):

    inserted_transactions = []

    for item in transactions:

        transaction = Transaction(

            user_id=user_id,

            document_id=document_id,

            transaction_id=item["transaction_id"],

            date=item["date"],

            transaction_description=item["transaction_description"],

            merchant_name=item["merchant_name"],

            amount=item["amount"],

            transaction_type=item["transaction_type"],

            category=item["category"]

        )

        db.add(transaction)

        inserted_transactions.append(transaction)

    db.commit()

    for transaction in inserted_transactions:
        db.refresh(transaction)

    return inserted_transactions