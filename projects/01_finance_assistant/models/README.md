# Finance Assistant Models

This directory contains the model implementations for the Finance Assistant application.

## Files

- **forecaster.py**: Implements the time series forecasting model for predicting future spending
- **categorizer.py**: Implements the transaction categorization logic
- **recommender.py**: Implements the recommendation engine for financial advice
- **llm_assistant.py**: Implements the Ollama LLM integration for AI-powered chat

## Usage

These models are used by the main application to provide the following functionality:

1. **Spending Forecasting**: Predicting future spending based on historical patterns
2. **Transaction Categorization**: Automatically categorizing transactions
3. **Financial Recommendations**: Generating personalized financial advice
4. **AI-Powered Chat**: Providing natural language responses to financial questions using LLMs

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

### LLM Assistant

The `OllamaAssistant` class in `llm_assistant.py` integrates with locally running LLMs via Ollama:

1. Connects to the Ollama API running on localhost
2. Formats financial data as context for the LLM
3. Generates natural language responses to user questions
4. Provides fallback mechanisms when Ollama is not available
5. Supports multiple LLM models (Llama 3, Mistral, etc.)
6. Allows for temperature adjustment to control response randomness
