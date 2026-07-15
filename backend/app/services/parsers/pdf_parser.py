import pdfplumber


def parse_pdf(file_path):

    text = ""

    with pdfplumber.open(file_path) as pdf:

        for page in pdf.pages:

            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

    print("=" * 60)
    print("PDF CONTENT")
    print("=" * 60)
    print(text)
    print("=" * 60)

    return []