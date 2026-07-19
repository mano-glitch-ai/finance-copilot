from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
import os

from app.database.session import get_db
from app.auth.dependencies import get_current_user

from app.models.user import User
from app.models.document import Document
from app.models.transaction import Transaction

from app.services.document_service import process_document


router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


# ---------------------------------------------------
# Upload Document
# ---------------------------------------------------

@router.post("/upload")
async def upload_document(

    file: UploadFile = File(...),

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    return process_document(

        file=file,

        db=db,

        current_user=current_user

    )


# ---------------------------------------------------
# Get All Documents
# ---------------------------------------------------

@router.get("/")
def get_documents(

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    documents = (

        db.query(Document)

        .filter(Document.user_id == current_user.id)

        .order_by(Document.uploaded_at.desc())

        .all()

    )

    result = []

    for document in documents:

        transaction_count = (

            db.query(func.count(Transaction.id))

            .filter(

                Transaction.document_id == document.id

            )

            .scalar()

        )

        result.append({

            "id": document.id,

            "file_name": document.file_name,

            "file_type": document.file_type,

            "status": document.processing_status,

            "uploaded_at": document.uploaded_at,

            "transactions": transaction_count

        })

    return result


# ---------------------------------------------------
# Delete Document
# ---------------------------------------------------

@router.delete("/{document_id}")
def delete_document(

    document_id: int,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    document = (

        db.query(Document)

        .filter(

            Document.id == document_id,

            Document.user_id == current_user.id

        )

        .first()

    )

    if document is None:

        raise HTTPException(

            status_code=404,

            detail="Document not found"

        )

    # Delete physical file

    if os.path.exists(document.file_path):

        os.remove(document.file_path)

    # Delete imported transactions

    db.query(Transaction).filter(

        Transaction.document_id == document.id

    ).delete()

    # Delete document

    db.delete(document)

    db.commit()

    return {

        "message": "Document deleted successfully"

    }


# ---------------------------------------------------
# Replace Document
# ---------------------------------------------------

@router.put("/{document_id}/replace")
async def replace_document(

    document_id: int,

    file: UploadFile = File(...),

    db: Session =Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    document = (

        db.query(Document)

        .filter(

            Document.id == document_id,

            Document.user_id == current_user.id

        )

        .first()

    )

    if document is None:

        raise HTTPException(

            status_code=404,

            detail="Document not found"

        )

    # Remove old file

    if os.path.exists(document.file_path):

        os.remove(document.file_path)

    # Remove old transactions

    db.query(Transaction).filter(

        Transaction.document_id == document.id

    ).delete()

    # Remove old document

    db.delete(document)

    db.commit()

    # Upload new document

    return process_document(

        file=file,

        db=db,

        current_user=current_user

    )