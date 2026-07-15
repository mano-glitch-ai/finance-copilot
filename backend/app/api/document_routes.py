from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import shutil
import os

from app.database.session import get_db

from app.auth.dependencies import get_current_user

from app.models.user import User
from app.models.document import Document

from app.services.parsers.csv_parser import parse_csv
from app.services.transaction_service import save_transactions
from app.services.document_service import process_document


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

    return process_document(
        file=file,
        db=db,
        current_user=current_user
    )