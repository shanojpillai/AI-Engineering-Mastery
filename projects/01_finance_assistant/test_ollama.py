"""
Test script for Ollama API integration.
This script tests the connection to a locally running Ollama instance.
"""

import requests
import json

def test_ollama_connection(base_url="http://localhost:11434"):
    """Test connection to Ollama API."""
    try:
        response = requests.get(f"{base_url}/api/tags")
        if response.status_code == 200:
            print("✅ Successfully connected to Ollama API!")
            data = response.json()
            models = data.get('models', [])
            if models:
                print(f"Available models: {[model['name'] for model in models]}")
            else:
                print("No models found. You may need to pull a model first.")
            return True
        else:
            print(f"❌ Failed to connect to Ollama API. Status code: {response.status_code}")
            return False
    except requests.RequestException as e:
        print(f"❌ Error connecting to Ollama API: {str(e)}")
        return False

def test_ollama_generation(model="llama3", prompt="What is financial planning?", base_url="http://localhost:11434"):
    """Test generating text with Ollama."""
    if not test_ollama_connection(base_url):
        return
    
    try:
        # Prepare the request payload
        payload = {
            "model": model,
            "prompt": prompt,
            "system": "You are a helpful financial assistant.",
            "stream": False
        }
        
        print(f"\nSending request to Ollama with model: {model}")
        print(f"Prompt: '{prompt}'")
        
        # Make the API request
        response = requests.post(f"{base_url}/api/generate", json=payload)
        
        if response.status_code == 200:
            result = response.json()
            print("\n✅ Successfully generated response!")
            print("\nResponse:")
            print("-" * 50)
            print(result.get('response', ''))
            print("-" * 50)
        else:
            print(f"\n❌ Failed to generate response. Status code: {response.status_code}")
            print(f"Response: {response.text}")
    except requests.RequestException as e:
        print(f"\n❌ Error making request to Ollama API: {str(e)}")

if __name__ == "__main__":
    print("Testing Ollama API...")
    
    # Test connection
    if test_ollama_connection():
        # Test generation with default model
        test_ollama_generation()
        
        # You can also test with a specific model if available
        # test_ollama_generation(model="mistral")
        
        # Test with a finance-specific question
        test_ollama_generation(
            prompt="What are some strategies for reducing monthly expenses?"
        )
