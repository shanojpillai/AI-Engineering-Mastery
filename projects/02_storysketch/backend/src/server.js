/**
 * StorySketch MVP Backend Server
 * 
 * A simplified Express server for the StorySketch MVP.
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// Configuration
const PORT = process.env.PORT || 5000;
const OLLAMA_API_URL = 'http://localhost:11434';
const DEFAULT_MODEL = 'llama3';
const STORIES_DIR = path.join(__dirname, '../data/stories');

// Ensure stories directory exists
if (!fs.existsSync(STORIES_DIR)) {
  fs.mkdirSync(STORIES_DIR, { recursive: true });
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// System prompt for story generation
const SYSTEM_PROMPT = `You are an educational content creator specializing in creating social stories for children.
Your goal is to create developmentally appropriate, engaging, and educational content that helps children understand social situations and develop important skills.
Format the story with a clear title, introduction, 2-3 sections with headings, and a conclusion.
Use simple language appropriate for the specified age group.`;

/**
 * Generate a story prompt based on parameters
 */
function createStoryPrompt(params) {
  const { topic, ageGroup, skillType, characters, setting, complexity, tone } = params;
  
  return `Create a social story about "${topic}" for ${ageGroup} children that teaches ${skillType} skills.
${characters ? `The main characters are: ${characters}.` : ''}
${setting ? `The story takes place in: ${setting}.` : ''}
The complexity level should be ${complexity || 3}/5 (where 1 is very simple and 5 is more complex).
The tone should be ${tone || 'encouraging'}.

Format the story with:
1. A clear title
2. An introduction paragraph
3. 2-3 sections with ## headings
4. A conclusion paragraph

Keep the story concise and focused on the learning objective.`;
}

// API Routes

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'StorySketch MVP server is running' });
});

/**
 * Check Ollama status
 */
app.get('/api/ollama/status', async (req, res) => {
  try {
    const response = await axios.get(`${OLLAMA_API_URL}/api/tags`);
    
    if (response.status === 200) {
      const models = response.data.models || [];
      res.json({ 
        status: 'ok', 
        connected: true,
        models: models.map(model => ({
          name: model.name,
          size: model.size,
          modified: model.modified
        }))
      });
    } else {
      res.status(500).json({ status: 'error', message: 'Failed to connect to Ollama' });
    }
  } catch (error) {
    console.error('Error checking Ollama status:', error.message);
    res.status(500).json({ 
      status: 'error', 
      connected: false,
      message: error.message 
    });
  }
});

/**
 * Generate a story
 */
app.post('/api/stories/generate', async (req, res) => {
  try {
    const storyParams = req.body;
    
    // Validate required fields
    if (!storyParams.topic || !storyParams.ageGroup || !storyParams.skillType) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing required fields: topic, ageGroup, and skillType are required' 
      });
    }
    
    // Create the prompt
    const userPrompt = createStoryPrompt(storyParams);
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${userPrompt}\n\nAssistant: `;
    
    // Call Ollama API
    console.log('Generating story with Ollama...');
    const model = storyParams.model || DEFAULT_MODEL;
    
    const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, {
      model: model,
      prompt: fullPrompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        num_predict: 2000
      }
    });
    
    // Get the generated story
    const rawContent = response.data.response;
    
    // Save the story
    const timestamp = Date.now();
    const storyId = `story_${timestamp}`;
    const storyData = {
      id: storyId,
      ...storyParams,
      content: rawContent,
      createdAt: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(STORIES_DIR, `${storyId}.json`),
      JSON.stringify(storyData, null, 2)
    );
    
    // Return the story
    res.json({
      status: 'ok',
      story: storyData
    });
  } catch (error) {
    console.error('Error generating story:', error.message);
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

/**
 * Get all stories
 */
app.get('/api/stories', (req, res) => {
  try {
    // Read all story files
    const storyFiles = fs.readdirSync(STORIES_DIR).filter(file => file.endsWith('.json'));
    
    // Parse each story file
    const stories = storyFiles.map(file => {
      const storyData = JSON.parse(fs.readFileSync(path.join(STORIES_DIR, file), 'utf8'));
      return storyData;
    });
    
    // Sort by creation date (newest first)
    stories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      status: 'ok',
      stories
    });
  } catch (error) {
    console.error('Error getting stories:', error.message);
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

/**
 * Get a story by ID
 */
app.get('/api/stories/:id', (req, res) => {
  try {
    const storyId = req.params.id;
    const storyPath = path.join(STORIES_DIR, `${storyId}.json`);
    
    if (!fs.existsSync(storyPath)) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Story not found' 
      });
    }
    
    const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));
    
    res.json({
      status: 'ok',
      story: storyData
    });
  } catch (error) {
    console.error('Error getting story:', error.message);
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

/**
 * Delete a story
 */
app.delete('/api/stories/:id', (req, res) => {
  try {
    const storyId = req.params.id;
    const storyPath = path.join(STORIES_DIR, `${storyId}.json`);
    
    if (!fs.existsSync(storyPath)) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Story not found' 
      });
    }
    
    fs.unlinkSync(storyPath);
    
    res.json({
      status: 'ok',
      message: 'Story deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting story:', error.message);
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

// Serve React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`StorySketch MVP server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
