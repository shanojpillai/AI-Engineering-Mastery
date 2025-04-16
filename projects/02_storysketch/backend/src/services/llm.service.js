/**
 * LLM Service
 *
 * This service handles all interactions with the LLM API (Claude or similar).
 * It includes prompt engineering, context management, and response processing.
 */

const axios = require('axios');
const NodeCache = require('node-cache');
const { formatPrompt } = require('../utils/promptUtils');
const { sanitizeContent } = require('../utils/contentUtils');
const config = require('../config/config');

// Cache for storing conversation contexts
const contextCache = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL

/**
 * Generate a story based on user input
 *
 * @param {Object} storyParams - Parameters for story generation
 * @param {string} storyParams.topic - The main topic or situation for the story
 * @param {string} storyParams.ageGroup - Target age group (e.g., "preschool", "elementary", "middle", "high")
 * @param {string} storyParams.skillType - Type of skill being taught (e.g., "social", "emotional", "behavioral")
 * @param {string} storyParams.characters - Main characters in the story
 * @param {string} storyParams.setting - Setting for the story
 * @param {number} storyParams.complexity - Complexity level (1-5)
 * @param {string} storyParams.tone - Tone of the story (e.g., "encouraging", "instructive", "playful")
 * @param {string} storyParams.additionalContext - Any additional context or requirements
 * @returns {Promise<Object>} - Generated story content
 */
