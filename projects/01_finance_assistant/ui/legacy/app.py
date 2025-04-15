"""
Finance Assistant Streamlit Application

This Streamlit application provides a user interface for the finance assistant,
allowing users to view their spending history and forecasts.
"""

import os
import sys
import sqlite3
import pandas as pd
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime

# Add the parent directory to the path so we can import from models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.forecaster import SpendingForecaster

# Database path - use absolute path to avoid issues
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(__file__)), "finance.db"))
print(f"Using database at: {DB_PATH}")

# Check if database exists, if not initialize it
if not os.path.exists(DB_PATH):
    print("Database not found. Initializing database...")
    # Import the initialize_database function from db_init
    sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    from db_init import initialize_database
    initialize_database()

# Page configuration
st.set_page_config(
    page_title="Finance Assistant",
    page_icon="💰",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        color: #1E88E5;
        text-align: center;
    }
    .sub-header {
        font-size: 1.5rem;
        color: #424242;
    }
    .card {
        border-radius: 5px;
        padding: 20px;
        background-color: #f9f9f9;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
    }
    .metric-value {
        font-size: 2rem;
        font-weight: bold;
        color: #1E88E5;
    }
    .metric-label {
        font-size: 1rem;
        color: #616161;
    }
</style>
""", unsafe_allow_html=True)

def get_users():
    """Get all users from the database."""
    try:
        with sqlite3.connect(DB_PATH) as conn:
            query = "SELECT user_id, name, income FROM users"
            users = pd.read_sql(query, conn)
        return users
    except (sqlite3.OperationalError, pd.errors.DatabaseError) as e:
        st.error(f"Error accessing users table: {str(e)}")
        st.info("Please make sure the database is properly initialized. You can run 'python app.py' to initialize the database.")
        # Return an empty DataFrame with the expected columns
        return pd.DataFrame(columns=['user_id', 'name', 'income'])

def get_categories():
    """Get all spending categories from the database."""
    try:
        with sqlite3.connect(DB_PATH) as conn:
            query = "SELECT category_id, name FROM categories"
            categories = pd.read_sql(query, conn)
        return categories
    except (sqlite3.OperationalError, pd.errors.DatabaseError):
        # Return an empty DataFrame with the expected columns
        return pd.DataFrame(columns=['category_id', 'name'])

def get_transactions(user_id):
    """Get all transactions for a user."""
    try:
        with sqlite3.connect(DB_PATH) as conn:
            query = """
            SELECT
                t.transaction_id,
                t.amount,
                t.transaction_date,
                c.name as category,
                c.category_id
            FROM transactions t
            JOIN categories c ON t.category_id = c.category_id
            WHERE t.user_id = ?
            ORDER BY t.transaction_date DESC
            """
            transactions = pd.read_sql(query, conn, params=(user_id,))

        # Convert date string to datetime
        if not transactions.empty:
            transactions['transaction_date'] = pd.to_datetime(transactions['transaction_date'])

        return transactions
    except (sqlite3.OperationalError, pd.errors.DatabaseError):
        # Return an empty DataFrame with the expected columns
        return pd.DataFrame(columns=['transaction_id', 'amount', 'transaction_date', 'category', 'category_id'])


def add_transaction(user_id, amount, category_id, transaction_date):
    """Add a new transaction to the database.

    Args:
        user_id: The ID of the user
        amount: The transaction amount
        category_id: The category ID
        transaction_date: The date of the transaction

    Returns:
        bool: True if successful, False otherwise
    """
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            query = """
            INSERT INTO transactions
            (user_id, category_id, amount, transaction_date)
            VALUES (?, ?, ?, ?)
            """
            cursor.execute(query, (user_id, category_id, amount, transaction_date))
            conn.commit()
        return True
    except (sqlite3.OperationalError, sqlite3.IntegrityError) as e:
        st.error(f"Error adding transaction: {str(e)}")
        return False


def process_csv_upload(uploaded_file, user_id, date_format, amount_col, date_col, category_col, category_mapping):
    """Process an uploaded CSV file and add transactions to the database.

    Args:
        uploaded_file: The uploaded CSV file
        user_id: The ID of the user
        date_format: The format of the date column
        amount_col: The name of the amount column
        date_col: The name of the date column
        category_col: The name of the category column
        category_mapping: A dictionary mapping CSV categories to database categories

    Returns:
        tuple: (success_count, error_count, total_count)
    """
    try:
        # Read the CSV file
        df = pd.read_csv(uploaded_file)

        # Check if required columns exist
        required_cols = [amount_col, date_col]
        if category_col:
            required_cols.append(category_col)

        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            st.error(f"Missing required columns: {', '.join(missing_cols)}")
            return 0, 0, 0

        # Get categories from database
        categories = get_categories()
        category_dict = dict(zip(categories['name'], categories['category_id']))

        # Process each row
        success_count = 0
        error_count = 0
        total_count = len(df)

        for _, row in df.iterrows():
            try:
                # Parse amount (handle negative values for expenses)
                amount_str = str(row[amount_col]).replace('$', '').replace(',', '')
                amount = float(amount_str)

                # Parse date
                date_str = row[date_col]
                try:
                    transaction_date = pd.to_datetime(date_str, format=date_format).strftime('%Y-%m-%d')
                except:
                    # Try automatic parsing if the specified format fails
                    transaction_date = pd.to_datetime(date_str).strftime('%Y-%m-%d')

                # Determine category
                if category_col and row[category_col] in category_mapping:
                    # Use the mapping if provided
                    category_name = category_mapping[row[category_col]]
                    category_id = category_dict.get(category_name)
                elif category_col and row[category_col] in category_dict:
                    # Direct match with database category
                    category_name = row[category_col]
                    category_id = category_dict.get(category_name)
                else:
                    # Default to Miscellaneous
                    category_id = category_dict.get('Miscellaneous', 7)  # Default to ID 7 if not found

                # Add transaction to database
                if add_transaction(user_id, amount, category_id, transaction_date):
                    success_count += 1
                else:
                    error_count += 1

            except Exception as e:
                st.error(f"Error processing row: {str(e)}")
                error_count += 1

        return success_count, error_count, total_count

    except Exception as e:
        st.error(f"Error processing CSV file: {str(e)}")
        return 0, 0, 0

def plot_spending_history(spending_history):
    """Create a plot of spending history by category."""
    # Melt the dataframe to convert categories to a single column
    melted_df = spending_history.reset_index().melt(
        id_vars=['month'],
        var_name='Category',
        value_name='Amount'
    )

    # Convert month to datetime for better x-axis formatting
    melted_df['month'] = pd.to_datetime(melted_df['month'])

    # Create the plot
    fig = px.line(
        melted_df,
        x='month',
        y='Amount',
        color='Category',
        markers=True,
        title='Monthly Spending by Category',
        labels={'month': 'Month', 'Amount': 'Amount ($)'},
        height=500
    )

    # Customize the layout
    fig.update_layout(
        xaxis_title='Month',
        yaxis_title='Amount ($)',
        legend_title='Category',
        hovermode='x unified',
        plot_bgcolor='rgba(0,0,0,0)',
    )

    return fig

def plot_forecast(forecast):
    """Create a plot of spending forecast by category."""
    # Melt the dataframe to convert categories to a single column
    melted_df = forecast.reset_index().melt(
        id_vars=['index'],
        var_name='Category',
        value_name='Amount'
    )

    # Convert index to datetime for better x-axis formatting
    melted_df['index'] = pd.to_datetime(melted_df['index'])

    # Create the plot
    fig = px.line(
        melted_df,
        x='index',
        y='Amount',
        color='Category',
        markers=True,
        title='Spending Forecast by Category',
        labels={'index': 'Month', 'Amount': 'Amount ($)'},
        height=500
    )

    # Instead of using add_vline, we'll add a shape directly to the layout
    # Get the first forecast date
    forecast_start_date = pd.to_datetime(forecast.index[0])

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

    # Customize the layout
    fig.update_layout(
        xaxis_title='Month',
        yaxis_title='Amount ($)',
        legend_title='Category',
        hovermode='x unified',
        plot_bgcolor='rgba(0,0,0,0)',
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


def get_chatbot_response(user_id, question, spending_history, forecast, transactions, user_info):
    """Generate a response to a user's question about their finances.

    Args:
        user_id: The ID of the user
        question: The user's question
        spending_history: The user's spending history
        forecast: The user's spending forecast
        transactions: The user's transactions
        user_info: The user's information

    Returns:
        str: The chatbot's response
    """
    # Convert question to lowercase for easier matching
    question_lower = question.lower()

    # Check if spending history is available
    has_history = not spending_history.empty

    # Check for different types of questions
    if any(keyword in question_lower for keyword in ['hello', 'hi', 'hey', 'greetings']):
        return f"Hello {user_info['name']}! How can I help you with your finances today?"

    elif any(keyword in question_lower for keyword in ['income', 'earn', 'salary', 'make']):
        return f"Your monthly income is ${user_info['income']:,.2f}."

    elif any(keyword in question_lower for keyword in ['spend', 'spending', 'expenses']):
        if has_history:
            avg_monthly_spending = spending_history.sum(axis=1).mean()
            return f"Your average monthly spending is ${avg_monthly_spending:,.2f}."
        else:
            return "I don't have enough spending history to answer that question."

    elif any(keyword in question_lower for keyword in ['save', 'saving', 'savings']):
        if has_history:
            avg_monthly_spending = spending_history.sum(axis=1).mean()
            savings = user_info['income'] - avg_monthly_spending
            savings_percent = (savings / user_info['income']) * 100
            return f"Based on your income and spending, you save approximately ${savings:,.2f} per month, which is {savings_percent:.1f}% of your income."
        else:
            return "I don't have enough spending history to calculate your savings."

    elif any(keyword in question_lower for keyword in ['budget', 'recommend', 'suggestion', 'advice']):
        if has_history:
            # Calculate spending by category
            total_by_category = spending_history.sum()
            # Find the top spending category
            top_category = total_by_category.idxmax()
            top_amount = total_by_category.max()
            # Calculate percentage of income
            top_percent = (top_amount / user_info['income']) * 100

            return f"Your highest spending category is {top_category}, where you spend an average of ${top_amount/len(spending_history):,.2f} per month ({top_percent:.1f}% of your income). You might want to review your spending in this category to see if there are opportunities to save."
        else:
            return "I don't have enough spending history to provide budget recommendations."

    elif any(keyword in question_lower for keyword in ['forecast', 'predict', 'future', 'next month']):
        if not forecast.empty:
            next_month_total = forecast.iloc[0].sum()
            return f"Based on your spending history, I forecast that you'll spend approximately ${next_month_total:,.2f} next month."
        else:
            return "I don't have enough data to make a forecast."

    elif any(keyword in question_lower for keyword in ['transaction', 'recent', 'last purchase']):
        if not transactions.empty:
            latest_transaction = transactions.iloc[0]
            return f"Your most recent transaction was ${latest_transaction['amount']:.2f} for {latest_transaction['category']} on {latest_transaction['transaction_date'].strftime('%Y-%m-%d')}."
        else:
            return "I don't have any transaction data for you."

    elif any(keyword in question_lower for keyword in ['help', 'can you do', 'what can you do', 'features']):
        return ("I can help you with:\n"
                "- Information about your income and spending\n"
                "- Savings analysis\n"
                "- Budget recommendations\n"
                "- Spending forecasts\n"
                "- Recent transactions\n\n"
                "Just ask me a question about any of these topics!")

    else:
        return "I'm not sure how to answer that question. You can ask me about your income, spending, savings, budget recommendations, forecasts, or recent transactions."

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

    # Create forecaster instance
    forecaster = SpendingForecaster(DB_PATH)

    # Get spending history
    spending_history = forecaster.get_user_spending_history(selected_user_id)

    # Generate forecast
    forecast = forecaster.forecast_spending(selected_user_id, forecast_months=forecast_months)

    # Get transactions
    transactions = get_transactions(selected_user_id)

    # Display user information
    st.markdown('<h2 class="sub-header">User Information</h2>', unsafe_allow_html=True)

    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.markdown(f'<p class="metric-label">Name</p>', unsafe_allow_html=True)
        st.markdown(f'<p class="metric-value">{user_info["name"]}</p>', unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

    with col2:
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.markdown(f'<p class="metric-label">Monthly Income</p>', unsafe_allow_html=True)
        st.markdown(f'<p class="metric-value">${user_info["income"]:,.2f}</p>', unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

    with col3:
        # Calculate total monthly spending (average)
        if not spending_history.empty:
            avg_monthly_spending = spending_history.sum(axis=1).mean()
        else:
            avg_monthly_spending = 0

        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.markdown(f'<p class="metric-label">Avg. Monthly Spending</p>', unsafe_allow_html=True)
        st.markdown(f'<p class="metric-value">${avg_monthly_spending:,.2f}</p>', unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

    # Spending History and Forecast
    st.markdown('<h2 class="sub-header">Spending Analysis</h2>', unsafe_allow_html=True)

    # Create tabs using a list for better control
    tabs = st.tabs(["Spending History", "Forecast", "Transactions", "Upload Data", "Chat Assistant"])
    tab1, tab2, tab3, tab4, tab5 = tabs

    with tab1:
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

    with tab2:
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
                    st.markdown(f'<p class="metric-label">Monthly Savings Potential</p>', unsafe_allow_html=True)
                    st.markdown(f'<p class="metric-value">${savings_potential:,.2f}</p>', unsafe_allow_html=True)
                    st.markdown('</div>', unsafe_allow_html=True)

                with col2:
                    st.markdown('<div class="card">', unsafe_allow_html=True)
                    st.markdown(f'<p class="metric-label">Savings Rate</p>', unsafe_allow_html=True)
                    st.markdown(f'<p class="metric-value">{savings_percent:.1f}%</p>', unsafe_allow_html=True)
                    st.markdown('</div>', unsafe_allow_html=True)
        else:
            st.info("Unable to generate forecast for this user.")

    with tab3:
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

    with tab4:
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
            sample_csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sample_transactions.csv")
            if os.path.exists(sample_csv_path):
                with open(sample_csv_path, "r", encoding="utf-8") as f:
                    sample_csv_content = f.read()

                st.download_button(
                    label="Download Sample CSV",
                    data=sample_csv_content,
                    file_name="sample_transactions.csv",
                    mime="text/csv"
                )

    with tab5:
        st.subheader("Chat with Finance Assistant")
        st.write("Ask me anything about your finances and I'll try to help you.")

        # Initialize chat history in session state if it doesn't exist
        if 'chat_history' not in st.session_state:
            st.session_state.chat_history = []

        # Display chat history
        for message in st.session_state.chat_history:
            if message['is_user']:
                st.chat_message("user").write(message['text'])
            else:
                st.chat_message("assistant").write(message['text'])

        # Chat input
        user_question = st.chat_input("Ask a question about your finances...")

        if user_question:
            # Add user message to chat history
            st.session_state.chat_history.append({"is_user": True, "text": user_question})

            # Display user message
            st.chat_message("user").write(user_question)

            # Generate response
            with st.spinner("Thinking..."):
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

            # Display assistant response
            st.chat_message("assistant").write(response)

        # Add a button to clear chat history
        if st.session_state.chat_history and st.button("Clear Chat History"):
            st.session_state.chat_history = []
            st.rerun()

if __name__ == "__main__":
    main()
