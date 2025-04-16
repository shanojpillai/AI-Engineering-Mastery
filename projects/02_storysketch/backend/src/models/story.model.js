/**
 * Story Model
 * 
 * This module defines the Sequelize model for stories.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');

const Story = sequelize.define('Story', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ageGroup: {
    type: DataTypes.ENUM('preschool', 'elementary', 'middle', 'high'),
    allowNull: false
  },
  skillType: {
    type: DataTypes.ENUM('social', 'emotional', 'behavioral', 'academic', 'other'),
    allowNull: false
  },
  characters: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  setting: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  complexity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  tone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
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
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
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
    }
  }
}, {
  timestamps: true,
  paranoid: true, // Soft deletes
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['ageGroup']
    },
    {
      fields: ['skillType']
    },
    {
      fields: ['isPublic']
    },
    {
      fields: ['tags'],
      using: 'gin'
    }
  ]
});

// Define associations
Story.associate = (models) => {
  Story.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'author'
  });
  
  Story.hasMany(models.StoryVersion, {
    foreignKey: 'storyId',
    as: 'versions'
  });
};

module.exports = Story;
