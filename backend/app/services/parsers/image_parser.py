from app.services.ocr.ocr_service import extract_text

from app.services.parsers.text_parser import parse_transactions


def parse_image(file_path):

    text = extract_text(file_path)

    print("=" * 60)
    print("OCR TEXT")
    print("=" * 60)
    print(text)
    print("=" * 60)

    transactions = parse_transactions(text)

    return transactions