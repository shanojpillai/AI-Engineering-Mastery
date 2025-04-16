import os
import sys
import sqlite3
import pandas as pd
import streamlit as st
import plotly.express as px
from datetime import datetime

# Add the parent directory to the path so we can import from models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.forecaster import SpendingForecaster
from models.llm_assistant import OllamaAssistant

# Database path - use absolute path to avoid issues
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(__file__)), "finance.db"))

# Check if database exists, if not initialize it
if not os.path.exists(DB_PATH):
    print("Database not found. Initializing database...")
    # Import the initialize_database function from db_init
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from db_init import initialize_database
    initialize_database()

# Page configuration
st.set_page_config(
    page_title="Finance Assistant",
    page_icon="💰",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Add custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        text-align: center;
        margin-bottom: 1rem;
        color: #1E88E5;
    }
    .sub-header {
        font-size: 1.8rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
        color: #1976D2;
    }
    .metric-label {
        font-size: 1rem;
        font-weight: bold;
        margin-bottom: 0.2rem;
        color: #424242;
    }
    .metric-value {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
        color: #1E88E5;
    }
    .card {
        background-color: #f8f9fa;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 1rem;
        box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
        border-left: 4px solid #1E88E5;
    }
    /* Chat styling */
    .chat-container {
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        max-height: 600px;
        overflow-y: auto;
        padding: 1rem;
        background-color: #f8f9fa;
        border: 1px solid #e0e0e0;
    }
    .chat-message-user {
        background-color: #E3F2FD;
        border-radius: 1rem 1rem 0.2rem 1rem;
        padding: 0.8rem 1.2rem;
        margin: 0.5rem 0;
        max-width: 80%;
        align-self: flex-end;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        position: relative;
        margin-left: auto;
    }
    .chat-message-assistant {
        background-color: #FFFFFF;
        border-radius: 1rem 1rem 1rem 0.2rem;
        padding: 0.8rem 1.2rem;
        margin: 0.5rem 0;
        max-width: 80%;
        align-self: flex-start;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        border-left: 3px solid #1E88E5;
    }
    .chat-input {
        border-radius: 2rem;
        padding: 0.5rem 1rem;
        border: 1px solid #e0e0e0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .welcome-note {
        background-color: #E8F5E9;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 1.5rem;
        border-left: 4px solid #43A047;
    }
    .stButton>button {
        border-radius: 2rem;
        padding: 0.25rem 1rem;
        background-color: #1E88E5;
        color: white;
        border: none;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        transition: all 0.2s ease;
    }
    .stButton>button:hover {
        background-color: #1976D2;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    }
    /* Improve tab styling */
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
    }
    .stTabs [data-baseweb="tab"] {
        height: 50px;
        white-space: pre-wrap;
        background-color: #f0f2f6;
        border-radius: 4px 4px 0 0;
        gap: 1px;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .stTabs [aria-selected="true"] {
        background-color: #1E88E5 !important;
        color: white !important;
    }
</style>
""", unsafe_allow_html=True)

# Database functions
def get_users():
    """Get all users from the database."""
    try:
        conn = sqlite3.connect(DB_PATH)
        users = pd.read_sql_query("SELECT * FROM users", conn)
        conn.close()
        return users
    except (sqlite3.OperationalError, pd.errors.DatabaseError) as e:
        st.error(f"Error accessing users table: {str(e)}")
        st.info("Please make sure the database is properly initialized. You can run 'python app.py' to initialize the database.")
        # Return an empty DataFrame with the expected columns
        return pd.DataFrame(columns=['user_id', 'name', 'income'])

def get_categories():
    """Get all categories from the database."""
    try:
        conn = sqlite3.connect(DB_PATH)
        categories = pd.read_sql_query("SELECT * FROM categories", conn)
        conn.close()
        return categories
    except (sqlite3.OperationalError, pd.errors.DatabaseError):
        # Return an empty DataFrame with the expected columns
        return pd.DataFrame(columns=['category_id', 'name'])

def get_transactions(user_id):
    """Get all transactions for a user from the database."""
    try:
        conn = sqlite3.connect(DB_PATH)
        query = """
        SELECT t.transaction_id, t.amount, t.transaction_date, c.name as category, t.category_id
        FROM transactions t
        JOIN categories c ON t.category_id = c.category_id
        WHERE t.user_id = ?
        ORDER BY t.transaction_date DESC
        """
        transactions = pd.read_sql_query(query, conn, params=(user_id,))
        conn.close()

        # Convert transaction_date to datetime
        transactions['transaction_date'] = pd.to_datetime(transactions['transaction_date'])

        return transactions
    except (sqlite3.OperationalError, pd.errors.DatabaseError):
        # Return an empty DataFrame with the expected columns
        return pd.DataFrame(columns=['transaction_id', 'amount', 'transaction_date', 'category', 'category_id'])

def add_transaction(user_id, amount, category_id, transaction_date):
    """Add a transaction to the database."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO transactions (user_id, amount, category_id, transaction_date) VALUES (?, ?, ?, ?)",
            (user_id, amount, category_id, transaction_date)
        )
        conn.commit()
        conn.close()
        return True
    except sqlite3.Error:
        return False

