#!/usr/bin/env node

/**
 * Ollama Integration Test Script
 * 
 * This script tests the connection to Ollama and generates a simple story.
 * It's a standalone script that doesn't require the full application setup.
 * 
 * Usage:
 *   node test-ollama.js [model]
 * 
 * Example:
 *   node test-ollama.js llama3
 */

const axios = require('axios');

// Configuration
const config = {
  OLLAMA_API_URL: 'http://localhost:11434',
  DEFAULT_MODEL: 'llama3',
  SYSTEM_PROMPT: `You are an educational content creator specializing in creating social stories for children.
Your goal is to create developmentally appropriate, engaging, and educational content that helps children understand social situations and develop important skills.`,
  USER_PROMPT: `Create a very short social story for elementary school children about sharing toys.
The story should have:
- A clear title
- A simple introduction
- 1-2 short sections
- A conclusion that reinforces the lesson

Format each section with ## headings.
Keep it under 300 words total.`
};

// Get model from command line args or use default
const model = process.argv[2] || config.DEFAULT_MODEL;

/**
 * Check if Ollama is available
 */
async function checkOllamaAvailability() {
  try {
    console.log('Checking Ollama availability...');
    const response = await axios.get(`${config.OLLAMA_API_URL}/api/tags`);
    
    if (response.status === 200) {
      console.log('✅ Ollama is available!');
      
      // List available models
      const models = response.data.models || [];
      if (models.length > 0) {
        console.log('\nAvailable models:');
        models.forEach(model => {
          console.log(`- ${model.name}`);
        });
        console.log('');
      } else {
        console.log('\nNo models found. You may need to pull a model:');
        console.log('ollama pull llama3\n');
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error connecting to Ollama:');
    console.error(`   ${error.message}`);
    console.log('\nMake sure Ollama is running:');
    console.log('- Check if the Ollama service is running');
    console.log('- Verify it\'s accessible at http://localhost:11434');
    console.log('- If using Docker, check if the container is running\n');
    return false;
  }
}

/**
 * Generate a story using Ollama
 */
async function generateStory() {
  try {
    console.log(`Generating a story using model: ${model}`);
    console.log('This may take a moment...\n');
    
    // Prepare the prompt
    const fullPrompt = `${config.SYSTEM_PROMPT}\n\nUser: ${config.USER_PROMPT}\n\nAssistant: `;
    
    // Call Ollama API
    const startTime = Date.now();
    const response = await axios.post(`${config.OLLAMA_API_URL}/api/generate`, {
      model: model,
      prompt: fullPrompt,
      stream: false
    });
    const endTime = Date.now();
    
    // Calculate generation time
    const generationTime = (endTime - startTime) / 1000;
    
    // Display the result
    console.log('='.repeat(50));
    console.log(response.data.response);
    console.log('='.repeat(50));
    
    console.log(`\n✅ Story generated in ${generationTime.toFixed(2)} seconds`);
    return true;
  } catch (error) {
    console.error('❌ Error generating story:');
    console.error(`   ${error.message}`);
    
    if (error.response) {
      console.error('\nAPI Error Details:');
      console.error(error.response.data);
    }
    
    console.log('\nTroubleshooting tips:');
    console.log(`- Make sure the model "${model}" is available (run 'ollama list')`);
    console.log(`- If not, pull it with: ollama pull ${model}`);
    console.log('- Check if you have enough system resources (memory/CPU)');
    console.log('- Try a smaller model if you\'re having resource issues\n');
    
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('\n🔍 OLLAMA INTEGRATION TEST\n');
  
  // Check if Ollama is available
  const isAvailable = await checkOllamaAvailability();
  
  if (isAvailable) {
    // Generate a story
    await generateStory();
  }
  
  console.log('\n🔍 TEST COMPLETE\n');
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
