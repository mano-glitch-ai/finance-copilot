import re


BANK_KEYWORDS = {
    "upi",
    "neft",
    "rtgs",
    "imps",
    "atm",
    "pos",
    "debit",
    "credit",
    "payment",
    "transfer",
    "txn",
    "transaction",
    "bank",
    "ref",
    "utr",
    "id",
    "no",
    "acc",
    "account",
    "via",
    "to",
    "from"
}


def extract_merchant(description: str):

    if not description:
        return ""

    text = str(description)

    # Remove numbers
    text = re.sub(r"\d+", " ", text)

    # Remove special characters
    text = re.sub(r"[/\-_,.:()]", " ", text)

    words = []

    for word in text.split():

        clean = word.lower()

        if clean in BANK_KEYWORDS:
            continue

        if len(clean) <= 2:
            continue

        words.append(word)

    if not words:
        return "Unknown"

    return " ".join(words[:3])