import uuid


def normalize_transaction(
    *,
    date,
    description,
    amount,
    transaction_type,
    merchant=""
):

    return {

        "transaction_id": str(uuid.uuid4()),

        "date": date,

        "transaction_description": str(description).strip(),

        "merchant_name": str(merchant).strip(),

        "amount": float(amount),

        "transaction_type": str(transaction_type).strip(),

        "category": "Uncategorized"

    }