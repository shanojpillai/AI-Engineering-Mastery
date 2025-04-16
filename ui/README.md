# Finance Assistant UI

This folder contains the Streamlit user interface for the Finance Assistant application.

## Overview

The Streamlit application provides a user-friendly interface for:

- Viewing spending history by category
- Generating and visualizing spending forecasts
- Analyzing spending patterns
- Viewing transaction details
- Importing transaction data from CSV files
- Interacting with a financial chat assistant

## Running the Application

To run the Streamlit application, make sure you have activated the virtual environment and installed all the required packages:

```bash
# From the project root directory
source venv/Scripts/activate  # On Windows with bash
# OR
.\venv\Scripts\activate  # On Windows with PowerShell

# Run the application
python run_streamlit.py
# OR
python run.py
```

Alternatively, you can run the Streamlit application directly:

```bash
# From the project root directory
streamlit run ui/finance_app.py
```

## Features

1. **User Selection**: Choose a user from the dropdown menu in the sidebar.
2. **Forecast Settings**: Adjust the number of months to forecast in the sidebar.
3. **Spending History**: View and analyze historical spending patterns by category.
4. **Spending Forecast**: See predicted future spending based on historical patterns.
5. **Transaction Details**: Browse through individual transactions.
6. **CSV Upload**: Import transaction data from various CSV formats.
7. **Chat Assistant**: Ask questions about your finances and get personalized insights.

## Directories

- **legacy/**: Contains older versions of the UI for reference
- **sample_data/**: Contains sample CSV files for testing the data import feature

## Customization

The UI is designed to be responsive and user-friendly. You can customize the appearance by modifying the CSS in the `finance_app.py` file.

## Dependencies

- Streamlit
- Plotly
- Pandas
- SQLite3

These dependencies are listed in the project's `requirements.txt` file and should be installed in the virtual environment.
