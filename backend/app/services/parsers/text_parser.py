import re
import uuid
from datetime import datetime


def parse_transactions(text):

    transactions = []

    pattern = r"(\d{2}/\d{2}/\d{2}).*?UPI-([A-Z0-9\s]+).*?(\d+\.\d{2})"

    matches = re.findall(
        pattern,
        text,
        re.DOTALL
    )

    for match in matches:

        date, merchant, amount = match

        merchant = merchant.strip()

        transaction = {

            "transaction_id": str(uuid.uuid4()),

            "date": datetime.strptime(
                date,
                "%d/%m/%y"
            ).date(),

            "transaction_description": merchant,

            "merchant_name": merchant,

            "amount": float(amount),

            "transaction_type": "Expense",

            # OCR data usually doesn't have enough context
            # to reliably classify the transaction.
            "category": "Uncategorized"

        }

        transactions.append(transaction)

    return transactions