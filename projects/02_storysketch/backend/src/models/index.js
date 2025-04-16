/**
 * Models Index
 * 
 * This file initializes all models and their associations.
 */

const sequelize = require('../config/database');
const User = require('./user.model');
const Story = require('./story.model');
const StoryVersion = require('./storyVersion.model');

// Initialize models
const models = {
  User,
  Story,
  StoryVersion
};

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export models and sequelize instance
module.exports = {
  ...models,
  sequelize
};
