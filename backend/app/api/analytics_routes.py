from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_user

from app.services.analytics_service import (
    get_dashboard_summary,
    get_category_summary
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return get_dashboard_summary(
        db=db,
        user_id=current_user.id
    )


@router.get("/category-summary")
def category_summary(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return get_category_summary(
        db=db,
        user_id=current_user.id
    )