import axios from 'axios';

/**
 * Service for interacting with the story API
 */
const storyService = {
  /**
   * Get all stories
   * 
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Number of items per page
   * @param {string} params.ageGroup - Filter by age group
   * @param {string} params.skillType - Filter by skill type
   * @param {string} params.search - Search term
   * @returns {Promise<Object>} - Stories and pagination data
   */
  getStories: async (params = {}) => {
    try {
      const response = await axios.get('/api/stories', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  },

  /**
   * Get a story by ID
   * 
   * @param {string} id - Story ID
   * @returns {Promise<Object>} - Story data
   */
  getStory: async (id) => {
    try {
      const response = await axios.get(`/api/stories/${id}`);
      return response.data.data.story;
    } catch (error) {
      console.error(`Error fetching story ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new story
   * 
   * @param {Object} storyData - Story data
   * @returns {Promise<Object>} - Created story
   */
  createStory: async (storyData) => {
    try {
      const response = await axios.post('/api/stories', storyData);
      return response.data.data.story;
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  },

  /**
   * Update a story
   * 
   * @param {string} id - Story ID
   * @param {Object} storyData - Story data to update
   * @returns {Promise<Object>} - Updated story
   */
  updateStory: async (id, storyData) => {
    try {
      const response = await axios.put(`/api/stories/${id}`, storyData);
      return response.data.data.story;
    } catch (error) {
      console.error(`Error updating story ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a story
   * 
   * @param {string} id - Story ID
   * @returns {Promise<Object>} - Response data
   */
  deleteStory: async (id) => {
    try {
      const response = await axios.delete(`/api/stories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting story ${id}:`, error);
      throw error;
    }
  },

  /**
   * Generate an image for a story section
   * 
   * @param {string} id - Story ID
   * @param {Object} imageData - Image generation data
   * @param {string} imageData.sectionTitle - Section title
   * @param {string} imageData.style - Image style
   * @returns {Promise<Object>} - Generated image data
   */
  generateStoryImage: async (id, imageData) => {
    try {
      const response = await axios.post(`/api/stories/${id}/image`, imageData);
      return response.data.data.image;
    } catch (error) {
      console.error(`Error generating image for story ${id}:`, error);
      throw error;
    }
  },

  /**
   * Refine a story based on feedback
   * 
   * @param {string} id - Story ID
   * @param {Object} refinementData - Refinement data
   * @param {string} refinementData.feedback - Feedback for refinement
   * @param {string} refinementData.section - Section to refine (optional)
   * @returns {Promise<Object>} - Refined story
   */
  refineStory: async (id, refinementData) => {
    try {
      const response = await axios.post(`/api/stories/${id}/refine`, refinementData);
      return response.data.data.story;
    } catch (error) {
      console.error(`Error refining story ${id}:`, error);
      throw error;
    }
  },

  /**
   * Generate a variation of a story
   * 
   * @param {string} id - Story ID
   * @param {Object} variationData - Variation data
   * @param {string} variationData.variationType - Type of variation
   * @returns {Promise<Object>} - Variation story
   */
  generateStoryVariation: async (id, variationData) => {
    try {
      const response = await axios.post(`/api/stories/${id}/variation`, variationData);
      return response.data.data.story;
    } catch (error) {
      console.error(`Error generating variation for story ${id}:`, error);
      throw error;
    }
  },

  /**
   * Generate a story preview (without saving)
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
   * Generate an image prompt (without saving)
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

export default storyService;
