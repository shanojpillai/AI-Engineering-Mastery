"""Finance Assistant Application

This application provides financial analysis and forecasting tools
to help users manage their finances and plan for the future.
"""

from models.forecaster import SpendingForecaster
from db_init import initialize_database

# Database path
DB_PATH = "finance.db"

def get_user_spending_forecast(user_id, months=3):
    """Get spending forecast for a user."""
    forecaster = SpendingForecaster(DB_PATH)

    # Get spending history
    spending_history = forecaster.get_user_spending_history(user_id)
    if spending_history.empty:
        print(f"No spending history found for user {user_id}")
        return None

    print("\nSpending History:")
    print(spending_history)

    # Generate forecast
    forecast = forecaster.forecast_spending(user_id, forecast_months=months)

    print(f"\nSpending Forecast for the next {months} months:")
    print(forecast)

    return forecast

def main():
    """Main application function."""
    print("Finance Assistant Application")
    print("=============================")

    # Initialize database if it doesn't exist
    initialize_database()

    # Get user spending forecast
    user_id = 1
    get_user_spending_forecast(user_id)

if __name__ == "__main__":
    main()
