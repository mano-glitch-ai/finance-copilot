import os

from app.services.parsers.csv_parser import parse_csv
from app.services.parsers.pdf_parser import parse_pdf
from app.services.parsers.image_parser import parse_image


def parse_document(file_path):

    extension = os.path.splitext(file_path)[1].lower()

    if extension in [".csv", ".xlsx", ".xls"]:
        return parse_csv(file_path)

    elif extension == ".pdf":
        return parse_pdf(file_path)

    elif extension in [".png", ".jpg", ".jpeg"]:
        return parse_image(file_path)

    else:
        raise ValueError(
            f"Unsupported file type: {extension}"
        )