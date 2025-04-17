/**
 * Ollama Integration Test
 * 
 * This script tests the integration with Ollama for story generation.
 * Run with: node src/tests/ollama-test.js
 */

const axios = require('axios');
const config = require('../config/config');
const promptUtils = require('../utils/promptUtils');
const contentUtils = require('../utils/contentUtils');

// Test parameters
const testParams = {
  topic: 'Sharing toys with friends',
  ageGroup: 'elementary',
  skillType: 'social',
  characters: 'Alex, Jamie, Teacher Ms. Lee',
  setting: 'Classroom',
  complexity: 3,
  tone: 'encouraging'
};

/**
 * Test Ollama connection
 */
async function testOllamaConnection() {
  try {
    console.log('Testing connection to Ollama API...');
    
    const response = await axios.get(`${config.LLM_API_BASE_URL}/api/tags`);
    
    if (response.status === 200) {
      console.log('✅ Successfully connected to Ollama API!');
      
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
    
    console.log(`❌ Failed to connect to Ollama API. Status code: ${response.status}`);
    return false;
  } catch (error) {
    console.error('❌ Error connecting to Ollama API:', error.message);
    console.log('\nMake sure Ollama is running:');
    console.log('- Check if the Ollama service is running');
    console.log(`- Verify it's accessible at ${config.LLM_API_BASE_URL}`);
    console.log('- If using Docker, check if the container is running\n');
    return false;
  }
}

/**
 * Test story generation
 */
async function testStoryGeneration() {
  try {
    console.log('Testing story generation with Ollama...');
    console.log(`Using model: ${config.LLM_MODEL}`);
    
    // Create the system prompt
    const systemPrompt = promptUtils.createSystemPrompt();
    
    // Create the user prompt for story generation
    const userPrompt = promptUtils.createStoryPrompt(testParams);
    
    console.log('\nSending prompt to Ollama...');
    
    // Call Ollama API
    const startTime = Date.now();
    const response = await axios.post(`${config.LLM_API_BASE_URL}/api/generate`, {
      model: config.LLM_MODEL,
      prompt: `${systemPrompt}\n\nUser: ${userPrompt}\n\nAssistant: `,
      stream: false,
      options: {
        temperature: config.LLM_TEMPERATURE,
        top_p: config.LLM_TOP_P,
        num_predict: config.LLM_MAX_TOKENS
      }
    });
    const endTime = Date.now();
    
    // Calculate generation time
    const generationTime = (endTime - startTime) / 1000;
    
    // Parse the response
    const rawContent = response.data.response;
    
    console.log(`\n✅ Story generated in ${generationTime.toFixed(2)} seconds`);
    
    // Parse the story content
    console.log('\nParsing story content...');
    const parsedContent = contentUtils.parseStoryContent(rawContent);
    
    if (parsedContent) {
      console.log('✅ Successfully parsed story content');
      
      // Display the parsed content
      console.log('\n--- PARSED STORY ---');
      console.log(`Title: ${parsedContent.title}`);
      console.log(`Introduction: ${parsedContent.introduction.substring(0, 100)}...`);
      console.log('\nSections:');
      parsedContent.sections.forEach(section => {
        console.log(`- ${section.title}: ${section.content.substring(0, 50)}...`);
      });
      console.log(`\nConclusion: ${parsedContent.conclusion.substring(0, 100)}...`);
      console.log('-------------------\n');
      
      return true;
    } else {
      console.log('❌ Failed to parse story content');
      console.log('\nRaw content:');
      console.log(rawContent);
      return false;
    }
  } catch (error) {
    console.error('❌ Error generating story:', error.message);
    
    if (error.response) {
      console.error('\nAPI Error Details:');
      console.error(error.response.data);
    }
    
    console.log('\nTroubleshooting tips:');
    console.log(`- Make sure the model "${config.LLM_MODEL}" is available (run 'ollama list')`);
    console.log(`- If not, pull it with: ollama pull ${config.LLM_MODEL}`);
    console.log('- Check if you have enough system resources (memory/CPU)');
    console.log('- Try a smaller model if you\'re having resource issues\n');
    
    return false;
  }
}

/**
 * Test image prompt generation
 */
async function testImagePromptGeneration() {
  try {
    console.log('Testing image prompt generation with Ollama...');
    
    // Create the system prompt
    const systemPrompt = promptUtils.createSystemPrompt();
    
    // Sample story section
    const storySection = "Alex and Jamie were playing in the classroom. They both wanted to play with the same toy car. Alex grabbed the car and said, 'Mine!' Jamie started to cry.";
    
    // Create the user prompt for image generation
    const userPrompt = promptUtils.createImagePrompt(storySection);
    
    console.log('\nSending prompt to Ollama...');
    
    // Call Ollama API
    const response = await axios.post(`${config.LLM_API_BASE_URL}/api/generate`, {
      model: config.LLM_MODEL,
      prompt: `${systemPrompt}\n\nUser: ${userPrompt}\n\nAssistant: `,
      stream: false,
      options: {
        temperature: config.LLM_TEMPERATURE,
        top_p: config.LLM_TOP_P,
        num_predict: 500
      }
    });
    
    // Get the image prompt
    const imagePrompt = response.data.response.trim();
    
    console.log('\n✅ Successfully generated image prompt');
    console.log('\n--- IMAGE PROMPT ---');
    console.log(imagePrompt);
    console.log('-------------------\n');
    
    return true;
  } catch (error) {
    console.error('❌ Error generating image prompt:', error.message);
    
    if (error.response) {
      console.error('\nAPI Error Details:');
      console.error(error.response.data);
    }
    
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('=== OLLAMA INTEGRATION TEST ===\n');
  
  // Test connection
  const connectionSuccess = await testOllamaConnection();
  
  if (connectionSuccess) {
    // Test story generation
    const storySuccess = await testStoryGeneration();
    
    // Test image prompt generation
    if (storySuccess) {
      await testImagePromptGeneration();
    }
  }
  
  console.log('=== TEST COMPLETE ===');
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
