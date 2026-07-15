import os
import pandas as pd

from app.services.parsers.normalizer import (
    normalize_columns,
    get_transaction_amount,
    get_transaction_type,
)

from app.services.transaction_normalizer import normalize_transaction


def parse_csv(file_path):

    extension = os.path.splitext(file_path)[1].lower()

    if extension == ".csv":
        df = pd.read_csv(file_path)

    elif extension in [".xlsx", ".xls"]:
        df = pd.read_excel(file_path)

    else:
        raise ValueError(
            f"Unsupported file format: {extension}"
        )

    mapping = normalize_columns(df)

    required = [
        "date",
        "description"
    ]

    missing = [
        field
        for field in required
        if field not in mapping
    ]

    if missing:
        raise ValueError(
            f"Missing required columns: {missing}"
        )

    transactions = []

    for _, row in df.iterrows():

        merchant = ""

        if "merchant" in mapping:
            merchant = str(
                row[mapping["merchant"]]
            ).strip()

        transaction = normalize_transaction(

            date=pd.to_datetime(
                row[mapping["date"]]
            ).date(),

            description=str(
                row[mapping["description"]]
            ).strip(),

            merchant=merchant,

            amount=get_transaction_amount(
                row,
                mapping
            ),

            transaction_type=get_transaction_type(
                row,
                mapping
            )

        )

        transactions.append(transaction)

    return transactions