def process_csv_upload(uploaded_file, user_id, date_format, amount_col, date_col, category_col, category_mapping):
    """Process an uploaded CSV file and add transactions to the database."""
    try:
        # Display the selected columns for debugging
        st.info(f"Selected columns - Date: '{date_col}', Amount: '{amount_col}', Category: '{category_col}'")

        # Read the CSV file - try different separators
        try:
            df = pd.read_csv(uploaded_file)
        except Exception as e:
            # Try with semicolon separator (European format)
            uploaded_file.seek(0)  # Reset file pointer
            try:
                df = pd.read_csv(uploaded_file, sep=';')
            except Exception as e2:
                st.error(f"Error reading CSV with both comma and semicolon separators: {str(e)} / {str(e2)}")
                return 0, 0, 0

        # Display the first few rows for debugging
        st.write("Preview of the data being processed:")
        st.dataframe(df.head())

        # Verify that the selected columns exist in the dataframe
        missing_cols = []
        if date_col not in df.columns:
            missing_cols.append(f"Date column '{date_col}'")
        if amount_col not in df.columns:
            missing_cols.append(f"Amount column '{amount_col}'")
        if category_col and category_col not in df.columns and category_col != 'None':
            missing_cols.append(f"Category column '{category_col}'")

        if missing_cols:
            st.error(f"The following selected columns were not found in the CSV: {', '.join(missing_cols)}")
            st.write("Available columns:", df.columns.tolist())
            return 0, 0, 0

        # Get categories from database
        categories = get_categories()
        category_dict = dict(zip(categories['name'], categories['category_id']))

        # Initialize counters
        success_count = 0
        error_count = 0
        total_count = len(df)

        # Process each row
        for index, row in df.iterrows():
            try:
                # Get the amount value
                if amount_col == 'Debit' and 'Credit' in df.columns:
                    # Handle bank statement format with Debit/Credit columns
                    debit_val = row['Debit'] if not pd.isna(row['Debit']) else 0
                    credit_val = row['Credit'] if not pd.isna(row['Credit']) else 0

                    # For expenses, we want positive values in our system
                    if debit_val > 0:
                        amount = debit_val  # It's already positive in our sample
                    else:
                        amount = credit_val
                else:
                    # Standard amount column - make sure we're getting a number
                    amount_val = row[amount_col]

                    # Check if the amount is already a number
                    if isinstance(amount_val, (int, float)):
                        amount = float(amount_val)
                    else:
                        # Convert string to float
                        amount_str = str(amount_val)
                        # Remove currency symbols and commas, replace European decimal comma with point
                        amount_str = amount_str.replace('$', '').replace('€', '').replace('£', '')
                        amount_str = amount_str.replace(',', '.')
                        # Remove any other non-numeric characters except decimal point
                        amount_str = ''.join(c for c in amount_str if c.isdigit() or c == '.')
                        amount = float(amount_str)

                # Get the date value
                date_val = row[date_col]

                # Parse date - convert to string first to handle any type
                date_str = str(date_val)
                try:
                    if date_format and date_format.strip():
                        # Use specified format
                        transaction_date = pd.to_datetime(date_str, format=date_format).strftime('%Y-%m-%d')
                    else:
                        # Try automatic parsing
                        transaction_date = pd.to_datetime(date_str).strftime('%Y-%m-%d')
                except Exception as date_error:
                    # Try a few common formats
                    for fmt in ['%m/%d/%Y', '%d/%m/%Y', '%Y-%m-%d', '%Y/%m/%d']:
                        try:
                            transaction_date = pd.to_datetime(date_str, format=fmt).strftime('%Y-%m-%d')
                            break
                        except:
                            continue
                    else:
                        # If all formats fail, show error and skip this row
                        st.error(f"Error parsing date '{date_str}' in row {index+1}: {str(date_error)}")
                        error_count += 1
                        continue

                # Get the category
                if category_col and category_col != 'None' and not pd.isna(row[category_col]):
                    category_val = row[category_col]
                    if category_val in category_mapping:
                        category_name = category_mapping[category_val]
                        category_id = category_dict.get(category_name)
                    else:
                        # Category not in mapping, use default
                        category_id = category_dict.get('Miscellaneous', 7)
                else:
                    # No category column or value, use default
                    category_id = category_dict.get('Miscellaneous', 7)

                # Add transaction to database
                if add_transaction(user_id, amount, category_id, transaction_date):
                    success_count += 1
                else:
                    st.error(f"Failed to add transaction to database: Row {index+1}")
                    error_count += 1

            except Exception as e:
                st.error(f"Error processing row {index+1}: {str(e)}")
                # Show the problematic row for debugging
                st.write(f"Problematic row data: {row.to_dict()}")
                error_count += 1

        return success_count, error_count, total_count

    except Exception as e:
        st.error(f"Error processing CSV file: {str(e)}")
        import traceback
        st.error(f"Traceback: {traceback.format_exc()}")
        return 0, 0, 0

