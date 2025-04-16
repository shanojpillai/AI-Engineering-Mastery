/**
 * LLM Routes
 * 
 * This module defines the routes for LLM operations.
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const llmService = require('../services/llm.service');

// All routes require authentication
router.use(authenticateToken);

/**
 * Test LLM connection
 */
router.get('/test', async (req, res, next) => {
  try {
    // Simple prompt to test LLM connection
    const prompt = 'Write a one-sentence greeting for a children\'s educational app.';
    const contextId = `test_${Date.now()}`;
    
    // Call LLM
    const response = await llmService.callLLM(prompt, contextId);
    
    res.status(200).json({
      success: true,
      message: 'LLM connection successful',
      data: {
        response
      }
    });
  } catch (error) {
    console.error('Error testing LLM connection:', error);
    next(error);
  }
});

/**
 * Get available LLM models
 */
router.get('/models', async (req, res, next) => {
  try {
    // Get available models from Ollama
    const response = await fetch('http://localhost:11434/api/tags');
    
    if (!response.ok) {
      throw new Error(`Failed to get models: ${response.statusText}`);
    }
    
    const data = await response.json();
    const models = data.models || [];
    
    res.status(200).json({
      success: true,
      data: {
        models: models.map(model => ({
          name: model.name,
          size: model.size,
          modified: model.modified
        }))
      }
    });
  } catch (error) {
    console.error('Error getting LLM models:', error);
    next(error);
  }
});

/**
 * Generate a story preview (without saving)
 */
router.post('/preview', async (req, res, next) => {
  try {
    const { 
      topic, ageGroup, skillType, characters, 
      setting, complexity, tone, additionalContext 
    } = req.body;
    
    // Validate required fields
    if (!topic || !ageGroup || !skillType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Generate story preview
    const storyParams = {
      topic,
      ageGroup,
      skillType,
      characters: characters || '',
      setting: setting || '',
      complexity: parseInt(complexity) || 3,
      tone: tone || 'encouraging',
      additionalContext: additionalContext || ''
    };
    
    const generatedStory = await llmService.generateStory(storyParams);
    
    res.status(200).json({
      success: true,
      data: {
        story: generatedStory.content,
        contextId: generatedStory.contextId
      }
    });
  } catch (error) {
    console.error('Error generating story preview:', error);
    next(error);
  }
});

/**
 * Generate an image prompt (without saving)
 */
router.post('/image-prompt', async (req, res, next) => {
  try {
    const { contextId, storySection } = req.body;
    
    // Validate required fields
    if (!contextId || !storySection) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Generate image prompt
    const imagePromptResult = await llmService.generateImagePrompt(
      contextId,
      storySection
    );
    
    res.status(200).json({
      success: true,
      data: {
        imagePrompt: imagePromptResult.imagePrompt,
        contextId: imagePromptResult.contextId
      }
    });
  } catch (error) {
    console.error('Error generating image prompt:', error);
    next(error);
  }
});

module.exports = router;
