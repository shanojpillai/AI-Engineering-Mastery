/**
 * Image Service
 * 
 * This service handles the generation of images using the Stability AI API.
 * It processes image prompts from the LLM and generates appropriate images.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const { sanitizeContent } = require('../utils/contentUtils');

/**
 * Generate an image based on a prompt
 * 
 * @param {string} prompt - The prompt for image generation
 * @param {Object} options - Additional options for image generation
 * @param {string} options.style - Style of the image (e.g., "cartoon", "realistic")
 * @param {string} options.ageGroup - Target age group for appropriate styling
 * @returns {Promise<Object>} - Generated image data
 */
async function generateImage(prompt, options = {}) {
  try {
    // Sanitize the prompt to ensure it's appropriate
    const sanitizedPrompt = sanitizeContent(prompt);
    
    // Add age-appropriate styling to the prompt
    const enhancedPrompt = enhancePromptForAgeGroup(sanitizedPrompt, options.ageGroup, options.style);
    
    // Prepare the API request
    const apiKey = config.IMAGE_API_KEY;
    const apiUrl = config.IMAGE_API_URL;
    
    // Make the API request
    const response = await axios.post(apiUrl, {
      text_prompts: [
        {
          text: enhancedPrompt,
          weight: 1.0
        },
        {
          text: "blurry, bad, distorted, disfigured, poor quality, low quality, ugly, mutated, deformed, inappropriate content for children",
          weight: -1.0
        }
      ],
      cfg_scale: config.IMAGE_CFG_SCALE,
      height: config.IMAGE_HEIGHT,
      width: config.IMAGE_WIDTH,
      samples: config.IMAGE_SAMPLES,
      steps: config.IMAGE_STEPS
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    // Process the response
    const imageData = response.data.artifacts[0];
    
    // Save the image to disk (optional, could also return base64 directly)
    const imagePath = await saveImage(imageData.base64, options.storyId);
    
    return {
      imagePath,
      base64: imageData.base64,
      prompt: enhancedPrompt,
      originalPrompt: prompt
    };
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image');
  }
}

/**
 * Enhance a prompt for a specific age group and style
 * 
 * @param {string} prompt - The original prompt
 * @param {string} ageGroup - Target age group
 * @param {string} style - Desired style
 * @returns {string} - Enhanced prompt
 */
function enhancePromptForAgeGroup(prompt, ageGroup, style) {
  // Base prompt with safety enhancements
  let enhancedPrompt = `${prompt}, child-friendly, appropriate for children, educational`;
  
  // Add age-specific enhancements
  switch (ageGroup?.toLowerCase()) {
    case 'preschool':
      enhancedPrompt += ', simple shapes, bright colors, large features, friendly characters, soft edges';
      break;
      
    case 'elementary':
      enhancedPrompt += ', clear details, vibrant colors, expressive characters, engaging scene';
      break;
      
    case 'middle':
      enhancedPrompt += ', more detailed, realistic proportions, diverse characters, natural setting';
      break;
      
    case 'high':
      enhancedPrompt += ', detailed, realistic, nuanced expressions, authentic environment';
      break;
      
    default:
      enhancedPrompt += ', age-appropriate, friendly characters';
  }
  
  // Add style-specific enhancements
  switch (style?.toLowerCase()) {
    case 'cartoon':
      enhancedPrompt += ', cartoon style, animated, colorful, stylized';
      break;
      
    case 'realistic':
      enhancedPrompt += ', realistic style, natural lighting, detailed';
      break;
      
    case 'watercolor':
      enhancedPrompt += ', watercolor style, soft edges, gentle colors, artistic';
      break;
      
    case 'sketch':
      enhancedPrompt += ', sketch style, hand-drawn, pencil lines, simple';
      break;
      
    default:
      enhancedPrompt += ', illustration style, clear, engaging';
  }
  
  return enhancedPrompt;
}

/**
 * Save an image to disk
 * 
 * @param {string} base64Image - Base64-encoded image data
 * @param {string} storyId - ID of the story (for organizing images)
 * @returns {Promise<string>} - Path to the saved image
 */
async function saveImage(base64Image, storyId) {
  try {
    // Create directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../uploads');
    const storyDir = path.join(uploadsDir, storyId || 'temp');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    
    if (!fs.existsSync(storyDir)) {
      fs.mkdirSync(storyDir);
    }
    
    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `image_${timestamp}.png`;
    const filePath = path.join(storyDir, filename);
    
    // Convert base64 to buffer and save
    const imageBuffer = Buffer.from(base64Image, 'base64');
    fs.writeFileSync(filePath, imageBuffer);
    
    // Return the relative path
    return path.relative(path.join(__dirname, '../..'), filePath);
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Failed to save image');
  }
}

/**
 * Verify image-text alignment using the LLM
 * 
 * @param {string} imagePrompt - The prompt used to generate the image
 * @param {string} storyText - The story text the image should align with
 * @param {string} imagePath - Path to the generated image
 * @returns {Promise<Object>} - Verification result
 */
async function verifyImageTextAlignment(imagePrompt, storyText, imagePath) {
  // This would typically call the LLM to verify alignment
  // For now, we'll return a simple mock response
  
  return {
    aligned: true,
    confidence: 0.95,
    feedback: "The image aligns well with the story text. It accurately depicts the main character and setting described in the story."
  };
}

module.exports = {
  generateImage,
  verifyImageTextAlignment
};
