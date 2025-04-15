# Finance Assistant Models

This directory contains the model implementations for the Finance Assistant application.

## Files

- **forecaster.py**: Implements the time series forecasting model for predicting future spending
- **categorizer.py**: Implements the transaction categorization logic
- **recommender.py**: Implements the recommendation engine for financial advice

## Usage

These models are used by the main application to provide the following functionality:

1. **Spending Forecasting**: Predicting future spending based on historical patterns
2. **Transaction Categorization**: Automatically categorizing transactions
3. **Financial Recommendations**: Generating personalized financial advice

## Implementation Details

### Forecaster

The `SpendingForecaster` class in `forecaster.py` uses time series analysis techniques to predict future spending. It:

1. Retrieves historical spending data from the database
2. Analyzes patterns and trends in the data
3. Generates predictions for future months

### Categorizer

The transaction categorizer in `categorizer.py` is responsible for:

1. Analyzing transaction descriptions
2. Matching transactions to predefined categories
3. Learning from user corrections to improve future categorization

### Recommender

The recommendation engine in `recommender.py` provides:

1. Personalized budget recommendations
2. Savings advice based on income and spending patterns
3. Anomaly detection for unusual spending
