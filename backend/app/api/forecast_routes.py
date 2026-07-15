from fastapi import APIRouter, Depends, Query

from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User

from app.services.forecasting.forecast_service import generate_forecast


router = APIRouter(
    prefix="/forecast",
    tags=["Forecast"]
)


@router.get("/")
def get_forecast(

    days: int = Query(
        default=30,
        ge=7,
        le=90
    ),

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    return generate_forecast(
        db=db,
        user_id=current_user.id,
        days=days
    )