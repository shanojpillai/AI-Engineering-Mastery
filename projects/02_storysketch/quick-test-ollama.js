/**
 * Quick Ollama Test Script
 *
 * This is a standalone script to test if Ollama is working correctly.
 * Run with: node quick-test-ollama.js
 */

const axios = require('axios');

// Import configuration if available, otherwise use defaults
let config;
try {
  config = require('./backend/src/config');
  console.log('Using configuration from config.js');
} catch (error) {
  console.log('Using default configuration');
  config = {
    OLLAMA_API_URL: 'http://localhost:11434',
    DEFAULT_MODEL: 'llama3'
  };
}

// Configuration
const OLLAMA_API_URL = config.OLLAMA_API_URL;
const MODEL = config.DEFAULT_MODEL; // Change this to match your available model

async function testOllama() {
  console.log('=== QUICK OLLAMA TEST ===\n');
  console.log(`Testing Ollama at: ${OLLAMA_API_URL}`);
  console.log(`Using model: ${MODEL}\n`);

  try {
    // Step 1: Check if Ollama is running
    console.log('Checking if Ollama is running...');
    const modelResponse = await axios.get(`${OLLAMA_API_URL}/api/tags`);

    if (modelResponse.status === 200) {
      console.log('✅ Ollama is running!');

      // List available models
      const models = modelResponse.data.models || [];
      if (models.length > 0) {
        console.log('\nAvailable models:');
        models.forEach(model => {
          console.log(`- ${model.name}`);
        });
      } else {
        console.log('\nNo models found. You need to pull a model:');
        console.log(`ollama pull ${MODEL}`);
        return;
      }

      // Step 2: Test generation with a simple prompt
      console.log('\nTesting story generation...');

      const generateResponse = await axios.post(`${OLLAMA_API_URL}/api/generate`, {
        model: MODEL,
        prompt: 'Write a very short social story (3-4 sentences) for elementary school children about sharing toys.',
        stream: false
      });

      if (generateResponse.status === 200) {
        console.log('\n✅ Generation successful!\n');
        console.log('Generated content:');
        console.log('-------------------');
        console.log(generateResponse.data.response);
        console.log('-------------------\n');

        console.log('StorySketch can use Ollama successfully!');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('\nOllama is not running. Please start Ollama with:');
      console.log('ollama serve');
    } else if (error.response && error.response.status === 404) {
      console.log(`\nModel "${MODEL}" not found. Please pull it with:`);
      console.log(`ollama pull ${MODEL}`);
    } else {
      console.log('\nTroubleshooting tips:');
      console.log('1. Make sure Ollama is installed and running');
      console.log(`2. Check if the model "${MODEL}" is available (run 'ollama list')"`);
      console.log(`3. If not, pull it with: ollama pull ${MODEL}`);
    }
  }

  console.log('\n=== TEST COMPLETE ===');
}

// Run the test
testOllama();
