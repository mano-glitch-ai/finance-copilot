from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import shutil
import os

from app.database.session import get_db

from app.auth.dependencies import get_current_user

from app.models.user import User
from app.models.document import Document

from app.services.transaction_service import import_transactions


router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


@router.post("/upload")
async def upload_document(

    file: UploadFile = File(...),

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    user_folder = f"uploads/user_{current_user.id}"

    os.makedirs(
        user_folder,
        exist_ok=True
    )

    file_path = os.path.join(
        user_folder,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    document = Document(

        user_id=current_user.id,

        file_name=file.filename,

        file_path=file_path,

        file_type=file.filename.split(".")[-1].lower(),

        processing_status="COMPLETED"

    )

    db.add(document)

    db.commit()

    db.refresh(document)

    inserted = 0

    if file.filename.lower().endswith(".csv"):

        inserted = import_transactions(

            file_path=file_path,

            db=db,

            user_id=current_user.id,

            document_id=document.id

        )

    return {

        "message": "Upload successful",

        "document_id": document.id,

        "transactions_imported": inserted

    }