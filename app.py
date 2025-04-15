"""Finance Assistant Application

This application provides financial analysis and forecasting tools
to help users manage their finances and plan for the future.
"""

import os
import sqlite3
from datetime import datetime

from models.forecaster import SpendingForecaster

# Database path
DB_PATH = "finance.db"

def initialize_database():
    """Initialize the database with sample data if it doesn't exist."""
    if os.path.exists(DB_PATH):
        print(f"Database already exists at {DB_PATH}")
        return

    print(f"Creating new database at {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create tables
    cursor.execute('''
    CREATE TABLE users (
        user_id INTEGER PRIMARY KEY,
        name TEXT,
        income REAL
    )
    ''')

    cursor.execute('''
    CREATE TABLE categories (
        category_id INTEGER PRIMARY KEY,
        name TEXT
    )
    ''')

    cursor.execute('''
    CREATE TABLE transactions (
        transaction_id INTEGER PRIMARY KEY,
        user_id INTEGER,
        category_id INTEGER,
        amount REAL,
        transaction_date TEXT,
        FOREIGN KEY (user_id) REFERENCES users (user_id),
        FOREIGN KEY (category_id) REFERENCES categories (category_id)
    )
    ''')

    # Insert sample data
    cursor.execute("INSERT INTO users (user_id, name, income) VALUES (1, 'John Doe', 5000)")

    # Add categories
    categories = [
        (1, "Housing"),
        (2, "Food"),
        (3, "Transportation"),
        (4, "Utilities"),
        (5, "Entertainment"),
        (6, "Healthcare"),
        (7, "Miscellaneous")
    ]
    cursor.executemany("INSERT INTO categories (category_id, name) VALUES (?, ?)", categories)

    # Add sample transactions for the past 6 months
    add_sample_transactions(conn, 1)

    conn.commit()
    conn.close()
    print("Database initialized with sample data")

def add_sample_transactions(conn, user_id):
    """Add sample transactions for a user."""
    cursor = conn.cursor()
    transactions = []
    today = datetime.now()

    # Generate transactions for each month
    for i in range(6):
        # Calculate month date
        new_month = today.month - i if today.month > i else today.month + 12 - i
        month_date = today.replace(day=1, month=new_month)

        # Housing expense (around 30% of income)
        transactions.append((
            user_id,
            1,
            1500 + (50 * (i % 3)),
            month_date.strftime('%Y-%m-%d')
        ))

        # Food expense (around 15% of income)
        transactions.append((
            user_id,
            2,
            750 + (25 * (i % 4)),
            month_date.strftime('%Y-%m-%d')
        ))

        # Transportation expense (around 10% of income)
        transactions.append((
            user_id,
            3,
            500 + (30 * (i % 2)),
            month_date.strftime('%Y-%m-%d')
        ))

        # Other random expenses
        for category_id in range(4, 8):
            amount = 100 + (category_id * 50) + (10 * (i % 5))
            transactions.append((
                user_id,
                category_id,
                amount,
                month_date.strftime('%Y-%m-%d')
            ))

    cursor.executemany(
        """INSERT INTO transactions
        (user_id, category_id, amount, transaction_date)
        VALUES (?, ?, ?, ?)""",
        transactions
    )

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
