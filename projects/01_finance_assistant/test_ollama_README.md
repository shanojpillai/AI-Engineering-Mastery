# Ollama LLM Testing Script

This script (`test_ollama.py`) is used to test the connection to a locally running Ollama instance and verify that the LLM integration is working correctly.

## Purpose

The testing script serves several purposes:

1. **Connectivity Testing**: Verifies that the Ollama API is accessible at the expected URL (default: http://localhost:11434)
2. **Model Availability**: Checks which LLM models are available in the local Ollama instance
3. **Response Generation**: Tests the LLM's ability to generate responses to financial questions
4. **Troubleshooting**: Helps diagnose issues with the Ollama integration

## Usage

To run the test script:

```bash
python test_ollama.py
```

## What It Tests

The script performs the following tests:

1. **API Connection Test**: Attempts to connect to the Ollama API and reports success or failure
2. **Model Listing**: If connected successfully, lists all available models in the Ollama instance
3. **Basic Generation Test**: Tests generating a response to a basic financial planning question
4. **Financial Advice Test**: Tests generating a response to a question about reducing expenses

## Expected Output

When running successfully, you should see output similar to:

```
Testing Ollama API...
✅ Successfully connected to Ollama API!
Available models: ['llama3:latest', 'mistral:latest']

Sending request to Ollama with model: llama3
Prompt: 'What is financial planning?'

✅ Successfully generated response!

Response:
--------------------------------------------------
[LLM response will appear here]
--------------------------------------------------

Sending request to Ollama with model: llama3
Prompt: 'What are some strategies for reducing monthly expenses?'

✅ Successfully generated response!

Response:
--------------------------------------------------
[LLM response will appear here]
--------------------------------------------------
```

## Troubleshooting

If the tests fail, check the following:

1. **Ollama Installation**: Make sure Ollama is installed and running
2. **Docker Status**: If using Docker, ensure the Ollama container is running
3. **Port Availability**: Verify that port 11434 is accessible
4. **Model Availability**: If no models are listed, pull a model using the Ollama CLI:
   ```
   ollama pull llama3
   ```
   or
   ```
   docker exec -it [container_id] ollama pull llama3
   ```

## Integration with Finance Assistant

This test script is separate from the main application but tests the same API that the Finance Assistant uses for its AI-powered chat feature. If this test script works correctly, the LLM integration in the Finance Assistant should also work.