def plot_spending_history(spending_history):
    """Create a line chart of spending history by month."""
    # Calculate total spending by month
    monthly_total = spending_history.sum(axis=1)

    # Create the plot
    fig = px.line(
        x=monthly_total.index,
        y=monthly_total.values,
        title='Monthly Spending History',
        labels={'x': 'Month', 'y': 'Amount ($)'},
        markers=True
    )

    # Customize the layout
    fig.update_layout(
        xaxis_title='Month',
        yaxis_title='Amount ($)',
        height=400
    )

    return fig

def plot_spending_distribution(spending_history):
    """Create a pie chart of spending distribution by category."""
    # Calculate total spending by category
    total_by_category = spending_history.sum()

    # Create the plot
    fig = px.pie(
        names=total_by_category.index,
        values=total_by_category.values,
        title='Spending Distribution by Category',
        height=400
    )

    # Customize the layout
    fig.update_traces(
        textposition='inside',
        textinfo='percent+label',
        hoverinfo='label+percent+value',
        marker=dict(line=dict(color='#FFFFFF', width=2))
    )

    return fig

def plot_forecast(forecast):
    """Create a line chart of spending forecast by month."""
    # Calculate total spending by month
    monthly_total = forecast.sum(axis=1)

    # Create the plot
    fig = px.line(
        x=monthly_total.index,
        y=monthly_total.values,
        title='Spending Forecast',
        labels={'x': 'Month', 'y': 'Amount ($)'},
        markers=True
    )

    # Customize the layout
    fig.update_layout(
        xaxis_title='Month',
        yaxis_title='Amount ($)',
        height=400
    )

    # Add a vertical line to separate history from forecast
    forecast_start_date = monthly_total.index[0]

    # Add a vertical line as a shape
    fig.update_layout(
        shapes=[
            dict(
                type="line",
                xref="x",
                yref="paper",
                x0=forecast_start_date,
                y0=0,
                x1=forecast_start_date,
                y1=1,
                line=dict(
                    color="gray",
                    width=2,
                    dash="dash",
                ),
            )
        ],
        annotations=[
            dict(
                x=forecast_start_date,
                y=1.05,
                xref="x",
                yref="paper",
                text="Forecast Start",
                showarrow=False,
                font=dict(color="gray")
            )
        ]
    )

    return fig

