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

// Import configuration
const config = require('./config');

// Set up storage directory
const STORIES_DIR = path.join(__dirname, '../data/stories');

// Ensure stories directory exists
if (!fs.existsSync(STORIES_DIR)) {
  fs.mkdirSync(STORIES_DIR, { recursive: true });
  console.log(`Created stories directory: ${STORIES_DIR}`);
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// System prompt is imported from config

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
    console.log(`Checking Ollama status at ${config.OLLAMA_API_URL}...`);
    const response = await axios.get(`${config.OLLAMA_API_URL}/api/tags`);

    if (response.status === 200) {
      const models = response.data.models || [];
      console.log(`Connected to Ollama. Found ${models.length} models.`);
      res.json({
        status: 'ok',
        connected: true,
        apiUrl: config.OLLAMA_API_URL,
        models: models.map(model => ({
          name: model.name,
          size: model.size,
          modified: model.modified
        }))
      });
    } else {
      console.error(`Failed to connect to Ollama: ${response.status}`);
      res.status(500).json({ status: 'error', message: 'Failed to connect to Ollama' });
    }
  } catch (error) {
    console.error('Error checking Ollama status:', error.message);
    res.status(500).json({
      status: 'error',
      connected: false,
      apiUrl: config.OLLAMA_API_URL,
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
    const fullPrompt = `${config.SYSTEM_PROMPT}\n\nUser: ${userPrompt}\n\nAssistant: `;

    // Call Ollama API
    const model = storyParams.model || config.DEFAULT_MODEL;
    console.log(`Generating story with Ollama using model: ${model}...`);

    const response = await axios.post(`${config.OLLAMA_API_URL}/api/generate`, {
      model: model,
      prompt: fullPrompt,
      stream: false,
      options: {
        temperature: config.LLM_TEMPERATURE,
        top_p: config.LLM_TOP_P,
        num_predict: config.LLM_MAX_TOKENS
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
app.listen(config.PORT, () => {
  console.log(`StorySketch MVP server running on port ${config.PORT}`);
  console.log(`API available at http://localhost:${config.PORT}/api`);
  console.log(`Using Ollama at: ${config.OLLAMA_API_URL}`);
  console.log(`Default model: ${config.DEFAULT_MODEL}`);
  console.log(`Stories directory: ${STORIES_DIR}`);
});
