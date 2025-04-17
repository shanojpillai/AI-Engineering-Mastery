/**
 * StorySketch Configuration
 *
 * This file contains configuration settings for the StorySketch application.
 */

// Load environment variables from .env file
require('dotenv').config();

const config = {
  // Server configuration
  PORT: process.env.PORT || 5000,

  // Ollama configuration
  OLLAMA_API_URL: process.env.OLLAMA_API_URL || 'http://localhost:11434',
  DEFAULT_MODEL: process.env.DEFAULT_MODEL || 'llama3',

  // LLM parameters
  LLM_TEMPERATURE: parseFloat(process.env.LLM_TEMPERATURE) || 0.7,
  LLM_TOP_P: parseFloat(process.env.LLM_TOP_P) || 0.9,
  LLM_MAX_TOKENS: parseInt(process.env.LLM_MAX_TOKENS) || 2000,

  // System prompt for story generation
  SYSTEM_PROMPT: `You are an educational content creator specializing in creating social stories for children.
Your goal is to create developmentally appropriate, engaging, and educational content that helps children understand social situations and develop important skills.
Format the story with a clear title, introduction, 2-3 sections with headings, and a conclusion.
Use simple language appropriate for the specified age group.`
};

console.log('Configuration loaded:');
console.log(`- Ollama API URL: ${config.OLLAMA_API_URL}`);
console.log(`- Default model: ${config.DEFAULT_MODEL}`);

module.exports = config;
