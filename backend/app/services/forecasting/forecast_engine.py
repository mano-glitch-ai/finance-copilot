from prophet import Prophet


def train_and_forecast(
    forecast_df,
    days: int = 30
):
    """
    Train a Prophet model using one user's
    historical spending and forecast future expenses.
    """

    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=True,
        daily_seasonality=False
    )

    model.fit(forecast_df)

    future = model.make_future_dataframe(
        periods=days
    )

    forecast = model.predict(future)

    future_rows = forecast.tail(days)

    results = []

    for _, row in future_rows.iterrows():

        results.append({

            "date": row["ds"].strftime("%Y-%m-%d"),

            "predicted_expense": max(
                0,
                round(float(row["yhat"]), 2)
            ),

            "lower_bound": max(
                0,
                round(float(row["yhat_lower"]), 2)
            ),

            "upper_bound": max(
                0,
                round(float(row["yhat_upper"]), 2)
            )

        })

    return results