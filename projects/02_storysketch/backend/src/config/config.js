/**
 * Configuration
 *
 * This module contains configuration settings for the application.
 * It loads environment variables and provides default values.
 */

require('dotenv').config();

const config = {
  // Server configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database configuration
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_NAME: process.env.DB_NAME || 'storysketch',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',

  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',

  // LLM configuration (Ollama)
  LLM_API_KEY: process.env.LLM_API_KEY || '', // Not needed for Ollama
  LLM_API_URL: process.env.LLM_API_URL || 'http://localhost:11434/api/generate',
  LLM_MODEL: process.env.LLM_MODEL || 'llama3',
  LLM_MAX_TOKENS: parseInt(process.env.LLM_MAX_TOKENS || '4000'),
  LLM_TEMPERATURE: parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
  LLM_TOP_P: parseFloat(process.env.LLM_TOP_P || '0.9'),
  LLM_SYSTEM_PROMPT: process.env.LLM_SYSTEM_PROMPT || `
    You are an educational content creator specializing in creating social stories for children.
    Your goal is to create developmentally appropriate, engaging, and educational content that helps children understand social situations and develop important skills.

    GUIDELINES:
    1. Create content that is age-appropriate and accessible for the specified age group.
    2. Use clear, concrete language, especially for younger children.
    3. Follow evidence-based practices for social story creation.
    4. Ensure all content is positive, supportive, and encourages healthy social development.
    5. Avoid any content that could be frightening, inappropriate, or reinforce negative stereotypes.
    6. Structure content with clear sections and headings for better comprehension.
    7. Focus on teaching practical skills through relatable examples and scenarios.

    IMPORTANT: Always prioritize the educational value and developmental appropriateness of the content.
  `,

  // Image generation configuration
  IMAGE_API_KEY: process.env.IMAGE_API_KEY || '',
  IMAGE_API_URL: process.env.IMAGE_API_URL || 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
  IMAGE_WIDTH: parseInt(process.env.IMAGE_WIDTH || '1024'),
  IMAGE_HEIGHT: parseInt(process.env.IMAGE_HEIGHT || '1024'),
  IMAGE_SAMPLES: parseInt(process.env.IMAGE_SAMPLES || '1'),
  IMAGE_STEPS: parseInt(process.env.IMAGE_STEPS || '30'),
  IMAGE_CFG_SCALE: parseFloat(process.env.IMAGE_CFG_SCALE || '7.0'),

  // Google API configuration (for Google Slides export)
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback',

  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100'),

  // File upload limits
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB

  // Cache configuration
  CACHE_TTL: parseInt(process.env.CACHE_TTL || '3600'), // 1 hour
};

module.exports = config;
