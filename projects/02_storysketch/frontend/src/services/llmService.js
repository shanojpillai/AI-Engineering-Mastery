import axios from 'axios';

/**
 * Service for interacting with the LLM API
 */
const llmService = {
  /**
   * Test LLM connection
   * 
   * @returns {Promise<Object>} - Test response
   */
  testConnection: async () => {
    try {
      const response = await axios.get('/api/llm/test');
      return response.data.data;
    } catch (error) {
      console.error('Error testing LLM connection:', error);
      throw error;
    }
  },

  /**
   * Get available LLM models
   * 
   * @returns {Promise<Array>} - List of available models
   */
  getModels: async () => {
    try {
      const response = await axios.get('/api/llm/models');
      return response.data.data.models;
    } catch (error) {
      console.error('Error fetching LLM models:', error);
      throw error;
    }
  },

  /**
   * Generate a story preview
   * 
   * @param {Object} storyParams - Story parameters
   * @returns {Promise<Object>} - Generated story preview
   */
  generateStoryPreview: async (storyParams) => {
    try {
      const response = await axios.post('/api/llm/preview', storyParams);
      return response.data.data;
    } catch (error) {
      console.error('Error generating story preview:', error);
      throw error;
    }
  },

  /**
   * Generate an image prompt
   * 
   * @param {Object} promptData - Prompt data
   * @param {string} promptData.contextId - Context ID
   * @param {string} promptData.storySection - Story section
   * @returns {Promise<Object>} - Generated image prompt
   */
  generateImagePrompt: async (promptData) => {
    try {
      const response = await axios.post('/api/llm/image-prompt', promptData);
      return response.data.data;
    } catch (error) {
      console.error('Error generating image prompt:', error);
      throw error;
    }
  }
};

export default llmService;
