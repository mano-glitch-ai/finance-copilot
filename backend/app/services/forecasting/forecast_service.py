from sqlalchemy.orm import Session

from app.services.forecasting.data_loader import load_user_transactions
from app.services.forecasting.preprocessor import prepare_daily_expense_data
from app.services.forecasting.forecast_engine import train_and_forecast


def generate_forecast(
    db: Session,
    user_id: int,
    days: int = 30
):

    df = load_user_transactions(
        db=db,
        user_id=user_id
    )

    print("=" * 60)
    print("TOTAL TRANSACTIONS:", len(df))

    if df.empty:
        return {
            "message": "No transactions found for this user."
        }

    print(df["transaction_type"].value_counts())

    forecast_df = prepare_daily_expense_data(df)

    print("=" * 60)
    print("FORECAST DATA ROWS:", len(forecast_df))
    print("=" * 60)

    if forecast_df.empty:
        return {
            "message": "No expense transactions found."
        }

    if len(forecast_df) < 30:
        return {
            "message": f"Only {len(forecast_df)} days of expense history found. At least 30 are required."
        }

    return train_and_forecast(
        forecast_df=forecast_df,
        days=days
    )