from rapidfuzz import process

COLUMN_ALIASES = {

    "date": [
        "date",
        "transaction date",
        "txn date",
        "posting date",
        "value date"
    ],

    "description": [
        "description",
        "transaction description",
        "transaction_description",
        "narration",
        "particulars",
        "remarks",
        "details"
    ],

    "merchant": [
        "merchant",
        "merchant_name",
        "payee",
        "beneficiary",
        "receiver"
    ],

    "amount": [
        "amount",
        "transaction amount"
    ],

    "debit": [
        "debit",
        "withdrawal",
        "withdrawal amount",
        "dr"
    ],

    "credit": [
        "credit",
        "deposit",
        "deposit amount",
        "cr"
    ],

    "transaction_type": [
        "transaction_type",
        "transaction type",
        "type"
    ]
}


def normalize_columns(df):

    headers = list(df.columns)

    mapping = {}

    for standard, aliases in COLUMN_ALIASES.items():

        best_match = None
        best_score = 0

        for alias in aliases:

            result = process.extractOne(
                alias,
                headers,
                score_cutoff=75
            )

            if result:

                column, score, _ = result

                if score > best_score:

                    best_match = column
                    best_score = score

        if best_match:
            mapping[standard] = best_match

    return mapping


def get_transaction_amount(row, mapping):

    if "amount" in mapping:

        value = row[mapping["amount"]]

        if str(value).strip() not in ["", "nan", "None"]:
            return abs(float(value))

    if "debit" in mapping:

        value = row[mapping["debit"]]

        if str(value).strip() not in ["", "nan", "None"]:
            return abs(float(value))

    if "credit" in mapping:

        value = row[mapping["credit"]]

        if str(value).strip() not in ["", "nan", "None"]:
            return abs(float(value))

    return 0.0


def get_transaction_type(row, mapping):

    if "transaction_type" in mapping:

        value = str(
            row[mapping["transaction_type"]]
        ).strip()

        if value:
            return value

    if "debit" in mapping:

        value = row[mapping["debit"]]

        if str(value).strip() not in ["", "nan", "None"]:
            return "Expense"

    if "credit" in mapping:

        value = row[mapping["credit"]]

        if str(value).strip() not in ["", "nan", "None"]:
            return "Income"

    return "Unknown"