import pandas as pd

from app.models.transaction import Transaction


def import_transactions(
    file_path,
    db,
    user_id,
    document_id
):

    df = pd.read_csv(file_path)

    count = 0

    for _, row in df.iterrows():

        transaction = Transaction(

            user_id=user_id,

            document_id=document_id,

            transaction_id=row["Transaction_ID"],

            date=pd.to_datetime(
                row["Date"]
            ).date(),

            transaction_description=row[
                "Transaction_Description"
            ],

            merchant_name=row["Merchant_Name"],

            amount=float(row["Amount"]),

            transaction_type=row[
                "Transaction_Type"
            ],

            category=row["Category"]

        )

        db.add(transaction)

        count += 1

    db.commit()

    return count