"""LLM-powered financial assistant using locally running Ollama models.

This module provides integration with locally running LLM models via Ollama,
enhancing the chat capabilities of the Finance Assistant application.
"""

import requests
import json
import os
from typing import Dict, Any, List, Optional

class OllamaAssistant:
    """Assistant powered by locally running Ollama LLM."""

    def __init__(self, model_name: str = "llama3", base_url: str = "http://localhost:11434"):
        """Initialize the Ollama assistant.

        Args:
            model_name: The name of the model to use (default: "llama3")
            base_url: The base URL for the Ollama API (default: "http://localhost:11434")
        """
        self.model_name = model_name
        self.base_url = base_url
        self.api_endpoint = f"{base_url}/api/generate"
        self.system_prompt = self._get_system_prompt()
        self.conversation_history = []

    def _get_system_prompt(self) -> str:
        """Get the system prompt for the financial assistant."""
        return """You are a helpful financial assistant that provides insights and advice based on
        the user's financial data. You can analyze spending patterns, provide budget recommendations,
        and answer questions about the user's financial situation. Be concise, accurate, and helpful.

        You have access to the following information about the user:
        - Income
        - Spending history by category
        - Recent transactions
        - Spending forecasts

        When responding to questions, use the financial data provided to give personalized answers.
        """

    def check_ollama_availability(self) -> bool:
        """Check if Ollama is available at the specified URL."""
        try:
            response = requests.get(f"{self.base_url}/api/tags")
            return response.status_code == 200
        except requests.RequestException:
            return False

    def get_available_models(self) -> List[str]:
        """Get a list of available models from Ollama."""
        try:
            response = requests.get(f"{self.base_url}/api/tags")
            if response.status_code == 200:
                data = response.json()
                return [model['name'] for model in data.get('models', [])]
            return []
        except requests.RequestException:
            return []

    def generate_response(self,
                         user_query: str,
                         financial_data: Dict[str, Any],
                         temperature: float = 0.7,
                         max_tokens: int = 500) -> str:
        """Generate a response to a user query using the Ollama LLM.

        Args:
            user_query: The user's question or request
            financial_data: Dictionary containing the user's financial data
            temperature: Controls randomness (0.0 to 1.0)
            max_tokens: Maximum number of tokens to generate

        Returns:
            The LLM's response as a string
        """
        # Format the financial data as context for the LLM
        context = self._format_financial_data(financial_data)

        # Construct the prompt with context
        prompt = f"{context}\n\nUser question: {user_query}\n\nResponse:"

        # Add to conversation history
        self.conversation_history.append({"role": "user", "content": user_query})

        try:
            # Prepare the request payload
            payload = {
                "model": self.model_name,
                "prompt": prompt,
                "system": self.system_prompt,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "stream": False
            }

            # Make the API request
            response = requests.post(self.api_endpoint, json=payload)

            if response.status_code == 200:
                result = response.json()
                answer = result.get('response', '')

                # Add to conversation history
                self.conversation_history.append({"role": "assistant", "content": answer})

                return answer
            else:
                # Fallback to a default response if the API call fails
                return f"I'm sorry, I couldn't process your request. Error: {response.status_code}"

        except requests.RequestException as e:
            # Handle connection errors
            return f"I'm sorry, I couldn't connect to the language model. Error: {str(e)}"

    def _format_financial_data(self, financial_data: Dict[str, Any]) -> str:
        """Format the financial data as context for the LLM.

        Args:
            financial_data: Dictionary containing the user's financial data

        Returns:
            Formatted context string
        """
        context = "Financial Data Summary:\n"

        # Add user info
        user_info = financial_data.get('user_info', {})
        if user_info:
            context += f"- Name: {user_info.get('name', 'Unknown')}\n"
            context += f"- Monthly Income: ${user_info.get('income', 0):,.2f}\n"

        # Add spending summary
        spending_history = financial_data.get('spending_history', None)
        if spending_history is not None and hasattr(spending_history, 'empty') and not spending_history.empty:
            avg_monthly_spending = spending_history.sum(axis=1).mean()
            context += f"- Average Monthly Spending: ${avg_monthly_spending:,.2f}\n"

            # Top spending categories
            category_totals = spending_history.sum()
            top_categories = category_totals.nlargest(min(3, len(category_totals)))
            context += "- Top Spending Categories:\n"
            for cat, amount in top_categories.items():
                context += f"  * {cat}: ${amount:.2f} ({amount/avg_monthly_spending*100:.1f}%)\n"

        # Add recent transactions
        transactions = financial_data.get('transactions', None)
        if transactions is not None and hasattr(transactions, 'empty') and not transactions.empty:
            context += "- Recent Transactions:\n"
            for _, row in transactions.head(min(3, len(transactions))).iterrows():
                context += f"  * ${row['amount']:.2f} for {row['category']} on {row['transaction_date'].strftime('%Y-%m-%d')}\n"

        # Add forecast info
        forecast = financial_data.get('forecast', None)
        if forecast is not None and hasattr(forecast, 'empty') and not forecast.empty:
            next_month_total = forecast.iloc[0].sum()
            context += f"- Forecast for Next Month: ${next_month_total:,.2f}\n"

        return context

    def clear_conversation(self):
        """Clear the conversation history."""
        self.conversation_history = []


# Example usage
if __name__ == "__main__":
    # Test the Ollama assistant
    assistant = OllamaAssistant()

    if assistant.check_ollama_availability():
        print("Ollama is available!")
        models = assistant.get_available_models()
        print(f"Available models: {models}")

        # Test with some sample data
        sample_data = {
            "user_info": {"name": "John", "income": 5000},
            "spending_history": None,  # Would be a pandas DataFrame in real usage
            "transactions": None,      # Would be a pandas DataFrame in real usage
            "forecast": None           # Would be a pandas DataFrame in real usage
        }

        response = assistant.generate_response(
            "What's my monthly income?",
            sample_data
        )
        print(f"Response: {response}")
    else:
        print("Ollama is not available. Make sure it's running at http://localhost:11434")
