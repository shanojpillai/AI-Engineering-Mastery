/**
 * Database Initialization Script
 * 
 * This script initializes the database by creating tables and adding seed data.
 * Run with: node src/scripts/init-db.js
 */

const { sequelize, User, Story, StoryVersion } = require('../models');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Sync all models with the database
    // Force: true will drop tables if they exist
    // Use with caution in production!
    await sequelize.sync({ force: true });
    console.log('Database synchronized');
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      id: uuidv4(),
      name: 'Admin User',
      email: 'admin@storysketch.com',
      password: adminPassword,
      role: 'admin'
    });
    console.log('Admin user created');
    
    // Create educator user
    const educatorPassword = await bcrypt.hash('educator123', 10);
    const educator = await User.create({
      id: uuidv4(),
      name: 'Educator User',
      email: 'educator@storysketch.com',
      password: educatorPassword,
      role: 'educator',
      organization: 'Demo School'
    });
    console.log('Educator user created');
    
    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await User.create({
      id: uuidv4(),
      name: 'Regular User',
      email: 'user@storysketch.com',
      password: userPassword,
      role: 'user'
    });
    console.log('Regular user created');
    
    // Create sample story
    const storyId = uuidv4();
    const story = await Story.create({
      id: storyId,
      title: 'Sharing at the Playground',
      ageGroup: 'elementary',
      skillType: 'social',
      characters: 'Alex, Jamie',
      setting: 'Playground',
      complexity: 2,
      tone: 'encouraging',
      content: {
        title: 'Sharing at the Playground',
        introduction: 'Alex and Jamie learn about sharing toys at the playground.',
        sections: [
          {
            title: 'The Problem',
            content: 'Alex and Jamie both wanted to play with the same swing. They started to argue about who should go first.'
          },
          {
            title: 'Learning to Share',
            content: 'Their teacher came over and explained that they could take turns. Alex could swing for five minutes, then Jamie could have a turn.'
          }
        ],
        conclusion: 'Alex and Jamie learned that sharing and taking turns made playground time fun for everyone.'
      },
      rawContent: '## Title\nSharing at the Playground\n\n## Introduction\nAlex and Jamie learn about sharing toys at the playground.\n\n## The Problem\nAlex and Jamie both wanted to play with the same swing. They started to argue about who should go first.\n\n## Learning to Share\nTheir teacher came over and explained that they could take turns. Alex could swing for five minutes, then Jamie could have a turn.\n\n## Conclusion\nAlex and Jamie learned that sharing and taking turns made playground time fun for everyone.',
      images: [],
      tags: ['sharing', 'playground', 'elementary', 'social'],
      isPublic: true,
      userId: educator.id
    });
    console.log('Sample story created');
    
    // Create story version
    await StoryVersion.create({
      id: uuidv4(),
      storyId: storyId,
      versionNumber: 1,
      title: 'Sharing at the Playground',
      content: story.content,
      rawContent: story.rawContent,
      userId: educator.id
    });
    console.log('Story version created');
    
    console.log('Database initialization complete!');
    console.log('\nSample credentials:');
    console.log('Admin: admin@storysketch.com / admin123');
    console.log('Educator: educator@storysketch.com / educator123');
    console.log('User: user@storysketch.com / user123');
    
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the initialization
initializeDatabase();
