# Finance Assistant

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Technical Stack](#technical-stack)
5. [Installation](#installation)
6. [Running the Application](#running-the-application)
7. [User Guide](#user-guide)
   - [Spending History Tab](#spending-history-tab)
   - [Forecast Tab](#forecast-tab)
   - [Transactions Tab](#transactions-tab)
   - [Upload Data Tab](#upload-data-tab)
   - [Chat Assistant Tab](#chat-assistant-tab)
8. [CSV Upload Feature](#csv-upload-feature)
   - [Supported Formats](#supported-formats)
   - [Column Mapping](#column-mapping)
   - [Sample Files](#sample-files)
9. [Chat Assistant Capabilities](#chat-assistant-capabilities)
   - [Query Types](#query-types)
   - [Example Questions](#example-questions)
10. [Database Schema](#database-schema)
11. [Forecasting Model](#forecasting-model)
12. [Development](#development)
13. [Troubleshooting](#troubleshooting)
14. [License](#license)

## Overview

The Finance Assistant is a comprehensive financial management application designed to help users track their spending, analyze financial patterns, forecast future expenses, and receive personalized financial advice. It features an intuitive Streamlit-based user interface with interactive visualizations, data import capabilities, and an AI-powered chat assistant that provides insights based on the user's financial data.

This application was developed to address the need for a user-friendly tool that combines financial data analysis with personalized guidance, making financial management accessible to everyone regardless of their financial expertise.

## Features

- **Spending History Analysis**: Visualize and analyze spending patterns by category with interactive charts and tables
- **Intelligent Forecasting**: Predict future spending using time series analysis based on historical data
- **Transaction Management**: View, filter, and analyze individual transactions
- **CSV Data Import**: Import transaction data from various CSV formats with flexible column mapping
- **Interactive Chat Assistant**: Get personalized financial insights and advice through a natural language interface
- **Multi-user Support**: Manage financial data for multiple users separately
- **Responsive UI**: Modern, user-friendly interface with responsive design elements
- **Data Visualization**: Interactive charts and graphs for better understanding of financial patterns

## Project Structure

```
finance_assistant/
├── models/                       # Model implementations
│   └── forecaster.py             # Spending forecasting model using time series analysis
├── ui/                           # Streamlit user interface
│   ├── app.py                    # Original Streamlit application
│   ├── finance_app.py            # Enhanced Streamlit application with chat feature
│   ├── sample_transactions.csv   # Sample CSV file for testing
│   ├── bank_statement_sample.csv # Sample bank statement format
│   ├── credit_card_statement.csv # Sample credit card statement format
│   ├── european_format.csv       # Sample European format CSV
│   ├── very_simple.csv           # Minimal CSV example
│   └── sample_csv_readme.md      # Documentation for sample CSV files
├── app.py                        # Command-line application
├── finance.db                    # SQLite database for storing financial data
├── requirements.txt              # Project dependencies
├── run.py                        # Script to run the application with automatic setup
├── .gitignore                    # Git ignore file
└── README.md                     # Project documentation
```

## Technical Stack

- **Backend**:
  - **Python 3.8+**: Core programming language
  - **SQLite**: Lightweight database for storing financial data
  - **pandas**: Data manipulation and analysis
  - **numpy**: Numerical computing
  - **statsmodels**: Statistical models for time series forecasting
  - **python-dateutil**: Advanced date manipulation

- **Frontend**:
  - **Streamlit**: Web application framework for data applications
  - **Plotly**: Interactive data visualization
  - **Matplotlib**: Static data visualization
  - **HTML/CSS**: Custom styling for the UI components

- **Development Tools**:
  - **Git**: Version control
  - **Virtual Environment**: Dependency isolation

## Installation

### Prerequisites
- Python 3.8 or higher
- Git (optional, for cloning the repository)

### Step-by-Step Installation

1. **Clone the repository** (or download and extract the ZIP file):
   ```bash
   git clone https://github.com/yourusername/finance-assistant.git
   cd finance-assistant
   ```

2. **Create a virtual environment**:
   ```bash
   # Windows
   python -m venv venv

   # macOS/Linux
   python3 -m venv venv
   ```

3. **Activate the virtual environment**:
   ```bash
   # Windows (Command Prompt)
   venv\Scripts\activate

   # Windows (PowerShell)
   .\venv\Scripts\Activate.ps1

   # Windows (Git Bash)
   source venv/Scripts/activate

   # macOS/Linux
   source venv/bin/activate
   ```

4. **Install the required packages**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Initialize the database** (if running for the first time):
   ```bash
   python app.py
   ```

## Running the Application

### Using the Run Script (Recommended)

The easiest way to run the application is using the provided run script, which handles virtual environment setup and dependency installation automatically:

```bash
python run.py
```

### Manual Execution

#### Enhanced UI with Chat Feature

```bash
python -m streamlit run ui/finance_app.py
```

#### Original UI

```bash
python -m streamlit run ui/app.py
```

#### Command-line Application

```bash
python app.py
```

## User Guide

### Spending History Tab

The Spending History tab provides visualizations and analysis of your spending patterns:

- **Monthly Spending by Category Table**: View a breakdown of your spending by category for each month
- **Monthly Spending History Chart**: Line chart showing your total spending over time
- **Spending Distribution Chart**: Pie chart showing the proportion of spending by category

**Usage Tips**:
- Hover over charts for detailed information
- Click on legend items to filter categories
- Use the date range selector in the sidebar to adjust the time period

### Forecast Tab

The Forecast tab provides predictions of your future spending based on historical patterns:

- **Spending Forecast Table**: View predicted spending by category for future months
- **Forecast Chart**: Line chart showing historical spending and future predictions
- **Savings Potential**: Analysis of potential savings based on income and forecast

**Usage Tips**:
- Adjust the forecast months in the sidebar to change the prediction horizon
- The vertical dashed line in the chart separates historical data from forecasts
- Savings potential is calculated based on your income and predicted expenses

### Transactions Tab

The Transactions tab displays your individual financial transactions:

- **Recent Transactions Table**: List of transactions with date, category, and amount
- **Filtering Options**: Filter transactions by date, category, or amount

**Usage Tips**:
- Click on column headers to sort transactions
- Use the search box to find specific transactions

### Upload Data Tab

The Upload Data tab allows you to import transaction data from CSV files:

- **File Upload**: Upload CSV files containing transaction data
- **Column Mapping**: Map CSV columns to transaction fields (date, amount, category)
- **Category Mapping**: Map categories from your CSV to the application's categories
- **Sample Format**: View and download sample CSV formats

**Usage Tips**:
- See the [CSV Upload Feature](#csv-upload-feature) section for detailed instructions
- Use the sample CSV files as templates for your own data
- Leave the date format field empty for automatic detection

### Chat Assistant Tab

The Chat Assistant tab provides an interactive interface to ask questions about your finances:

- **Chat Interface**: Ask questions and receive personalized financial insights
- **Quick Questions**: Buttons for common financial queries
- **Chat History**: View and clear your conversation history

**Usage Tips**:
- Ask questions in natural language about your income, spending, savings, etc.
- Use the quick question buttons for common queries
- The assistant analyzes your financial data to provide personalized responses
- See the [Chat Assistant Capabilities](#chat-assistant-capabilities) section for example questions

## CSV Upload Feature

### Supported Formats

The application supports various CSV formats for importing transaction data:

1. **Standard Format**: CSV with date, amount, and category columns
2. **Bank Statement Format**: CSV with transaction date, description, debit/credit columns
3. **Credit Card Statement Format**: CSV with posted date, transaction date, card number, description, category, and amount
4. **European Format**: CSV with semicolon separators and comma as decimal separator

### Column Mapping

When uploading a CSV file, you need to map the columns to the appropriate fields:

- **Date Column**: The column containing the transaction date
- **Date Format**: The format of the date (e.g., %Y-%m-%d for YYYY-MM-DD)
- **Amount Column**: The column containing the transaction amount
- **Category Column**: (Optional) The column containing the transaction category

### Sample Files

The application includes several sample CSV files in the `ui` directory:

- **simple_transactions.csv**: Basic format with date, amount, and category
- **bank_statement_sample.csv**: Bank statement format with debit/credit columns
- **credit_card_statement.csv**: Credit card statement with detailed categories
- **european_format.csv**: European format with semicolons and comma decimals
- **very_simple.csv**: Minimal example for testing

## Chat Assistant Capabilities

The chat assistant uses natural language processing to understand and respond to questions about your finances. It analyzes your financial data to provide personalized insights and recommendations.

### Query Types

The chat assistant can handle various types of financial queries:

1. **Income Analysis**: Questions about your income and earnings
2. **Spending Analysis**: Questions about your spending patterns and expenses
3. **Savings Analysis**: Questions about your savings rate and potential
4. **Budget Recommendations**: Personalized budget advice based on your spending patterns
5. **Forecast Queries**: Questions about predicted future spending
6. **Transaction Queries**: Questions about recent transactions
7. **Category Analysis**: Questions about spending in specific categories
8. **Time Period Analysis**: Questions about spending over different time periods (daily, weekly, monthly, yearly)

### Example Questions

Here are some examples of questions you can ask the chat assistant:

- "What's my monthly income?"
- "How much do I spend each month?"
- "What's my savings rate?"
- "Give me budget recommendations"
- "What's my forecast for next month?"
- "Show me my recent transactions"
- "How much do I spend on groceries?"
- "What's my annual spending?"
- "What are my top spending categories?"
- "How much do I spend per week?"
- "Am I spending too much on entertainment?"
- "How has my spending changed over time?"

## Database Schema

The application uses an SQLite database with the following tables:

1. **users**: Stores user information
   - user_id: Integer (Primary Key)
   - name: Text
   - income: Real

2. **categories**: Stores spending categories
   - category_id: Integer (Primary Key)
   - name: Text

3. **transactions**: Stores individual financial transactions
   - transaction_id: Integer (Primary Key)
   - user_id: Integer (Foreign Key to users)
   - amount: Real
   - category_id: Integer (Foreign Key to categories)
   - transaction_date: Text (YYYY-MM-DD format)

## Forecasting Model

The application uses time series analysis to forecast future spending based on historical patterns. The forecasting model is implemented in `models/forecaster.py` and uses the following techniques:

- **Time Series Decomposition**: Separates the time series into trend, seasonal, and residual components
- **Seasonal ARIMA (SARIMA)**: Autoregressive Integrated Moving Average model with seasonal components
- **Exponential Smoothing**: Weighted averaging with exponentially decreasing weights

The model analyzes spending patterns by category and generates predictions for future months based on historical trends and seasonality.

## Development

### Adding New Features

To add new features to the application:

1. Create a new branch for your feature
2. Implement the feature in the appropriate files
3. Add any necessary dependencies to `requirements.txt`
4. Test the feature thoroughly
5. Create a pull request to merge your changes

### Code Style

The project follows PEP 8 style guidelines for Python code. Key conventions include:

- Use 4 spaces for indentation
- Maximum line length of 100 characters
- Use docstrings for all functions, classes, and modules
- Use meaningful variable and function names

## Troubleshooting

### Common Issues

1. **Database Initialization Error**:
   - Run `python app.py` to initialize the database
   - Check file permissions in the project directory

2. **CSV Import Errors**:
   - Ensure your CSV file has the required columns
   - Try different date formats if date parsing fails
   - Check for special characters or encoding issues in the CSV

3. **Forecast Not Working**:
   - Ensure you have sufficient historical data (at least 3 months)
   - Check for missing values in your spending history

4. **UI Not Displaying Correctly**:
   - Update Streamlit to the latest version
   - Clear your browser cache
   - Try a different browser

### Getting Help

If you encounter issues not covered in this documentation:

1. Check the issue tracker on GitHub
2. Create a new issue with detailed information about the problem
3. Include error messages, steps to reproduce, and your environment details

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

© 2023 Finance Assistant Team. All rights reserved.