def get_chatbot_response(user_id, question, spending_history, forecast, transactions, user_info):
    """Generate a response to a user's question about their finances."""
    # Convert question to lowercase for easier matching
    question_lower = question.lower()

    # Check if data is available
    has_history = not spending_history.empty
    has_transactions = not transactions.empty
    has_forecast = not forecast.empty

    # Greeting responses
    if any(keyword in question_lower for keyword in ['hello', 'hi', 'hey', 'greetings']):
        return f"Hello {user_info['name']}! How can I help you with your finances today?"

    # Income-related responses
    elif any(keyword in question_lower for keyword in ['income', 'earn', 'salary', 'make']):
        monthly_income = user_info['income']
        annual_income = monthly_income * 12
        return f"Your monthly income is ${monthly_income:,.2f}, which amounts to ${annual_income:,.2f} annually."

    # Spending-related responses
    elif any(keyword in question_lower for keyword in ['spend', 'spending', 'expenses']):
        if has_history:
            # Calculate monthly averages
            avg_monthly_spending = spending_history.sum(axis=1).mean()
            monthly_income = user_info['income']
            spending_percent = (avg_monthly_spending / monthly_income) * 100

            # Calculate category breakdown
            category_totals = spending_history.sum()
            top_categories = category_totals.nlargest(3)
            category_breakdown = ", ".join([f"{cat}: ${amount:.2f} ({amount/avg_monthly_spending*100:.1f}%)"
                                         for cat, amount in top_categories.items()])

            # Get spending trend
            if len(spending_history) >= 3:
                recent_months = spending_history.sum(axis=1).tail(3).values
                if recent_months[-1] > recent_months[-2] > recent_months[-3]:
                    trend = "increasing"
                elif recent_months[-1] < recent_months[-2] < recent_months[-3]:
                    trend = "decreasing"
                else:
                    trend = "fluctuating"
                trend_text = f"Your spending has been {trend} over the past three months."
            else:
                trend_text = ""

            return (f"Your average monthly spending is ${avg_monthly_spending:,.2f}, which is {spending_percent:.1f}% of your income. "
                   f"Your top spending categories are {category_breakdown}. {trend_text}")
        else:
            return "I don't have enough spending history to analyze your expenses. Please upload some transaction data."

    # Savings-related responses
    elif any(keyword in question_lower for keyword in ['save', 'saving', 'savings']):
        if has_history:
            # Calculate savings
            avg_monthly_spending = spending_history.sum(axis=1).mean()
            monthly_income = user_info['income']
            savings = monthly_income - avg_monthly_spending
            savings_percent = (savings / monthly_income) * 100
            annual_savings = savings * 12

            # Provide savings advice
            if savings_percent < 10:
                advice = "Financial experts typically recommend saving at least 20% of your income. Consider reviewing your expenses to increase your savings rate."
            elif savings_percent < 20:
                advice = "You're on the right track with your savings. The general recommendation is to save 20% of your income."
            else:
                advice = "Great job! You're saving more than 20% of your income, which is the general recommendation by financial experts."

            return (f"Based on your income and spending, you save approximately ${savings:,.2f} per month (${annual_savings:,.2f} annually), "
                   f"which is {savings_percent:.1f}% of your income. {advice}")
        else:
            return "I don't have enough spending history to calculate your savings. Please upload some transaction data."

    # Budget recommendations
    elif any(keyword in question_lower for keyword in ['budget', 'recommend', 'suggestion', 'advice']):
        if has_history:
            # Calculate spending by category
            total_by_category = spending_history.sum()
            monthly_income = user_info['income']

            # Find the top spending categories
            top_categories = total_by_category.nlargest(3)
            recommendations = []

            # Generate specific recommendations for each category
            for category, amount in top_categories.items():
                monthly_avg = amount / len(spending_history)
                percent_of_income = (monthly_avg / monthly_income) * 100

                if category == "Housing" and percent_of_income > 30:
                    recommendations.append(f"Your housing expenses (${monthly_avg:.2f}/month, {percent_of_income:.1f}% of income) exceed the recommended 30% of income. Consider if there are ways to reduce these costs.")
                elif category == "Food" and percent_of_income > 15:
                    recommendations.append(f"You spend ${monthly_avg:.2f}/month on food ({percent_of_income:.1f}% of income). Consider meal planning or cooking at home more to reduce costs.")
                elif category == "Transportation" and percent_of_income > 15:
                    recommendations.append(f"Your transportation costs (${monthly_avg:.2f}/month, {percent_of_income:.1f}% of income) are significant. Consider carpooling, public transit, or other alternatives if possible.")
                elif category == "Entertainment" and percent_of_income > 10:
                    recommendations.append(f"You spend ${monthly_avg:.2f}/month on entertainment ({percent_of_income:.1f}% of income). Look for free or low-cost entertainment options to reduce this expense.")
                elif percent_of_income > 10:
                    recommendations.append(f"Your spending on {category} (${monthly_avg:.2f}/month, {percent_of_income:.1f}% of income) is relatively high. Consider if there are ways to reduce this expense.")

            # Calculate overall budget health
            avg_monthly_spending = spending_history.sum(axis=1).mean()
            savings_rate = ((monthly_income - avg_monthly_spending) / monthly_income) * 100

            if savings_rate < 0:
                budget_health = "You're spending more than you earn, which is unsustainable long-term. Focus on reducing expenses or increasing income."
            elif savings_rate < 10:
                budget_health = "Your savings rate is below the recommended 20%. Look for ways to reduce expenses or increase income."
            elif savings_rate < 20:
                budget_health = "Your budget is in decent shape, but aim to save at least 20% of your income for long-term financial health."
            else:
                budget_health = "Your budget is in excellent shape with a healthy savings rate above 20%."

            # Combine all recommendations
            if recommendations:
                recommendation_text = "\n\nHere are some specific recommendations:\n- " + "\n- ".join(recommendations)
            else:
                recommendation_text = "\n\nYour spending appears well-balanced across categories."

            return f"{budget_health}{recommendation_text}"
        else:
            return "I don't have enough spending history to provide budget recommendations. Please upload some transaction data."

    # Forecast-related responses
    elif any(keyword in question_lower for keyword in ['forecast', 'predict', 'future', 'next month']):
        if has_forecast:
            # Get forecast data
            next_month_total = forecast.iloc[0].sum()
            monthly_income = user_info['income']
            expected_savings = monthly_income - next_month_total
            savings_percent = (expected_savings / monthly_income) * 100

            # Get category breakdown for forecast
            top_categories = forecast.iloc[0].nlargest(3)
            category_breakdown = ", ".join([f"{cat}: ${amount:.2f}" for cat, amount in top_categories.items()])

            # Compare to current spending if available
            if has_history:
                current_spending = spending_history.sum(axis=1).mean()
                percent_change = ((next_month_total - current_spending) / current_spending) * 100
                if percent_change > 5:
                    trend = f"This is a {abs(percent_change):.1f}% increase from your current average spending."
                elif percent_change < -5:
                    trend = f"This is a {abs(percent_change):.1f}% decrease from your current average spending."
                else:
                    trend = "This is similar to your current average spending."
            else:
                trend = ""

            return (f"Based on your spending history, I forecast that you'll spend approximately ${next_month_total:,.2f} next month. "
                   f"Your highest expected expenses are {category_breakdown}. {trend} "
                   f"With your income of ${monthly_income:,.2f}, you should be able to save about ${expected_savings:,.2f} ({savings_percent:.1f}% of income).")
        else:
            return "I don't have enough data to make a forecast. Please upload more transaction data."

    # Transaction-related responses
    elif any(keyword in question_lower for keyword in ['transaction', 'recent', 'last purchase', 'recent purchases']):
        if has_transactions:
            # Get recent transactions
            num_transactions = 3
            recent_transactions = transactions.head(min(num_transactions, len(transactions)))

            # Format transaction details
            transaction_details = []
            for _, tx in recent_transactions.iterrows():
                transaction_details.append(f"${tx['amount']:.2f} for {tx['category']} on {tx['transaction_date'].strftime('%Y-%m-%d')}")

            if len(transaction_details) == 1:
                return f"Your most recent transaction was {transaction_details[0]}."
            else:
                transactions_text = "\n- " + "\n- ".join(transaction_details)
                return f"Your {len(transaction_details)} most recent transactions are:{transactions_text}"
        else:
            return "I don't have any transaction data for you. Please upload some transaction data."

    # Category-specific spending
    elif any(category.lower() in question_lower for category in spending_history.columns) and has_history:
        # Find which category was mentioned
        mentioned_categories = [category for category in spending_history.columns if category.lower() in question_lower]

        if mentioned_categories:
            category = mentioned_categories[0]
            monthly_avg = spending_history[category].mean()
            total_spent = spending_history[category].sum()
            percent_of_total = (spending_history[category].sum() / spending_history.sum().sum()) * 100
            percent_of_income = (monthly_avg / user_info['income']) * 100

            # Get trend if enough data
            if len(spending_history) >= 3:
                recent_months = spending_history[category].tail(3).values
                if recent_months[-1] > recent_months[-2] > recent_months[-3]:
                    trend = "increasing"
                elif recent_months[-1] < recent_months[-2] < recent_months[-3]:
                    trend = "decreasing"
                else:
                    trend = "fluctuating"
                trend_text = f"Your spending in this category has been {trend} over the past three months."
            else:
                trend_text = ""

            return (f"For {category}, you spend an average of ${monthly_avg:.2f} per month, which is {percent_of_income:.1f}% of your income "
                   f"and {percent_of_total:.1f}% of your total expenses. You've spent a total of ${total_spent:.2f} in this category. {trend_text}")

    # Time period analysis
    elif any(period in question_lower for period in ['month', 'year', 'week', 'day']) and has_history:
        if 'month' in question_lower:
            # Monthly analysis already covered in spending questions
            avg_monthly_spending = spending_history.sum(axis=1).mean()
            return f"Your average monthly spending is ${avg_monthly_spending:,.2f}."
        elif 'year' in question_lower or 'annual' in question_lower:
            avg_monthly_spending = spending_history.sum(axis=1).mean()
            annual_spending = avg_monthly_spending * 12
            annual_income = user_info['income'] * 12
            savings = annual_income - annual_spending
            return f"Based on your monthly averages, your annual spending is approximately ${annual_spending:,.2f}. With an annual income of ${annual_income:,.2f}, you save about ${savings:,.2f} per year."
        elif 'week' in question_lower:
            avg_monthly_spending = spending_history.sum(axis=1).mean()
            weekly_spending = avg_monthly_spending / 4.33  # Average weeks in a month
            return f"Your average weekly spending is approximately ${weekly_spending:,.2f}."
        elif 'day' in question_lower:
            avg_monthly_spending = spending_history.sum(axis=1).mean()
            daily_spending = avg_monthly_spending / 30  # Average days in a month
            return f"Your average daily spending is approximately ${daily_spending:,.2f}."

    # Help/features response
    elif any(keyword in question_lower for keyword in ['help', 'can you do', 'what can you do', 'features']):
        return ("I can help you with:\n"
                "- Analyzing your income and spending patterns\n"
                "- Calculating your savings rate and providing savings advice\n"
                "- Offering personalized budget recommendations\n"
                "- Forecasting future spending based on your history\n"
                "- Tracking your recent transactions\n"
                "- Breaking down spending by category\n"
                "- Analyzing spending over different time periods (daily, weekly, monthly, yearly)\n\n"
                "Just ask me a question about any of these topics!")

    # Fallback response
    else:
        return ("I'm not sure how to answer that specific question. You can ask me about:\n"
                "- Your income and spending patterns\n"
                "- Savings analysis and advice\n"
                "- Budget recommendations\n"
                "- Spending forecasts\n"
                "- Recent transactions\n"
                "- Specific spending categories (e.g., 'How much do I spend on food?')\n"
                "- Spending over different time periods (daily, weekly, monthly, yearly)")

