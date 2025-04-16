/**
 * Story Version Model
 * 
 * This module defines the Sequelize model for story versions.
 * It tracks revisions and variations of stories.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StoryVersion = sequelize.define('StoryVersion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  storyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Stories',
      key: 'id'
    }
  },
  versionNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  rawContent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  changes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Description of changes from previous version'
  },
  variationType: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Type of variation (e.g., "simpler", "more_complex", "different_setting")'
  },
  contextId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    comment: 'User who created this version'
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['storyId']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['storyId', 'versionNumber'],
      unique: true
    }
  ]
});

// Define associations
StoryVersion.associate = (models) => {
  StoryVersion.belongsTo(models.Story, {
    foreignKey: 'storyId',
    as: 'story'
  });
  
  StoryVersion.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'creator'
  });
};

module.exports = StoryVersion;
