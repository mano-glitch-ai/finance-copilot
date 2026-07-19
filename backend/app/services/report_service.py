from app.services.analytics_service import (
    get_dashboard_summary,
    get_category_summary,
    get_anomalies,
)

from app.services.forecasting.forecast_service import (
    generate_forecast,
)


def get_weekly_summary(db, user_id):

    dashboard = get_dashboard_summary(
        db=db,
        user_id=user_id
    )

    categories = get_category_summary(
        db=db,
        user_id=user_id
    )

    anomalies = get_anomalies(
        db=db,
        user_id=user_id
    )

    forecast = generate_forecast(
        db=db,
        user_id=user_id,
        days=30
    )

    return {

        "dashboard": dashboard,

        "categories": categories,

        "anomalies": anomalies,

        "forecast": forecast

    }