def main():
    """Main function to run the Streamlit application."""
    # Header
    st.markdown('<h1 class="main-header">Finance Assistant</h1>', unsafe_allow_html=True)
    st.markdown('<p style="text-align: center;">Track your spending and plan for the future</p>', unsafe_allow_html=True)

    # Sidebar
    st.sidebar.title("Settings")

    # Get users
    users = get_users()

    # Check if there are any users
    if users.empty:
        st.warning("No users found in the database.")
        st.info("Please run 'python app.py' to initialize the database with sample data.")
        return

    # User selection
    selected_user_id = st.sidebar.selectbox(
        "Select User",
        options=users['user_id'].tolist(),
        format_func=lambda x: users[users['user_id'] == x]['name'].iloc[0]
    )

    # Get user details
    user_info = users[users['user_id'] == selected_user_id].iloc[0]

    # Forecast settings
    forecast_months = st.sidebar.slider(
        "Forecast Months",
        min_value=1,
        max_value=12,
        value=3,
        step=1
    )

    # LLM Assistant settings
    st.sidebar.title("AI Assistant Settings")

    # Initialize Ollama assistant
    ollama_assistant = OllamaAssistant()

    # Check if Ollama is available
    ollama_available = ollama_assistant.check_ollama_availability()

    if ollama_available:
        st.sidebar.success("✅ Ollama LLM is available")

        # Get available models
        available_models = ollama_assistant.get_available_models()

        if available_models:
            # Model selection
            selected_model = st.sidebar.selectbox(
                "Select LLM Model",
                options=available_models,
                index=0
            )

            # Update the model in the assistant
            ollama_assistant.model_name = selected_model

            # Temperature setting
            temperature = st.sidebar.slider(
                "Temperature",
                min_value=0.1,
                max_value=1.0,
                value=0.7,
                step=0.1,
                help="Higher values make the output more random, lower values make it more deterministic"
            )
        else:
            st.sidebar.warning("No models available. Please pull a model using Ollama CLI.")
            selected_model = None
            temperature = 0.7
    else:
        st.sidebar.error("❌ Ollama LLM is not available. Make sure it's running at http://localhost:11434")
        selected_model = None
        temperature = 0.7

    # Create forecaster instance
    forecaster = SpendingForecaster(DB_PATH)

    # Get spending history
    spending_history = forecaster.get_user_spending_history(selected_user_id)

    # Generate forecast
    forecast = forecaster.forecast_spending(selected_user_id, forecast_months=forecast_months)

    # Get transactions
    transactions = get_transactions(selected_user_id)

    # Create tabs
    tabs = st.tabs(["Spending History", "Forecast", "Transactions", "Upload Data", "Chat Assistant"])

    # Spending History Tab
    with tabs[0]:
        if not spending_history.empty:
            # Display spending history table
            st.subheader("Monthly Spending by Category")
            st.dataframe(spending_history.style.format("${:.2f}"), use_container_width=True)

            # Plot spending history
            st.plotly_chart(plot_spending_history(spending_history), use_container_width=True)

            # Plot spending distribution
            st.plotly_chart(plot_spending_distribution(spending_history), use_container_width=True)
        else:
            st.info("No spending history available for this user.")

    # Forecast Tab
    with tabs[1]:
        if not forecast.empty:
            # Display forecast table
            st.subheader(f"Spending Forecast for the Next {forecast_months} Months")
            st.dataframe(forecast.style.format("${:.2f}"), use_container_width=True)

            # Plot forecast
            st.plotly_chart(plot_forecast(forecast), use_container_width=True)

            # Calculate and display savings potential
            if not spending_history.empty:
                income = user_info["income"]
                forecast_avg_spending = forecast.sum(axis=1).mean()
                savings_potential = income - forecast_avg_spending
                savings_percent = (savings_potential / income) * 100

                st.subheader("Savings Potential")
                col1, col2 = st.columns(2)

                with col1:
                    st.markdown('<div class="card">', unsafe_allow_html=True)
                    st.markdown('<p class="metric-label">Monthly Savings Potential</p>', unsafe_allow_html=True)
                    st.markdown(f'<p class="metric-value">${savings_potential:,.2f}</p>', unsafe_allow_html=True)
                    st.markdown('</div>', unsafe_allow_html=True)

                with col2:
                    st.markdown('<div class="card">', unsafe_allow_html=True)
                    st.markdown('<p class="metric-label">Savings Rate</p>', unsafe_allow_html=True)
                    st.markdown(f'<p class="metric-value">{savings_percent:.1f}%</p>', unsafe_allow_html=True)
                    st.markdown('</div>', unsafe_allow_html=True)
        else:
            st.info("Unable to generate forecast for this user.")

    # Transactions Tab
    with tabs[2]:
        if not transactions.empty:
            # Display transactions
            st.subheader("Recent Transactions")

            # Format the dataframe
            transactions_display = transactions.copy()
            transactions_display['transaction_date'] = transactions_display['transaction_date'].dt.strftime('%Y-%m-%d')
            transactions_display['amount'] = transactions_display['amount'].apply(lambda x: f"${x:,.2f}")

            st.dataframe(
                transactions_display[['transaction_date', 'category', 'amount']],
                use_container_width=True,
                column_config={
                    "transaction_date": "Date",
                    "category": "Category",
                    "amount": "Amount"
                }
            )
        else:
            st.info("No transactions available for this user.")

    # Upload Data Tab
    with tabs[3]:
        st.subheader("Upload Bank Statement or Transaction Data")
        st.write("Upload a CSV file containing your transaction data to import it into the Finance Assistant.")

        # File uploader
        uploaded_file = st.file_uploader("Choose a CSV file", type="csv")

        if uploaded_file is not None:
            # Preview the CSV file
            try:
                df_preview = pd.read_csv(uploaded_file)
                st.write("Preview of the uploaded file:")
                st.dataframe(df_preview.head(), use_container_width=True)

                # Reset the file pointer to the beginning
                uploaded_file.seek(0)

                # CSV mapping form
                st.subheader("Map CSV Columns to Transaction Data")

                # Get column names from the CSV
                column_names = list(df_preview.columns)

                # Column mapping
                col1, col2 = st.columns(2)

                with col1:
                    date_col = st.selectbox("Date Column", options=column_names)
                    date_format = st.text_input("Date Format (leave empty for auto-detection)",
                                               placeholder="%Y-%m-%d or %m/%d/%Y")

                    amount_col = st.selectbox("Amount Column", options=column_names)

                with col2:
                    category_col = st.selectbox("Category Column (optional)",
                                              options=["None"] + column_names)

                    if category_col == "None":
                        category_col = None

                # Get categories from database for mapping
                categories = get_categories()
                category_names = categories['name'].tolist()

                # Show category mapping if a category column is selected
                if category_col:
                    st.subheader("Category Mapping")
                    st.write("Map categories from your CSV to the categories in the Finance Assistant.")

                    # Get unique categories from the CSV
                    unique_categories = df_preview[category_col].dropna().unique().tolist()

                    # Create a mapping form
                    category_mapping = {}
                    for csv_category in unique_categories:
                        mapped_category = st.selectbox(
                            f"Map '{csv_category}' to:",
                            options=category_names,
                            key=f"map_{csv_category}"
                        )
                        category_mapping[csv_category] = mapped_category
                else:
                    category_mapping = {}

                # Process button
                if st.button("Import Transactions"):
                    with st.spinner("Importing transactions..."):
                        success_count, error_count, total_count = process_csv_upload(
                            uploaded_file,
                            selected_user_id,
                            date_format,
                            amount_col,
                            date_col,
                            category_col,
                            category_mapping
                        )

                        if success_count > 0:
                            st.success(f"Successfully imported {success_count} of {total_count} transactions.")
                            if error_count > 0:
                                st.warning(f"Failed to import {error_count} transactions. Check the errors above.")

                            # Provide a button to refresh the page
                            st.button("Refresh Data", on_click=lambda: None)
                        elif total_count > 0:
                            st.error(f"Failed to import any of the {total_count} transactions. Check the errors above.")
                        else:
                            st.error("No transactions were found in the CSV file.")

            except Exception as e:
                st.error(f"Error reading CSV file: {str(e)}")
        else:
            # Show sample CSV format
            st.subheader("Sample CSV Format")
            st.write("Your CSV file should contain at least the following columns:")

            sample_data = {
                "Date": ["2023-01-15", "2023-01-20", "2023-01-25"],
                "Amount": ["$120.50", "$45.00", "$250.00"],
                "Category": ["Groceries", "Entertainment", "Housing"],
                "Description": ["Supermarket", "Movie tickets", "Rent payment"]
            }

            st.dataframe(pd.DataFrame(sample_data), use_container_width=True)

            # Provide a download link for a sample CSV file
            sample_csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sample_data", "sample_transactions.csv")
            if os.path.exists(sample_csv_path):
                with open(sample_csv_path, "r", encoding="utf-8") as f:
                    sample_csv_content = f.read()

                st.download_button(
                    label="Download Sample CSV",
                    data=sample_csv_content,
                    file_name="sample_transactions.csv",
                    mime="text/csv"
                )

            # Sample CSV files
            st.subheader("Sample CSV Files")
            st.write("You can download these sample CSV files to test the upload feature:")

            sample_files = {
                "sample_data/simple_transactions.csv": "Basic format with date, amount, and category",
                "sample_data/bank_statement_sample.csv": "Bank statement format with debit/credit columns",
                "sample_data/credit_card_statement.csv": "Credit card statement with detailed categories",
                "sample_data/european_format.csv": "European format with semicolons and comma decimals",
                "sample_data/very_simple.csv": "Minimal example for testing"
            }

            for file_name, description in sample_files.items():
                file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), file_name)
                if os.path.exists(file_path):
                    with open(file_path, "r", encoding="utf-8") as f:
                        file_content = f.read()

                    st.download_button(
                        label=f"Download {os.path.basename(file_name)}",
                        data=file_content,
                        file_name=os.path.basename(file_name),
                        mime="text/csv",
                        key=f"download_{file_name}"
                    )
                    st.write(description)

    # Chat Assistant Tab
    with tabs[4]:
        st.subheader("Chat with Finance Assistant")
        st.write("Ask me anything about your finances and I'll try to help you.")

        # Add a welcome note with examples of what the chatbot can do
        welcome_note = """
        💬 **Welcome to your Finance Assistant!**

        I can help you with:
        - Your income and spending patterns
        - Savings analysis and advice
        - Budget recommendations
        - Spending forecasts
        - Recent transactions
        - Specific spending categories (e.g., 'How much do I spend on food?')
        - Spending over different time periods (daily, weekly, monthly, yearly)

        **Try asking me questions like:**
        - "What's my monthly income?"
        - "How much do I spend each month?"
        - "What's my savings rate?"
        - "Give me budget recommendations"
        - "What's my forecast for next month?"
        - "Show me my recent transactions"
        - "How much do I spend on groceries?"
        - "What's my annual spending?"
        """
        st.markdown(f'<div class="welcome-note">{welcome_note}</div>', unsafe_allow_html=True)

        # Create columns for chat interface layout
        chat_col1, chat_col2 = st.columns([5, 1])

        # Initialize chat history in session state if it doesn't exist
        if 'chat_history' not in st.session_state:
            st.session_state.chat_history = []
            # Add a welcome message from the assistant
            st.session_state.chat_history.append({"is_user": False, "text": "Hi there! I'm your Finance Assistant. How can I help you today?"})

        # Create a container for the chat messages with custom styling
        with chat_col1:
            chat_container = st.container()
            with chat_container:
                st.markdown('<div class="chat-container">', unsafe_allow_html=True)

                # Display chat history with custom styling
                for message in st.session_state.chat_history:
                    if message['is_user']:
                        st.markdown(f'<div class="chat-message-user">{message["text"]}</div>', unsafe_allow_html=True)
                    else:
                        st.markdown(f'<div class="chat-message-assistant">{message["text"]}</div>', unsafe_allow_html=True)

                st.markdown('</div>', unsafe_allow_html=True)

        # Add buttons in the second column
        with chat_col2:
            # Add a button to clear chat history
            if st.session_state.chat_history and st.button("Clear Chat"):
                # Keep only the welcome message
                st.session_state.chat_history = [st.session_state.chat_history[0]]
                st.rerun()

            # Add some example quick questions as buttons
            st.markdown("### Quick Questions")
            if st.button("My Income"):
                user_question = "What's my monthly income?"
                st.session_state.quick_question = user_question
                st.rerun()

            if st.button("My Spending"):
                user_question = "How much do I spend each month?"
                st.session_state.quick_question = user_question
                st.rerun()

            if st.button("Budget Tips"):
                user_question = "Give me budget recommendations"
                st.session_state.quick_question = user_question
                st.rerun()

            if st.button("Forecast"):
                user_question = "What's my forecast for next month?"
                st.session_state.quick_question = user_question
                st.rerun()

        # Chat input at the bottom
        user_question = st.chat_input("Ask a question about your finances...", key="chat_input")

        # Handle quick question buttons
        if 'quick_question' in st.session_state:
            user_question = st.session_state.quick_question
            del st.session_state.quick_question

        if user_question:
            # Add user message to chat history
            st.session_state.chat_history.append({"is_user": True, "text": user_question})

            # Generate response
            with st.spinner("Thinking..."):
                # Prepare financial data for the LLM
                financial_data = {
                    "user_info": dict(user_info),
                    "spending_history": spending_history,
                    "forecast": forecast,
                    "transactions": transactions
                }

                # Use Ollama LLM if available, otherwise fall back to rule-based responses
                if ollama_available and selected_model:
                    response = ollama_assistant.generate_response(
                        user_question,
                        financial_data,
                        temperature=temperature
                    )
                else:
                    # Fall back to rule-based responses if Ollama is not available
                    response = get_chatbot_response(
                        selected_user_id,
                        user_question,
                        spending_history,
                        forecast,
                        transactions,
                        user_info
                    )

            # Add assistant response to chat history
            st.session_state.chat_history.append({"is_user": False, "text": response})

            # Rerun to update the UI
            st.rerun()

if __name__ == "__main__":
    main()
