"""Financial forecasting module for predicting user spending patterns.

This module provides functionality to analyze past spending patterns and generate
forecasts for future spending across different categories using time series analysis.
"""

import sqlite3
from datetime import datetime, timedelta
import warnings

import pandas as pd
from statsmodels.tsa.arima.model import ARIMA

warnings.filterwarnings('ignore')


class SpendingForecaster:
    """Forecasts user spending patterns based on historical transaction data.

    This class provides methods to retrieve historical spending data from a database,
    analyze patterns, and generate forecasts using ARIMA time series modeling.
    """

    def __init__(self, db_path):
        """Initialize the forecaster with a database path.

        Args:
            db_path: Path to the SQLite database containing transaction data
        """
        self.db_path = db_path

    def get_user_spending_history(self, user_id: int) -> pd.DataFrame:
        """Get monthly spending history by category for a user.

        Args:
            user_id: The ID of the user to retrieve spending history for

        Returns:
            DataFrame with months as index and categories as columns
        """
        with sqlite3.connect(self.db_path) as conn:
            query = """
            SELECT
                strftime('%Y-%m', transaction_date) as month,
                c.name as category,
                SUM(amount) as total_amount
            FROM transactions t
            JOIN categories c ON t.category_id = c.category_id
            WHERE t.user_id = ?
            GROUP BY month, c.name
            ORDER BY month, c.name
            """
            spending_history = pd.read_sql(query, conn, params=(user_id,))

        # Pivot to get categories as columns
        if not spending_history.empty:
            spending_pivot = spending_history.pivot(
                index='month',
                columns='category',
                values='total_amount'
            ).fillna(0)
            return spending_pivot

        return pd.DataFrame()

    def forecast_spending(self, user_id, forecast_months=3):
        """Forecast future spending by category.

        Args:
            user_id: The ID of the user to forecast spending for
            forecast_months: Number of months to forecast into the future

        Returns:
            DataFrame with forecasted spending by category
        """
        spending_history = self.get_user_spending_history(user_id)

        if spending_history.empty or len(spending_history) < 3:
            return self._generate_simple_forecast(user_id, forecast_months)

        forecasts = {}

        # Forecast each category
        for category in spending_history.columns:
            category_data = spending_history[category]

            try:
                # Simple ARIMA model for forecasting
                model = ARIMA(category_data, order=(1, 0, 0))
                model_fit = model.fit()

                # Generate forecast
                forecast = model_fit.forecast(steps=forecast_months)
                forecasts[category] = forecast.tolist()
            except (ValueError, TypeError, RuntimeError):
                # Fallback to simple average if ARIMA fails
                avg_spending = category_data.mean()
                forecasts[category] = [avg_spending] * forecast_months

        # Create forecast dataframe
        last_month = pd.to_datetime(spending_history.index[-1])
        forecast_months_idx = [
            (last_month + pd.DateOffset(months=i+1)).strftime('%Y-%m')
            for i in range(forecast_months)
        ]

        forecast_df = pd.DataFrame(index=forecast_months_idx, columns=spending_history.columns)

        for category in spending_history.columns:
            forecast_df[category] = forecasts[category]

        return forecast_df

    def _generate_simple_forecast(self, user_id, forecast_months):
        """Generate a simple forecast when not enough history is available.

        Args:
            user_id: The ID of the user to forecast spending for
            forecast_months: Number of months to forecast into the future

        Returns:
            DataFrame with estimated spending by category
        """
        conn = sqlite3.connect(self.db_path)

        # Get user's income
        user_query = "SELECT income FROM users WHERE user_id = ?"
        user_df = pd.read_sql(user_query, conn, params=(user_id,))

        if user_df.empty:
            conn.close()
            return pd.DataFrame()

        income = user_df['income'].iloc[0]

        # Get all categories
        categories = pd.read_sql("SELECT name FROM categories", conn)
        conn.close()

        # Default spending distribution
        category_weights = {
            "Housing": 0.3,
            "Food": 0.15,
            "Transportation": 0.1,
            "Utilities": 0.05,
            "Entertainment": 0.1,
            "Healthcare": 0.05,
            "Miscellaneous": 0.2
        }

        # Calculate average spending per category
        avg_spending = income * 0.5  # Assume 50% of income is spent
        category_spending = {cat: avg_spending * weight for cat, weight in category_weights.items()}

        # Create forecast dataframe
        forecast_months_idx = [
            (datetime.now() + timedelta(days=30*i)).strftime('%Y-%m')
            for i in range(1, forecast_months+1)
        ]

        forecast_df = pd.DataFrame(index=forecast_months_idx, columns=categories['name'])

        for category in categories['name']:
            forecast_df[category] = category_spending.get(category, 0)

        return forecast_df