async function generateStory(storyParams) {
  try {
    // Create a unique context ID for this story generation session
    const contextId = `story_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Format the prompt using the story parameters
    const prompt = formatPrompt('story_generation', storyParams);

    // Call the LLM API
    const response = await callLLM(prompt, contextId);

    // Process and sanitize the response
    const processedResponse = processStoryResponse(response);

    // Store the context for future interactions
    contextCache.set(contextId, {
      storyParams,
      generatedContent: processedResponse,
      conversationHistory: [
        { role: 'user', content: prompt },
        { role: 'assistant', content: response }
      ]
    });

    return {
      contextId,
      content: processedResponse
    };
  } catch (error) {
    console.error('Error generating story:', error);
    throw new Error('Failed to generate story content');
  }
}

/**
 * Generate image prompts based on story content
 *
 * @param {string} contextId - The context ID from the story generation
 * @param {string} storySection - The section of the story to generate an image for
 * @returns {Promise<Object>} - Generated image prompt
 */
async function generateImagePrompt(contextId, storySection) {
  try {
    // Retrieve the context
    const context = contextCache.get(contextId);
    if (!context) {
      throw new Error('Context not found. Please regenerate the story.');
    }

    // Format the prompt for image generation
    const prompt = formatPrompt('image_prompt_generation', {
      storyContent: context.generatedContent,
      storySection,
      ageGroup: context.storyParams.ageGroup
    });

    // Call the LLM API
    const response = await callLLM(prompt, contextId);

    // Process the response to extract the image prompt
    const imagePrompt = processImagePromptResponse(response);

    // Update the conversation history
    context.conversationHistory.push(
      { role: 'user', content: prompt },
      { role: 'assistant', content: response }
    );
    contextCache.set(contextId, context);

    return {
      imagePrompt,
      contextId
    };
  } catch (error) {
    console.error('Error generating image prompt:', error);
    throw new Error('Failed to generate image prompt');
  }
}

/**
 * Edit or refine a story based on user feedback
 *
 * @param {string} contextId - The context ID from the story generation
 * @param {string} feedback - User feedback for refinement
 * @param {string} section - The section to edit (optional, if not provided, edits the entire story)
 * @returns {Promise<Object>} - Refined story content
 */
async function refineStory(contextId, feedback, section = null) {
  try {
    // Retrieve the context
    const context = contextCache.get(contextId);
    if (!context) {
      throw new Error('Context not found. Please regenerate the story.');
    }

    // Format the prompt for story refinement
    const prompt = formatPrompt('story_refinement', {
      originalStory: context.generatedContent,
      feedback,
      section
    });

    // Call the LLM API
    const response = await callLLM(prompt, contextId);

    // Process and sanitize the response
    const refinedContent = processStoryResponse(response);

    // Update the context with the refined content
    context.generatedContent = section ?
      updateStorySection(context.generatedContent, section, refinedContent) :
      refinedContent;

    // Update the conversation history
    context.conversationHistory.push(
      { role: 'user', content: prompt },
      { role: 'assistant', content: response }
    );
    contextCache.set(contextId, context);

    return {
      contextId,
      content: context.generatedContent
    };
  } catch (error) {
    console.error('Error refining story:', error);
    throw new Error('Failed to refine story content');
  }
}

/**
 * Generate variations of an existing story
 *
 * @param {string} contextId - The context ID from the story generation
 * @param {string} variationType - Type of variation (e.g., "simpler", "more_complex", "different_setting")
 * @returns {Promise<Object>} - Generated story variation
 */
async function generateStoryVariation(contextId, variationType) {
  try {
    // Retrieve the context
    const context = contextCache.get(contextId);
    if (!context) {
      throw new Error('Context not found. Please regenerate the story.');
    }

    // Format the prompt for story variation
    const prompt = formatPrompt('story_variation', {
      originalStory: context.generatedContent,
      variationType,
      storyParams: context.storyParams
    });

    // Call the LLM API
    const response = await callLLM(prompt, contextId);

    // Process and sanitize the response
    const variationContent = processStoryResponse(response);

    // Create a new context for this variation
    const variationContextId = `${contextId}_variation_${Date.now()}`;
    contextCache.set(variationContextId, {
      storyParams: context.storyParams,
      generatedContent: variationContent,
      conversationHistory: [
        ...context.conversationHistory,
        { role: 'user', content: prompt },
        { role: 'assistant', content: response }
      ]
    });

    return {
      contextId: variationContextId,
      content: variationContent
    };
  } catch (error) {
    console.error('Error generating story variation:', error);
    throw new Error('Failed to generate story variation');
  }
}

/**
 * Format story for export to different mediums
 *
 * @param {string} contextId - The context ID from the story generation
 * @param {string} exportFormat - Format to export to (e.g., "pdf", "slides", "digital")
 * @returns {Promise<Object>} - Formatted story content
 */
async function formatStoryForExport(contextId, exportFormat) {
  try {
    // Retrieve the context
    const context = contextCache.get(contextId);
    if (!context) {
      throw new Error('Context not found. Please regenerate the story.');
    }

    // Format the prompt for export formatting
    const prompt = formatPrompt('export_formatting', {
      storyContent: context.generatedContent,
      exportFormat,
      ageGroup: context.storyParams.ageGroup
    });

    // Call the LLM API
    const response = await callLLM(prompt, contextId);

    // Process the response based on the export format
    const formattedContent = processExportResponse(response, exportFormat);

    // Update the conversation history
    context.conversationHistory.push(
      { role: 'user', content: prompt },
      { role: 'assistant', content: response }
    );
    contextCache.set(contextId, context);

    return {
      contextId,
      formattedContent
    };
  } catch (error) {
    console.error('Error formatting story for export:', error);
    throw new Error(`Failed to format story for ${exportFormat} export`);
  }
}

/**
 * Call the LLM API with a prompt
 *
 * @param {string} prompt - The prompt to send to the LLM
 * @param {string} contextId - Context ID for conversation history
 * @returns {Promise<string>} - LLM response
 */
async function callLLM(prompt, contextId) {
  try {
    // Get the conversation history if available
    const context = contextCache.get(contextId);
    const conversationHistory = context?.conversationHistory || [];

    // Prepare the API request
    const apiUrl = config.LLM_API_URL;

    // Format the conversation history for Ollama
    let fullPrompt = config.LLM_SYSTEM_PROMPT + '\n\n';

    // Add conversation history
    if (conversationHistory.length > 0) {
      for (const message of conversationHistory) {
        if (message.role === 'user') {
          fullPrompt += `User: ${message.content}\n\n`;
        } else if (message.role === 'assistant') {
          fullPrompt += `Assistant: ${message.content}\n\n`;
        }
      }
    }

    // Add the current prompt
    fullPrompt += `User: ${prompt}\n\nAssistant: `;

    // Make the API request to Ollama
    const response = await axios.post(apiUrl, {
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

    // Extract and return the response content from Ollama
    return response.data.response;
  } catch (error) {
    console.error('Error calling LLM API:', error);
    throw new Error('Failed to communicate with the Ollama service');
  }
}

/**
 * Process and structure the story response from the LLM
 *
 * @param {string} response - Raw LLM response
 * @returns {Object} - Processed story content
 */
function processStoryResponse(response) {
  // Sanitize the content to remove any inappropriate material
  const sanitizedContent = sanitizeContent(response);

  // Parse the structured content (assuming the LLM returns a structured format)
  try {
    // This is a simplified example - in reality, you'd have more robust parsing
    const sections = sanitizedContent.split('##').filter(Boolean).map(section => {
      const [title, ...content] = section.trim().split('\n');
      return {
        title: title.trim(),
        content: content.join('\n').trim()
      };
    });

    // Extract title and main content sections
    const title = sections.find(s => s.title.toLowerCase().includes('title'))?.content || 'Untitled Story';
    const introduction = sections.find(s => s.title.toLowerCase().includes('introduction'))?.content || '';
    const mainContent = sections.filter(s =>
      !s.title.toLowerCase().includes('title') &&
      !s.title.toLowerCase().includes('introduction') &&
      !s.title.toLowerCase().includes('conclusion')
    );
    const conclusion = sections.find(s => s.title.toLowerCase().includes('conclusion'))?.content || '';

    return {
      title,
      introduction,
      sections: mainContent,
      conclusion,
      rawContent: sanitizedContent
    };
  } catch (error) {
    console.error('Error processing story response:', error);
    // Fallback to returning the raw content
    return {
      title: 'Untitled Story',
      introduction: '',
      sections: [{ title: 'Story', content: sanitizedContent }],
      conclusion: '',
      rawContent: sanitizedContent
    };
  }
}

/**
 * Process the image prompt response from the LLM
 *
 * @param {string} response - Raw LLM response
 * @returns {string} - Processed image prompt
 */
function processImagePromptResponse(response) {
  // Extract the image prompt from the response
  // This is a simplified example - in reality, you'd have more robust parsing
  const promptMatch = response.match(/IMAGE PROMPT:(.*?)(?:END PROMPT|$)/is);
  if (promptMatch && promptMatch[1]) {
    return promptMatch[1].trim();
  }

  // Fallback to using the whole response
  return sanitizeContent(response);
}

/**
 * Process the export formatting response from the LLM
 *
 * @param {string} response - Raw LLM response
 * @param {string} exportFormat - The export format
 * @returns {Object} - Formatted content for export
 */
function processExportResponse(response, exportFormat) {
  // Sanitize the content
  const sanitizedContent = sanitizeContent(response);

  // Process based on export format
  switch (exportFormat) {
    case 'pdf':
      // For PDF, we might extract sections, formatting instructions, etc.
      return {
        content: sanitizedContent,
        format: 'pdf'
      };

    case 'slides':
      // For slides, we might extract individual slides
      const slides = sanitizedContent.split('---').map(slide => slide.trim());
      return {
        slides,
        format: 'slides'
      };

    case 'digital':
      // For digital format, we might extract HTML or markdown
      return {
        content: sanitizedContent,
        format: 'digital'
      };

    default:
      return {
        content: sanitizedContent,
        format: 'text'
      };
  }
}

/**
 * Update a specific section of the story
 *
 * @param {Object} originalStory - The original story content
 * @param {string} sectionToUpdate - The section to update
 * @param {string} newContent - The new content for the section
 * @returns {Object} - Updated story content
 */
function updateStorySection(originalStory, sectionToUpdate, newContent) {
  // Create a copy of the original story
  const updatedStory = { ...originalStory };

  // Update the specified section
  switch (sectionToUpdate.toLowerCase()) {
    case 'title':
      updatedStory.title = newContent;
      break;

    case 'introduction':
      updatedStory.introduction = newContent;
      break;

    case 'conclusion':
      updatedStory.conclusion = newContent;
      break;

    default:
      // Check if it's one of the main content sections
      const sectionIndex = updatedStory.sections.findIndex(
        s => s.title.toLowerCase() === sectionToUpdate.toLowerCase()
      );

      if (sectionIndex >= 0) {
        updatedStory.sections[sectionIndex].content = newContent;
      } else {
        // If section not found, add it as a new section
        updatedStory.sections.push({
          title: sectionToUpdate,
          content: newContent
        });
      }
  }

  return updatedStory;
}

module.exports = {
  generateStory,
  generateImagePrompt,
  refineStory,
  generateStoryVariation,
  formatStoryForExport
};
