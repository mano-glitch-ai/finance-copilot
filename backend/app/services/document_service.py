import os
import shutil

from app.models.document import Document

from app.services.parsers.parser_factory import parse_document
from app.services.transaction_service import save_transactions
from app.services.ml.predictor import predict_category


def process_document(file, db, current_user):

    # Create user upload folder
    user_folder = f"uploads/user_{current_user.id}"
    os.makedirs(user_folder, exist_ok=True)

    # Save uploaded file
    file_path = os.path.join(
        user_folder,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Create document record
    document = Document(
        user_id=current_user.id,
        file_name=file.filename,
        file_path=file_path,
        file_type=file.filename.split(".")[-1].lower(),
        processing_status="PROCESSING",
        extracted_text=None
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    try:

        # Parse uploaded file
        transactions = parse_document(file_path)

        # -----------------------------
        # AI Category Prediction
        # -----------------------------
        for transaction in transactions:

            transaction["category"] = predict_category(
                merchant_name=transaction.get(
                    "merchant_name",
                    ""
                ),
                description=transaction.get(
                    "transaction_description",
                    ""
                ),
                transaction_type=transaction.get(
                    "transaction_type",
                    ""
                )
            )

        # Save transactions
        inserted = save_transactions(
            transactions=transactions,
            db=db,
            user_id=current_user.id,
            document_id=document.id
        )

        # Update status
        document.processing_status = "COMPLETED"

        db.commit()

        return {
            "message": "Upload successful",
            "document_id": document.id,
            "transactions_imported": inserted,
            "status": document.processing_status
        }

    except Exception as e:

        document.processing_status = "FAILED"

        db.commit()

        raise e