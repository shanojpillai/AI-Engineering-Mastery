# Building StorySketch: An LLM-Powered Social Story Generator with Local AI Integration

![StorySketch Header Image](https://via.placeholder.com/1200x600?text=StorySketch:+LLM-Powered+Social+Story+Generator)

## Introduction

In today's educational landscape, personalized learning materials are increasingly important, especially for children with diverse learning needs. Social stories—short narratives that explain social situations, behaviors, or concepts—are powerful tools used by educators and therapists to help children understand and navigate their world. However, creating these stories traditionally requires significant time and expertise.

Enter StorySketch, the second project in my AI Engineering Mastery series. This application leverages locally-running Large Language Models (LLMs) to generate personalized social stories for K-12 learners, particularly those with developmental needs. By combining the power of AI with educational best practices, StorySketch makes it possible to create customized learning materials in minutes rather than hours.

In this article, I'll walk through the development process, technical architecture, and key insights gained while building this application. Whether you're an educator interested in AI tools or a developer looking to integrate local LLMs into your projects, you'll find valuable takeaways from this journey.

## The Problem: Personalized Educational Content at Scale

As an educator or parent working with children who have diverse learning needs, you've likely encountered these challenges:

1. **Time constraints**: Creating personalized social stories from scratch is time-consuming
2. **Consistency challenges**: Maintaining appropriate language and structure across stories
3. **Customization needs**: Adapting stories for different age groups, situations, and learning objectives
4. **Resource limitations**: Limited access to pre-made stories that match specific scenarios

Traditional solutions often involve using generic templates or spending hours crafting stories manually. Neither approach scales well when working with multiple children or addressing various learning situations.

## The Solution: Local LLM Integration with Ollama

StorySketch takes a different approach by leveraging locally-running LLMs through Ollama, an open-source tool that makes running these models on your own hardware straightforward. This architecture provides several key advantages:

- **Complete data privacy**: All content generation happens locally, keeping sensitive educational information private
- **No usage costs**: No per-token or per-request fees associated with cloud-based AI services
- **Offline capability**: Works without an internet connection once models are downloaded
- **Model flexibility**: Users can choose different models based on their needs and hardware capabilities

### Technical Architecture Overview

StorySketch follows a modern web application architecture:

```
Frontend (React) <--> Backend (Node.js/Express) <--> Ollama API <--> LLM Models
```

The application consists of:

1. **React Frontend**: A responsive single-page application for story creation and management
2. **Express Backend**: A Node.js server handling API requests, story storage, and Ollama communication
3. **Ollama Integration**: Local LLM execution with support for multiple models
4. **File-based Storage**: Simple JSON storage for the MVP version

### Project Structure

The StorySketch project follows a clean, modular structure that separates concerns and makes the codebase easy to navigate:

```
projects/02_storysketch/
├── frontend/                  # React frontend application
│   ├── public/                # Static files
│   │   ├── index.html         # HTML entry point
│   │   └── manifest.json      # Web app manifest
│   └── src/                   # Source code
│       ├── components/        # Reusable UI components
│       │   └── SimplifiedApp.js # Main application component for MVP
│       │   └── SimplifiedApp.css # Styles for the main component
│       ├── App.js             # Root component
│       ├── App.css            # Global styles
│       ├── index.js           # JavaScript entry point
│       └── index.css          # Base styles
│
├── backend/                   # Node.js/Express backend
│   ├── src/                   # Source code
│   │   ├── server.js          # Express server (MVP simplified version)
│   │   └── config.js          # Configuration settings
│   ├── data/                  # File storage for MVP version
│   │   └── stories/           # JSON files for saved stories
│   └── .env                   # Environment variables
│
├── docs/                      # Documentation
│   ├── setup-guide.md         # Setup instructions
│   ├── ollama-integration.md  # Ollama integration details
│   └── StorySketch_Medium_Article.md # This article
│
├── quick-test-ollama.js       # Script to test Ollama connection
├── package.json               # Root package.json for dependencies
└── README.md                  # Project documentation
```

This structure follows modern best practices for web application development:

- **Separation of concerns**: Frontend and backend are clearly separated
- **Component-based architecture**: UI is built with reusable React components
- **Configuration management**: Environment variables and config files for different environments
- **Documentation**: Comprehensive documentation for setup and usage
- **Testing utilities**: Tools for testing the Ollama connection

For the MVP version, I've kept the structure intentionally simple, focusing on the core functionality rather than complex architecture. This allows for rapid development and iteration while maintaining a clean, maintainable codebase.

## Key Features and Implementation

### 1. Personalized Story Generation

The core of StorySketch is its ability to generate customized social stories based on user-defined parameters:

- **Topic/Situation**: The main focus of the story (e.g., "Sharing toys at school")
- **Age Group**: Target age range (preschool, elementary, middle school, high school)
- **Skill Type**: The type of skill being addressed (social, emotional, behavioral, academic)
- **Characters**: Names of the main characters in the story
- **Setting**: Where the story takes place
- **Complexity Level**: Adjustable complexity (1-5) for different learning needs
- **Tone**: The emotional tone of the story (encouraging, instructive, playful, etc.)

These parameters are combined into a carefully engineered prompt that guides the LLM to generate appropriate educational content.

### 2. Prompt Engineering for Educational Content

Perhaps the most critical aspect of the application is the prompt engineering strategy. Generating educational content requires careful consideration of:

- Age-appropriate language and concepts
- Educational frameworks and best practices
- Consistent narrative structure
- Appropriate tone and complexity

I developed a two-part prompt strategy:

#### System Prompt

```
You are an educational content creator specializing in social stories for children.
Social stories are short narratives that help children understand social situations,
behaviors, or concepts. Your task is to create age-appropriate, structured social
stories that follow these guidelines:

1. Use clear, concise language appropriate for the specified age group
2. Include a title, introduction, 2-3 body sections with headings, and a conclusion
3. Focus on the specified skill or situation
4. Maintain a consistent narrative with the specified characters and setting
5. Use the specified tone throughout the story
6. Adjust complexity based on the complexity level (1-5)

Your stories should be educational, engaging, and helpful for children to understand
social concepts or develop specific skills.
```

#### User Prompt

```
Please create a social story with the following parameters:

Topic: {topic}
Age Group: {ageGroup}
Skill Type: {skillType}
Characters: {characters}
Setting: {setting}
Complexity Level: {complexity} (1-5)
Tone: {tone}

Format the story with clear section headings and appropriate paragraph breaks.
```

This approach consistently produces well-structured, age-appropriate social stories that educators and parents can use immediately or customize further.

### 3. Local LLM Integration with Ollama

Integrating with Ollama was surprisingly straightforward. The backend communicates with Ollama's API to:

1. Check available models
2. Send generation requests with the constructed prompt
3. Process and format the responses

#### Backend Server Structure

The backend server (`server.js`) is organized into logical sections:

```javascript
// Import dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { config } = require('./config');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'StorySketch MVP server is running' });
});

// Ollama status endpoint
app.get('/api/ollama/status', async (req, res) => {
  try {
    const response = await axios.get(`${config.OLLAMA_API_URL}/api/tags`);
    res.json({
      status: 'ok',
      message: 'Ollama is running',
      models: response.data.models || []
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to connect to Ollama',
      error: error.message
    });
  }
});

// Story generation endpoint
app.post('/api/stories/generate', async (req, res) => {
  // Story generation logic with Ollama API
});

// Story management endpoints
app.get('/api/stories', (req, res) => {
  // Get all stories
});

app.post('/api/stories', (req, res) => {
  // Save a story
});

app.get('/api/stories/:id', (req, res) => {
  // Get a specific story
});

app.delete('/api/stories/:id', (req, res) => {
  // Delete a story
});

// Start the server
app.listen(PORT, () => {
  console.log(`StorySketch MVP server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Using Ollama at: ${config.OLLAMA_API_URL}`);
  console.log(`Default model: ${config.DEFAULT_MODEL}`);
});
```

This structure provides a clean separation of concerns with:
- Configuration management
- Middleware setup
- API endpoints for health checks and Ollama status
- Story generation and management endpoints
- Server initialization

Here's a simplified example of the Ollama API integration for story generation:

```javascript
// Example of Ollama API integration
const axios = require('axios');

async function generateStory(params) {
  const { topic, ageGroup, skillType, characters, setting, complexity, tone, model } = params;

  // Construct the prompt
  const systemPrompt = "You are an educational content creator..."; // System role
  const userPrompt = `Please create a social story with the following parameters:
    Topic: ${topic}
    Age Group: ${ageGroup}
    Skill Type: ${skillType}
    Characters: ${characters || 'No specific characters'}
    Setting: ${setting || 'No specific setting'}
    Complexity Level: ${complexity} (1-5)
    Tone: ${tone}

    Format the story with clear section headings and appropriate paragraph breaks.`;

  try {
    // Send request to Ollama API
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: model || 'llama3',
      prompt: userPrompt,
      system: systemPrompt,
      stream: false
    });

    return {
      success: true,
      story: response.data.response,
      model: model || 'llama3'
    };
  } catch (error) {
    console.error('Error generating story:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
```

### 4. Story Management and User Interface

The frontend provides an intuitive interface for:

- Creating new stories with customizable parameters
- Viewing and managing saved stories
- Printing stories for classroom or therapeutic use

The UI is designed to be accessible to educators and parents without technical expertise, with clear guidance on parameter selection and straightforward story management.

#### Frontend Component Structure

The main frontend component (`SimplifiedApp.js`) is structured to provide a clean, intuitive user experience:

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SimplifiedApp.css';

const SimplifiedApp = () => {
  // State management for form inputs, stories, and UI state
  const [formData, setFormData] = useState({
    topic: '',
    ageGroup: 'elementary',
    skillType: 'social',
    characters: '',
    setting: '',
    complexity: 3,
    tone: 'encouraging',
    model: 'llama3'
  });
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState({ status: 'unknown' });

  // Load stories and check Ollama status on component mount
  useEffect(() => {
    fetchStories();
    checkOllamaStatus();
  }, []);

  // Function to check if Ollama is running
  const checkOllamaStatus = async () => {
    try {
      const response = await axios.get('/api/ollama/status');
      setOllamaStatus(response.data);
    } catch (error) {
      setOllamaStatus({
        status: 'error',
        message: 'Failed to connect to Ollama'
      });
    }
  };

  // Function to fetch all saved stories
  const fetchStories = async () => {
    try {
      const response = await axios.get('/api/stories');
      setStories(response.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  // Function to generate a new story
  const generateStory = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await axios.post('/api/stories/generate', formData);

      if (response.data.success) {
        // Handle successful story generation
        const newStory = {
          id: Date.now().toString(),
          ...formData,
          content: response.data.story,
          createdAt: new Date().toISOString()
        };

        // Save the story
        await axios.post('/api/stories', newStory);

        // Update the UI
        setStories([newStory, ...stories]);
        setSelectedStory(newStory);
      } else {
        // Handle generation error
        console.error('Story generation failed:', response.data.error);
      }
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to delete a story
  const deleteStory = async (id) => {
    try {
      await axios.delete(`/api/stories/${id}`);
      setStories(stories.filter(story => story.id !== id));
      if (selectedStory && selectedStory.id === id) {
        setSelectedStory(null);
      }
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  // Function to print a story
  const printStory = () => {
    if (!selectedStory) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${selectedStory.topic} - Social Story</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #2c3e50; }
            .story-content { line-height: 1.6; }
          </style>
        </head>
        <body>
          <h1>${selectedStory.topic}</h1>
          <div class="story-content">${selectedStory.content}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Render the UI with form, story list, and story preview
  return (
    <div className="app-container">
      {/* Header */}
      <header>
        <h1>StorySketch</h1>
        <p>LLM-powered social story generator for K-12 learners</p>
      </header>

      {/* Main content */}
      <main>
        {/* Ollama status indicator */}
        <div className={`ollama-status ${ollamaStatus.status}`}>
          {ollamaStatus.status === 'ok' ?
            `Ollama is running - ${ollamaStatus.models?.length || 0} models available` :
            'Ollama is not running - Please start Ollama'}
        </div>

        {/* Left panel - Story form */}
        <div className="panel form-panel">
          <h2>Create a Story</h2>
          <form onSubmit={generateStory}>
            {/* Form inputs for story parameters */}
            {/* ... form fields for topic, age group, etc. ... */}
            <button
              type="submit"
              disabled={isGenerating || ollamaStatus.status !== 'ok'}
            >
              {isGenerating ? 'Generating...' : 'Generate Story'}
            </button>
          </form>
        </div>

        {/* Middle panel - Story list */}
        <div className="panel stories-panel">
          <h2>Your Stories</h2>
          <div className="stories-list">
            {stories.length === 0 ? (
              <p>No stories yet. Create your first story!</p>
            ) : (
              stories.map(story => (
                <div
                  key={story.id}
                  className={`story-item ${selectedStory?.id === story.id ? 'selected' : ''}`}
                  onClick={() => setSelectedStory(story)}
                >
                  <h3>{story.topic}</h3>
                  <p>{story.ageGroup} | {story.skillType}</p>
                  <button onClick={() => deleteStory(story.id)}>Delete</button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right panel - Story preview */}
        <div className="panel preview-panel">
          <h2>Story Preview</h2>
          {selectedStory ? (
            <div className="story-preview">
              <h3>{selectedStory.topic}</h3>
              <div
                className="story-content"
                dangerouslySetInnerHTML={{ __html: selectedStory.content }}
              />
              <button onClick={printStory}>Print Story</button>
            </div>
          ) : (
            <p>Select a story to preview</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer>
        <p>StorySketch - Part of the AI Engineering Mastery series</p>
      </footer>
    </div>
  );
};

export default SimplifiedApp;
```

This component demonstrates several important patterns:

1. **State management**: Using React hooks to manage application state
2. **API integration**: Communicating with the backend API for story operations
3. **Conditional rendering**: Showing different UI based on application state
4. **Form handling**: Managing form inputs and submission
5. **Error handling**: Gracefully handling API errors
6. **Responsive design**: Creating a layout that works on different devices

## The MVP Approach: Lessons Learned

For StorySketch, I adopted a Minimum Viable Product (MVP) approach, focusing on core functionality first:

1. **Start with a simplified architecture**: File-based storage instead of a database
2. **Focus on the core AI integration**: Perfect the LLM integration before adding features
3. **Implement basic UI with clear feedback**: Help users understand the AI capabilities
4. **Gather feedback early**: Test with real users to identify pain points

This approach allowed me to:
- Validate the concept quickly
- Identify and solve integration challenges early
- Build a foundation for more advanced features

## Implementation Challenges and Solutions

### Challenge 1: Handling Different LLM Models

Different models have varying capabilities, token limits, and response styles. My solution:

- **Model-specific parameter tuning**: Adjust temperature and other parameters based on the model
- **Fallback mechanisms**: Handle cases where models produce unexpected outputs
- **Prompt length optimization**: Balance detail with token efficiency

### Challenge 2: Local Deployment Complexity

Running LLMs locally introduces hardware and setup challenges. My approach:

- **Docker integration**: Simplify deployment with containerization
- **Resource detection**: Adjust model recommendations based on available hardware
- **Comprehensive documentation**: Clear setup instructions for different environments

### Challenge 3: User Experience with Variable Generation Times

Local LLM inference can take varying amounts of time depending on hardware. I addressed this with:

- **Progressive loading indicators**: Show generation progress
- **Background processing**: Allow users to continue using the application during generation
- **Caching mechanisms**: Store and reuse similar generations when appropriate

## Future Directions

The current MVP version of StorySketch demonstrates the potential of local LLM integration for educational applications. Future enhancements include:

1. **Image generation**: Adding LLM-guided image creation for story illustrations
2. **Collaborative features**: Allowing educators to share and collaborate on stories
3. **Advanced export options**: Creating presentation-ready formats for classroom use
4. **Analytics**: Providing insights into story usage and effectiveness

## Key Takeaways for Developers

If you're considering building applications with local LLM integration, here are some key insights from this project:

1. **Local LLMs are viable for production applications**: Tools like Ollama make local deployment accessible
2. **Prompt engineering is crucial**: Invest time in developing and testing prompts for your specific use case
3. **User experience matters**: Design interfaces that make AI capabilities accessible to non-technical users
4. **Start simple**: The MVP approach works well for AI applications where capabilities evolve rapidly
5. **Privacy can be a feature**: Local processing addresses many concerns in sensitive domains like education

## Conclusion

StorySketch demonstrates how locally-running LLMs can power specialized applications with unique requirements. By focusing on educational content generation with careful prompt engineering and a thoughtful architecture, I've created a tool that empowers educators while maintaining privacy and customization.

As AI capabilities continue to evolve, the ability to deploy these models locally opens up new possibilities for specialized applications in education, healthcare, and other domains where privacy, customization, and accessibility are paramount.

This project is part of my AI Engineering Mastery series, where I'm building 15 practical AI applications to showcase different aspects of AI engineering. You can find the complete code for StorySketch on [GitHub](https://github.com/shanojpillai/AI-Engineering-Mastery/tree/main/projects/02_storysketch).

---

## Resources and References

- [StorySketch GitHub Repository](https://github.com/shanojpillai/AI-Engineering-Mastery/tree/main/projects/02_storysketch)
- [Ollama - Run LLMs locally](https://ollama.ai/)
- [Social Stories - Carol Gray](https://carolgraysocialstories.com/social-stories/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Express.js Documentation](https://expressjs.com/)

---

*This article is part of the AI Engineering Mastery series, showcasing practical applications of AI technologies across different domains.*
