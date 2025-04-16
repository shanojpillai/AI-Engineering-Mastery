# Ollama Integration for StorySketch

This document explains how StorySketch integrates with Ollama to provide local LLM capabilities for generating educational social stories.

## Overview

StorySketch uses Ollama to run Large Language Models (LLMs) locally instead of relying on cloud-based APIs. This approach offers several advantages:

1. **Privacy**: All data stays on your local machine
2. **Cost-effectiveness**: No API usage fees
3. **Offline capability**: Generate stories without internet access
4. **Customization**: Use different models based on your needs and hardware capabilities

## Setup Requirements

### 1. Install Ollama

First, you need to install Ollama on your system:

- **Windows/macOS**: Download from [ollama.ai](https://ollama.ai/)
- **Linux**: Follow the instructions on the Ollama website
- **Docker**: Use the official Docker image `ollama/ollama`

### 2. Pull Required Models

After installing Ollama, pull at least one of the recommended models:

```bash
# Pull Llama 3 (recommended)
ollama pull llama3

# Alternative models
ollama pull mistral
ollama pull llama2
```

### 3. Run Ollama

Ensure Ollama is running before starting StorySketch:

```bash
# Run directly
ollama serve

# Or with Docker
docker run -d -p 11434:11434 ollama/ollama
```

## Configuration

StorySketch is configured to use Ollama by default with these settings in `.env`:

```
LLM_API_URL=http://localhost:11434/api/generate
LLM_MODEL=llama3
LLM_MAX_TOKENS=4000
LLM_TEMPERATURE=0.7
LLM_TOP_P=0.9
```

You can modify these settings to:
- Use a different model (e.g., `mistral`, `llama2`)
- Adjust generation parameters like temperature and token count
- Connect to Ollama running on a different machine

## Testing the Integration

You can test if Ollama is properly configured using the included test script:

```bash
cd backend
node src/test-ollama.js
```

This script will:
1. Check if Ollama is running
2. List available models
3. Generate a sample story

## Troubleshooting

### Common Issues

1. **Connection Error**:
   - Ensure Ollama is running (`ollama list` should work)
   - Check that port 11434 is accessible
   - Verify firewall settings if connecting to a remote instance

2. **Model Not Found**:
   - Pull the model first: `ollama pull llama3`
   - Check available models: `ollama list`

3. **Out of Memory**:
   - Try a smaller model (e.g., `llama3:8b` instead of `llama3`)
   - Reduce batch size or context length in advanced settings

4. **Slow Generation**:
   - Larger models require more computational resources
   - Consider using a smaller or quantized model for faster generation
   - GPU acceleration significantly improves performance

## Advanced Usage

### Using Different Models

Different models have different strengths. You can experiment with:

- **llama3**: Good all-around performance, latest model
- **mistral**: Efficient performance on consumer hardware
- **llama2**: Older but well-tested model

Change the model in your `.env` file:
```
LLM_MODEL=mistral
```

### Custom Models

You can also use custom models with Ollama:

1. Create a Modelfile with specific parameters
2. Build the custom model
3. Update the configuration to use your custom model

Example:
```bash
# Create a Modelfile
echo 'FROM llama3
PARAMETER temperature 0.5
PARAMETER top_p 0.9
SYSTEM You are an educational content creator specializing in children\'s stories.' > Modelfile

# Build the model
ollama create storysketch-custom -f Modelfile

# Use in StorySketch
# LLM_MODEL=storysketch-custom
```

## Performance Considerations

Story generation quality and speed depend on:

1. **Model size**: Larger models generally produce better results but require more resources
2. **Hardware**: GPU acceleration significantly improves performance
3. **Parameters**: Temperature, top_p, and other settings affect generation quality

Recommended minimum specifications:
- CPU: 4+ cores
- RAM: 8GB+ (16GB+ recommended for larger models)
- GPU: Optional but recommended for faster generation
- Storage: 10GB+ for model files

## Security Considerations

When using Ollama:

1. By default, Ollama only accepts connections from localhost
2. If exposing to a network, use appropriate authentication and encryption
3. Be aware that generated content may still contain unexpected or inappropriate material
4. StorySketch implements additional content filtering as a safeguard
