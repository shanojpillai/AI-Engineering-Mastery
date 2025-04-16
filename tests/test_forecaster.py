"""Test script for the SpendingForecaster class."""

import os
import sqlite3
import pandas as pd
from datetime import datetime, timedelta

from models.forecaster import SpendingForecaster

# Create a test database
DB_PATH = "test_finance.db"

def setup_test_db():
    """Create a test database with sample data."""
    # Remove existing test database if it exists
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    
    # Create a new database
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
    # Add a user
    cursor.execute("INSERT INTO users (user_id, name, income) VALUES (1, 'Test User', 5000)")
    
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
    
    # Add transactions for the past 6 months
    transactions = []
    today = datetime.now()
    
    # Generate transactions for each month
    for i in range(6):
        month_date = today - timedelta(days=30 * i)
        
        # Housing expense (around 30% of income)
        transactions.append((
            1, 
            1, 
            1500 + (50 * (i % 3)), 
            month_date.strftime('%Y-%m-%d')
        ))
        
        # Food expense (around 15% of income)
        transactions.append((
            1, 
            2, 
            750 + (25 * (i % 4)), 
            month_date.strftime('%Y-%m-%d')
        ))
        
        # Transportation expense (around 10% of income)
        transactions.append((
            1, 
            3, 
            500 + (30 * (i % 2)), 
            month_date.strftime('%Y-%m-%d')
        ))
        
        # Other random expenses
        for category_id in range(4, 8):
            amount = 100 + (category_id * 50) + (10 * (i % 5))
            transactions.append((
                1, 
                category_id, 
                amount, 
                month_date.strftime('%Y-%m-%d')
            ))
    
    cursor.executemany(
        "INSERT INTO transactions (user_id, category_id, amount, transaction_date) VALUES (?, ?, ?, ?)", 
        transactions
    )
    
    # Commit changes and close connection
    conn.commit()
    conn.close()
    
    print(f"Test database created at {DB_PATH}")

def test_forecaster():
    """Test the SpendingForecaster class."""
    # Create a forecaster instance
    forecaster = SpendingForecaster(DB_PATH)
    
    # Test get_user_spending_history
    print("\nTesting get_user_spending_history:")
    spending_history = forecaster.get_user_spending_history(1)
    print(spending_history)
    
    # Test forecast_spending
    print("\nTesting forecast_spending:")
    forecast = forecaster.forecast_spending(1, forecast_months=3)
    print(forecast)
    
    # Test _generate_simple_forecast (by creating a new user with no history)
    print("\nTesting _generate_simple_forecast:")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (user_id, name, income) VALUES (2, 'New User', 4000)")
    conn.commit()
    conn.close()
    
    simple_forecast = forecaster.forecast_spending(2, forecast_months=2)
    print(simple_forecast)

if __name__ == "__main__":
    setup_test_db()
    test_forecaster()
    
    # Clean up
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        print(f"\nTest database {DB_PATH} removed")
