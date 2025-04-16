/**
 * Test script for Ollama integration
 * 
 * This script tests the connection to the Ollama API and generates a simple story.
 * Run with: node src/test-ollama.js
 */

const axios = require('axios');
const config = require('./config/config');

/**
 * Test the Ollama API connection
 */
async function testOllamaConnection() {
  try {
    console.log('Testing connection to Ollama API...');
    
    // Check if Ollama is running by listing available models
    const response = await axios.get('http://localhost:11434/api/tags');
    
    if (response.status === 200) {
      console.log('✅ Successfully connected to Ollama API!');
      
      // List available models
      const models = response.data.models || [];
      if (models.length > 0) {
        console.log('Available models:');
        models.forEach(model => {
          console.log(`- ${model.name}`);
        });
      } else {
        console.log('No models found. You may need to pull a model first.');
        console.log('Try running: ollama pull llama3');
      }
      
      return true;
    } else {
      console.log(`❌ Failed to connect to Ollama API. Status code: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error connecting to Ollama API:', error.message);
    console.log('Make sure Ollama is running on http://localhost:11434');
    return false;
  }
}

/**
 * Test generating a simple story with Ollama
 */
async function testStoryGeneration() {
  try {
    console.log('\nTesting story generation with Ollama...');
    
    // Prepare the system prompt and user prompt
    const systemPrompt = config.LLM_SYSTEM_PROMPT;
    const userPrompt = `
Create a short social story for elementary school children about sharing toys.
The story should have:
- A clear title
- A simple introduction
- 2-3 short sections
- A conclusion that reinforces the lesson

Format each section with ## headings.
`;
    
    // Combine prompts for Ollama
    const fullPrompt = `${systemPrompt}\n\nUser: ${userPrompt}\n\nAssistant: `;
    
    // Make the API request to Ollama
    console.log(`Using model: ${config.LLM_MODEL}`);
    console.log('Generating story...');
    
    const response = await axios.post(config.LLM_API_URL, {
      model: config.LLM_MODEL,
      prompt: fullPrompt,
      stream: false,
      options: {
        temperature: config.LLM_TEMPERATURE,
        top_p: config.LLM_TOP_P,
        num_predict: config.LLM_MAX_TOKENS
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Display the response
    console.log('\n✅ Successfully generated story!');
    console.log('\n--- GENERATED STORY ---\n');
    console.log(response.data.response);
    console.log('\n-----------------------\n');
    
    return true;
  } catch (error) {
    console.error('❌ Error generating story:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

/**
 * Main function to run the tests
 */
async function main() {
  console.log('=== OLLAMA INTEGRATION TEST ===\n');
  
  // Test connection
  const connectionSuccess = await testOllamaConnection();
  
  // If connection successful, test story generation
  if (connectionSuccess) {
    await testStoryGeneration();
  }
  
  console.log('\n=== TEST COMPLETE ===');
}

// Run the tests
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
