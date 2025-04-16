/**
 * Story Routes
 * 
 * This module defines the routes for story operations.
 */

const express = require('express');
const router = express.Router();
const storyController = require('../controllers/story.controller');
const { authenticateToken, checkRole } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Story CRUD operations
router.post('/', storyController.createStory);
router.get('/', storyController.getStories);
router.get('/:id', storyController.getStory);
router.put('/:id', storyController.updateStory);
router.delete('/:id', storyController.deleteStory);

// Story generation operations
router.post('/:id/image', storyController.generateStoryImage);
router.post('/:id/refine', storyController.refineStory);
router.post('/:id/variation', storyController.generateStoryVariation);

module.exports = router;
