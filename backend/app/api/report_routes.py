from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.auth.dependencies import get_current_user
from app.models.user import User

from app.services.report_service import get_weekly_summary

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/weekly-summary")
def weekly_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_weekly_summary(
        db=db,
        user_id=current_user.id
    )