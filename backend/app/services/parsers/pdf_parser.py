import pdfplumber
import re
from datetime import datetime


def parse_pdf(file_path):

    transactions = []

    with pdfplumber.open(file_path) as pdf:

        for page in pdf.pages:

            text = page.extract_text()

            if not text:
                continue

            lines = text.split("\n")

            for line in lines:

                line = re.sub(r"\s+", " ", line).strip()

                # Skip headers
                if (
                    line.startswith("Date")
                    or line.startswith("Opening Balance")
                    or line.startswith("Closing Balance")
                    or line.startswith("THIS IS")
                    or line.startswith("Note:")
                    or "ACCOUNT STATEMENT" in line
                ):
                    continue

                # Match transaction rows
                match = re.match(
                    r"(\d{2}-[A-Za-z]{3}-\d{4})\s+"
                    r"(\S+)\s+"
                    r"(.*?)\s+"
                    r"(Credit|Debit)\s+"
                    r"([\d,]+\.\d{2})\s+"
                    r"([\d,]+\.\d{2})$",
                    line,
                )

                if not match:
                    continue

                date_str = match.group(1)
                txn_id = match.group(2)
                description = match.group(3).strip()
                txn_type = match.group(4)
                amount = float(match.group(5).replace(",", ""))

                # Try splitting merchant from description
                parts = description.split()

                if len(parts) >= 2:
                    merchant = parts[-1]
                    description = " ".join(parts[:-1])
                else:
                    merchant = description

                transactions.append(
                    {
                        "transaction_id": txn_id,
                        "date": datetime.strptime(
                            date_str,
                            "%d-%b-%Y"
                        ).date(),
                        "transaction_description": description,
                        "merchant_name": merchant,
                        "amount": amount,
                        "transaction_type": (
                            "Income"
                            if txn_type == "Credit"
                            else "Expense"
                        ),
                    }
                )

    print("=" * 60)
    print(f"Imported {len(transactions)} PDF transactions")
    print("=" * 60)

    return transactions