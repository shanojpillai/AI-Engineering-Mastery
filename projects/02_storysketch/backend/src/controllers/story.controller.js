/**
 * Story Controller
 * 
 * This controller handles story-related operations.
 */

const Story = require('../models/story.model');
const StoryVersion = require('../models/storyVersion.model');
const llmService = require('../services/llm.service');
const imageService = require('../services/image.service');
const { extractSections } = require('../utils/contentUtils');

/**
 * Create a new story
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function createStory(req, res, next) {
  try {
    const { 
      topic, ageGroup, skillType, characters, 
      setting, complexity, tone, additionalContext 
    } = req.body;
    
    // Validate required fields
    if (!topic || !ageGroup || !skillType || !complexity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Generate story content using LLM
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
    
    // Create story in database
    const story = await Story.create({
      title: generatedStory.content.title,
      ageGroup,
      skillType,
      characters,
      setting,
      complexity: parseInt(complexity),
      tone,
      content: generatedStory.content,
      rawContent: generatedStory.content.rawContent,
      contextId: generatedStory.contextId,
      userId: req.user.id,
      tags: [skillType, ageGroup]
    });
    
    // Create initial version
    await StoryVersion.create({
      storyId: story.id,
      versionNumber: 1,
      title: generatedStory.content.title,
      content: generatedStory.content,
      rawContent: generatedStory.content.rawContent,
      contextId: generatedStory.contextId,
      userId: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: {
        story,
        message: 'Story created successfully'
      }
    });
  } catch (error) {
    console.error('Error creating story:', error);
    next(error);
  }
}

/**
 * Get all stories for the current user
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getStories(req, res, next) {
  try {
    const { ageGroup, skillType, search, page = 1, limit = 10 } = req.query;
    
    // Build query conditions
    const conditions = { userId: req.user.id };
    
    if (ageGroup) {
      conditions.ageGroup = ageGroup;
    }
    
    if (skillType) {
      conditions.skillType = skillType;
    }
    
    if (search) {
      conditions[Sequelize.Op.or] = [
        { title: { [Sequelize.Op.iLike]: `%${search}%` } },
        { rawContent: { [Sequelize.Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Get stories
    const { count, rows: stories } = await Story.findAndCountAll({
      where: conditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['rawContent'] }
    });
    
    res.status(200).json({
      success: true,
      data: {
        stories,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting stories:', error);
    next(error);
  }
}

/**
 * Get a story by ID
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getStory(req, res, next) {
  try {
    const { id } = req.params;
    
    // Get story
    const story = await Story.findOne({
      where: { 
        id,
        [Sequelize.Op.or]: [
          { userId: req.user.id },
          { isPublic: true }
        ]
      },
      include: [
        {
          model: StoryVersion,
          as: 'versions',
          attributes: ['id', 'versionNumber', 'title', 'createdAt', 'variationType']
        }
      ]
    });
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: { story }
    });
  } catch (error) {
    console.error('Error getting story:', error);
    next(error);
  }
}

/**
 * Update a story
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function updateStory(req, res, next) {
  try {
    const { id } = req.params;
    const { title, isPublic, tags } = req.body;
    
    // Get story
    const story = await Story.findOne({
      where: { id, userId: req.user.id }
    });
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    // Update story
    const updatedStory = await story.update({
      title: title || story.title,
      isPublic: isPublic !== undefined ? isPublic : story.isPublic,
      tags: tags || story.tags
    });
    
    res.status(200).json({
      success: true,
      data: {
        story: updatedStory,
        message: 'Story updated successfully'
      }
    });
  } catch (error) {
    console.error('Error updating story:', error);
    next(error);
  }
}

/**
 * Delete a story
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function deleteStory(req, res, next) {
  try {
    const { id } = req.params;
    
    // Get story
    const story = await Story.findOne({
      where: { id, userId: req.user.id }
    });
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    // Delete story (soft delete)
    await story.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Story deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting story:', error);
    next(error);
  }
}

/**
 * Generate an image for a story section
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function generateStoryImage(req, res, next) {
  try {
    const { id } = req.params;
    const { sectionTitle, style } = req.body;
    
    // Get story
    const story = await Story.findOne({
      where: { id, userId: req.user.id }
    });
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    // Find the section in the story content
    let sectionContent = '';
    if (sectionTitle === 'introduction') {
      sectionContent = story.content.introduction;
    } else if (sectionTitle === 'conclusion') {
      sectionContent = story.content.conclusion;
    } else {
      const section = story.content.sections.find(s => s.title === sectionTitle);
      if (section) {
        sectionContent = section.content;
      }
    }
    
    if (!sectionContent) {
      return res.status(400).json({
        success: false,
        message: 'Section not found in story'
      });
    }
    
    // Generate image prompt using LLM
    const imagePromptResult = await llmService.generateImagePrompt(
      story.contextId,
      sectionContent
    );
    
    // Generate image using the prompt
    const imageResult = await imageService.generateImage(
      imagePromptResult.imagePrompt,
      {
        storyId: story.id,
        ageGroup: story.ageGroup,
        style: style || 'cartoon'
      }
    );
    
    // Update story with the new image
    const images = story.images || [];
    images.push({
      sectionTitle,
      imagePath: imageResult.imagePath,
      prompt: imageResult.prompt,
      originalPrompt: imageResult.originalPrompt,
      createdAt: new Date()
    });
    
    await story.update({ images });
    
    res.status(200).json({
      success: true,
      data: {
        image: {
          imagePath: imageResult.imagePath,
          base64: imageResult.base64,
          sectionTitle
        },
        message: 'Image generated successfully'
      }
    });
  } catch (error) {
    console.error('Error generating story image:', error);
    next(error);
  }
}

/**
 * Refine a story based on feedback
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function refineStory(req, res, next) {
  try {
    const { id } = req.params;
    const { feedback, section } = req.body;
    
    // Get story
    const story = await Story.findOne({
      where: { id, userId: req.user.id },
      include: [
        {
          model: StoryVersion,
          as: 'versions',
          attributes: ['versionNumber']
        }
      ]
    });
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    // Refine story using LLM
    const refinedStory = await llmService.refineStory(
      story.contextId,
      feedback,
      section
    );
    
    // Calculate next version number
    const nextVersionNumber = story.versions.length > 0 ?
      Math.max(...story.versions.map(v => v.versionNumber)) + 1 : 1;
    
    // Create new version
    await StoryVersion.create({
      storyId: story.id,
      versionNumber: nextVersionNumber,
      title: refinedStory.content.title,
      content: refinedStory.content,
      rawContent: refinedStory.content.rawContent,
      contextId: refinedStory.contextId,
      userId: req.user.id,
      changes: feedback
    });
    
    // Update story with refined content
    await story.update({
      title: refinedStory.content.title,
      content: refinedStory.content,
      rawContent: refinedStory.content.rawContent,
      contextId: refinedStory.contextId
    });
    
    res.status(200).json({
      success: true,
      data: {
        story: {
          ...story.toJSON(),
          content: refinedStory.content
        },
        message: 'Story refined successfully'
      }
    });
  } catch (error) {
    console.error('Error refining story:', error);
    next(error);
  }
}

/**
 * Generate a variation of a story
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function generateStoryVariation(req, res, next) {
  try {
    const { id } = req.params;
    const { variationType } = req.body;
    
    // Validate variation type
    const validVariationTypes = ['simpler', 'more_complex', 'different_setting'];
    if (!validVariationTypes.includes(variationType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid variation type'
      });
    }
    
    // Get story
    const story = await Story.findOne({
      where: { id, userId: req.user.id }
    });
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    // Generate variation using LLM
    const variation = await llmService.generateStoryVariation(
      story.contextId,
      variationType
    );
    
    // Create new story for the variation
    const variationStory = await Story.create({
      title: `${story.title} (${variationType.replace('_', ' ')})`,
      ageGroup: story.ageGroup,
      skillType: story.skillType,
      characters: story.characters,
      setting: story.setting,
      complexity: variationType === 'simpler' ? 
        Math.max(1, story.complexity - 1) : 
        (variationType === 'more_complex' ? 
          Math.min(5, story.complexity + 1) : 
          story.complexity),
      tone: story.tone,
      content: variation.content,
      rawContent: variation.content.rawContent,
      contextId: variation.contextId,
      userId: req.user.id,
      tags: [...story.tags, `variation:${variationType}`]
    });
    
    // Create initial version for the variation
    await StoryVersion.create({
      storyId: variationStory.id,
      versionNumber: 1,
      title: variation.content.title,
      content: variation.content,
      rawContent: variation.content.rawContent,
      contextId: variation.contextId,
      userId: req.user.id,
      variationType
    });
    
    res.status(201).json({
      success: true,
      data: {
        story: variationStory,
        message: 'Story variation created successfully'
      }
    });
  } catch (error) {
    console.error('Error generating story variation:', error);
    next(error);
  }
}

module.exports = {
  createStory,
  getStories,
  getStory,
  updateStory,
  deleteStory,
  generateStoryImage,
  refineStory,
  generateStoryVariation
};
