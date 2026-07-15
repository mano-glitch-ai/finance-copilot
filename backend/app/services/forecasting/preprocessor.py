import pandas as pd


def prepare_daily_expense_data(
    df: pd.DataFrame
) -> pd.DataFrame:

    if df.empty:
        return pd.DataFrame()

    print("=" * 60)
    print("RAW DATA")
    print(df.head())
    print("=" * 60)

    # Normalize values
    df["transaction_type"] = (
        df["transaction_type"]
        .astype(str)
        .str.strip()
        .str.lower()
    )

    print("Unique transaction types:")
    print(df["transaction_type"].unique())

    expense_df = df[
        df["transaction_type"].isin(
            [
                "expense",
                "debit"
            ]
        )
    ].copy()

    print("Expense rows:", len(expense_df))

    if expense_df.empty:
        return pd.DataFrame()

    expense_df["date"] = pd.to_datetime(
        expense_df["date"]
    )

    daily_expense = (
        expense_df
        .groupby("date", as_index=False)["amount"]
        .sum()
    )

    daily_expense.rename(
        columns={
            "date": "ds",
            "amount": "y"
        },
        inplace=True
    )

    daily_expense.sort_values(
        "ds",
        inplace=True
    )

    daily_expense.reset_index(
        drop=True,
        inplace=True
    )

    print("=" * 60)
    print("PROPHET DATA")
    print(daily_expense.head())
    print("Rows:", len(daily_expense))
    print("=" * 60)

    return daily_expense