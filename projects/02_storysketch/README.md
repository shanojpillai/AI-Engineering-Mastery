# 🎨 Building an AI-Powered Education Assistant: StorySketch

## 📖 Table of Contents
1. [🔎 Overview](#overview)
2. [✨ Features](#features)
3. [💻 System Architecture](#system-architecture)
4. [📚 Technical Stack](#technical-stack)
5. [📍 Installation](#installation)
6. [🚀 Running the Application](#running-the-application)
7. [📂 Project Structure](#project-structure)
8. [🗜️ Key Components](#key-components)
   - [💬 Prompt Engineering System](#prompt-engineering-system)
   - [🤖 Model Management System](#model-management-system)
   - [📱 Story Management Interface](#story-management-interface)
9. [💡 Challenges and Solutions](#challenges-and-solutions)
10. [🎨 User Interface Design](#user-interface-design)
11. [📝 Practical Lessons for Developers](#practical-lessons-for-developers)
12. [🚀 Deployment Instructions](#deployment-instructions)
13. [🔧 Troubleshooting](#troubleshooting)
14. [📁 Repository Structure](#repository-structure)
15. [👨‍💻 Contributors and Acknowledgments](#contributors-and-acknowledgments)
16. [📃 License](#license)

## 🔎 Overview

StorySketch is a practical AI application that generates personalized social stories for K-12 learners, particularly those with developmental needs. This project demonstrates how locally running Large Language Models can power specialized tools without relying on expensive cloud APIs.

Social stories are short narratives that explain social situations, behaviors, or concepts—powerful tools used by educators and therapists to help children understand and navigate their world. StorySketch makes creating these stories quick and easy, with customizable parameters to match each child's specific needs.

The application provides complete customization over age group, complexity, and learning focus using intuitive controls, stores and manages created stories using a simple file-based system, and operates entirely offline with no dependence on cloud APIs or subscription fees.

## ✨ Features

- **Personalized Story Generation**: Create custom social stories tailored to specific children, situations, and learning objectives
- **Age-Appropriate Content**: Adjust content complexity and language based on age group (preschool, elementary, middle school, high school)
- **Skill-Based Stories**: Generate stories focused on different skill types (social, emotional, behavioral, academic)
- **Customizable Parameters**: Control story complexity, tone, characters, and settings
- **Story Management**: Save, view, and organize generated stories
- **Print Functionality**: Print stories for classroom or therapeutic use
- **Local LLM Integration**: Uses Ollama to run LLMs locally for privacy and cost-effectiveness
- **Docker Support**: Works with Ollama running in Docker containers
- **Multiple Model Support**: Compatible with various models like Llama 3, Mistral, and others
- **Responsive Design**: User-friendly interface that works on different devices
- **Complete Privacy**: All content generation happens locally, keeping sensitive educational information private
- **No Usage Costs**: No per-token or per-request fees associated with cloud-based AI services
- **Offline Capability**: Works without an internet connection once models are downloaded

### Current Features

- **Story Generation**: Create social stories with customizable parameters
- **Story Management**: Save and view generated stories
- **Print Functionality**: Print stories for classroom use
- **File-Based Storage**: Simple storage system with no authentication required
- **Local LLM Integration**: Complete privacy with locally running models

### Planned Future Features

- **Image Generation**: Automatically create illustrations for stories
- **User Authentication**: Secure login and user-specific story libraries
- **Database Storage**: Robust storage with search and filtering capabilities
- **Export Options**: Export to PDF, Google Slides, and other formats
- **Collaborative Editing**: Share and collaborate on stories with colleagues
- **Advanced Customization**: More detailed control over story elements

## 💻 System Architecture

The architecture follows a clean, modular approach that separates concerns between the frontend user experience and backend AI functionality:

```
Frontend (React) <--> Backend (Node.js/Express) <--> Ollama API <--> LLM Models
```

### Frontend

The frontend handles all user interactions through an intuitive React interface. It's responsible for:

- Presenting the story creation form with all customization options
- Displaying the list of saved stories for selection
- Rendering the preview of generated stories with proper formatting
- Providing print and export functionality
- Communicating with the backend API for all data operations

### Backend

The backend manages communication with the Ollama API for LLM operations and handles story storage:

- RESTful API endpoints for story creation, retrieval, and management
- Sophisticated prompt engineering for educational content generation
- Communication with Ollama for local LLM inference
- File-based storage system for saving generated stories
- Error handling and validation

### Database Schema

For simplicity and portability, StorySketch uses a file-based storage system rather than a traditional database. Stories are saved as individual JSON files with the following schema:

```json
{
  "id": "unique-identifier",
  "topic": "Sharing toys at school",
  "ageGroup": "elementary",
  "skillType": "social",
  "characters": "Emma, Noah",
  "setting": "Classroom",
  "complexity": 3,
  "tone": "encouraging",
  "model": "llama3",
  "content": "The complete generated story text with formatting",
  "createdAt": "2023-10-15T14:30:45.123Z"
}
```

This approach offers several advantages for this specific application:
- No database setup required for users
- Simple backup and portability of all user data
- Direct file system access for exporting stories
- Straightforward implementation without ORM complexity

## 📚 Technical Stack

- **Frontend**:
  - **React**: JavaScript library for building the user interface
  - **HTML/CSS**: Structure and styling for the application
  - **Axios**: HTTP client for API requests
  - **React Router**: Navigation and routing
  - **Formik**: Form handling and validation

- **Backend**:
  - **Node.js**: JavaScript runtime environment
  - **Express**: Web application framework
  - **Axios**: HTTP client for Ollama API communication
  - **CORS**: Cross-Origin Resource Sharing middleware
  - **Dotenv**: Environment variable management

- **LLM Integration**:
  - **Ollama**: Local deployment of Large Language Models
  - **Llama 3**: Meta's open-source Large Language Model
  - **Mistral**: Alternative open-source LLM

- **Storage** (MVP):
  - **File System**: Simple JSON file storage

- **Storage** (Full Version - Planned):
  - **PostgreSQL**: Relational database for user data and stories
  - **Sequelize**: ORM for database interactions

- **Development Tools**:
  - **Git**: Version control
  - **Docker**: Containerization for Ollama
  - **Nodemon**: Development server with auto-reload

## Technical Architecture

### Frontend Architecture
- **Single Page Application**: React-based responsive interface with intuitive UX
- **Component Structure**: Modular components for reusability and maintainability
- **State Management**: React hooks for local state management
- **API Integration**: Axios for communication with the backend
- **Form Handling**: Structured forms for story parameter input
- **Story Preview**: Real-time rendering of generated stories

### Backend Architecture
- **RESTful API**: Express server providing endpoints for story operations
- **Middleware**: CORS, error handling, and request processing
- **LLM Integration**: Structured communication with Ollama API
- **Prompt Engineering**: Carefully designed prompts for educational content
- **File Storage**: JSON-based storage system for the MVP version
- **Error Handling**: Comprehensive error management and reporting

### LLM Integration
- **Local LLM Integration**: Uses Ollama to run LLMs locally for privacy and cost-effectiveness
- **Docker Support**: Works with Ollama running in Docker containers
- **Multiple Model Support**: Compatible with various models like Llama 3, Mistral, and others
- **Sophisticated Prompt Engineering**: Carefully designed prompts for educational content generation
- **Custom Prompt Templates**: Implements evidence-based social story structure
- **Context Management System**: Maintains coherence across story steps
- **Parameter Control**: Adjusts age-appropriateness, tone, and complexity
- **Safety Filters**: Includes guardrails for generating child-appropriate content

> **Note**: See [README-MVP.md](README-MVP.md) for the simplified Docker-ready version.

### Image Generation Pipeline (Planned for Full Version)
- LLM creates detailed image generation prompts based on story content
- Integration with Stable Diffusion or similar image generation API
- Image-text alignment verification by the LLM
- Age-appropriate style control and content filtering

## 📍 Installation

### Prerequisites
- Node.js (v14+)
- Ollama for local LLM integration
- Git (for cloning the repository)

### Option 1: Local Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shanojpillai/AI-Engineering-Mastery.git
   cd AI-Engineering-Mastery/projects/02_storysketch
   ```

2. **Install Ollama**:
   - Download from [ollama.ai](https://ollama.ai/)
   - Pull the required model: `ollama pull llama3`
   - Ensure Ollama is running: `ollama serve`

3. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

### Option 2: Docker Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shanojpillai/AI-Engineering-Mastery.git
   cd AI-Engineering-Mastery/projects/02_storysketch
   ```

2. **Run Ollama in Docker**:
   ```bash
   docker run -d -p 11434:11434 --name ollama ollama/ollama
   ```

3. **Pull a model in the container**:
   ```bash
   docker exec -it ollama ollama pull llama3
   ```

4. **Configure for Docker**:
   Edit the `.env` file in the backend directory:
   ```
   # For Docker on the same machine
   OLLAMA_API_URL=http://host.docker.internal:11434

   # Or use your Docker host's IP address
   # OLLAMA_API_URL=http://your-docker-ip:11434
   ```

5. **Install dependencies**:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

## 🚀 Running the Application

### Option 1: Development Mode (Recommended)

1. **Start the backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend** (in a new terminal):
   ```bash
   cd frontend
   set NODE_OPTIONS=--openssl-legacy-provider  # For Node.js v20+ on Windows
   npm start
   ```

   For macOS/Linux:
   ```bash
   cd frontend
   export NODE_OPTIONS=--openssl-legacy-provider  # For Node.js v20+
   npm start
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Option 2: Production Mode

1. **Build the frontend**:
   ```bash
   cd frontend
   set NODE_OPTIONS=--openssl-legacy-provider  # For Node.js v20+ on Windows
   npm run build
   ```

2. **Start the backend** (which will serve the frontend build):
   ```bash
   cd backend
   NODE_ENV=production npm start
   ```

3. **Access the application**:
   - http://localhost:5000

## 📂 Project Structure

```
projects/02_storysketch/
├── frontend/                  # React frontend application
│   ├── public/                # Static files
│   │   ├── index.html         # HTML entry point
│   │   └── manifest.json      # Web app manifest
│   └── src/                   # Source code
│       ├── components/        # Reusable UI components
│       │   └── SimplifiedApp.js # Main application component
│       │   └── SimplifiedApp.css # Styles for the main component
│       ├── App.js             # Root component
│       ├── App.css            # Global styles
│       ├── index.js           # JavaScript entry point
│       └── index.css          # Base styles
│
├── backend/                   # Node.js/Express backend
│   ├── src/                   # Source code
│   │   ├── server.js          # Express server
│   │   └── config.js          # Configuration settings
│   ├── data/                  # File storage for stories
│   │   └── stories/           # JSON files for saved stories
│   └── .env                   # Environment variables
│
├── docs/                      # Documentation
│   ├── setup-guide.md         # Setup instructions
│   └── ollama-integration.md  # Ollama integration details
│
├── quick-test-ollama.js       # Script to test Ollama connection
├── package.json               # Root package.json for dependencies
├── README.md                  # This file - main documentation
└── README-MVP.md              # MVP version documentation
```

## 🗜️ Key Components

### 💬 Prompt Engineering System

**Problem**: LLMs are general-purpose tools that need specific guidance to generate high-quality educational content that follows accepted best practices and maintains appropriate language for different age groups.

**Implementation**:

```javascript
// Prompt construction function
function buildEducationalPrompt(parameters) {
  const { topic, ageGroup, skillType, characters, setting, complexity, tone } = parameters;

  // System prompt provides overall context and guidelines
  const systemPrompt = `You are an educational content creator specializing in social stories for children.
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
social concepts or develop specific skills.`;

  // User prompt provides specific parameters for this generation
  const userPrompt = `Please create a social story with the following parameters:
Topic: ${topic}
Age Group: ${ageGroup}
Skill Type: ${skillType}
Characters: ${characters || 'No specific characters'}
Setting: ${setting || 'No specific setting'}
Complexity Level: ${complexity} (1-5)
Tone: ${tone}
Format the story with clear section headings and appropriate paragraph breaks.`;

  return { systemPrompt, userPrompt };
}
```

**Theory Note**: Splitting the prompt into system and user components follows best practices for modern LLMs. The system prompt sets the overall context and constraints, while the user prompt provides the specific parameters for each generation. This separation makes it easier to maintain consistent output quality while allowing for customization.

### 🤖 Model Management System

**Problem**: Different LLM models have varying capabilities, token limits, and performance characteristics. Users need guidance on which model to use based on their hardware and specific needs.

**Implementation**:

```javascript
// Express route to check Ollama status and available models
app.get('/api/ollama/status', async (req, res) => {
  try {
    const response = await axios.get(`${config.OLLAMA_API_URL}/api/tags`);

    // Get system information for model recommendations
    const systemInfo = await getSystemInfo();

    // Filter and categorize models based on size and requirements
    const categorizedModels = categorizeModels(response.data.models, systemInfo);

    res.json({
      status: 'ok',
      message: 'Ollama is running',
      models: categorizedModels,
      recommended: selectRecommendedModel(categorizedModels, systemInfo)
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to connect to Ollama',
      error: error.message
    });
  }
});

// Helper function to categorize models by size and capability
function categorizeModels(models, systemInfo) {
  return models.map(model => {
    // Determine model category based on size and system requirements
    const category = determineModelCategory(model, systemInfo);

    return {
      ...model,
      category,
      recommended: isRecommendedForSystem(model, systemInfo)
    };
  });
}
```

**Theory Note**: Model selection is critical for local LLM applications. While large models (13B+ parameters) typically produce better quality content, they require significant hardware resources. Smaller models (3B-7B parameters) run well on consumer hardware but may produce less sophisticated output.

### 📱 Story Management Interface

**Problem**: Users need an intuitive way to create, view, edit, and export their stories without technical expertise.

**Implementation**:

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
        {/* Left panel - Story form */}
        <div className="panel form-panel">
          <h2>Create a Story</h2>
          <form onSubmit={generateStory}>
            {/* Form fields would go here */}
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
            {stories.map(story => (
              <div
                key={story.id}
                className={`story-item ${selectedStory?.id === story.id ? 'selected' : ''}`}
                onClick={() => setSelectedStory(story)}
              >
                <h3>{story.topic}</h3>
                <p>{story.ageGroup} | {story.skillType}</p>
                <button onClick={() => deleteStory(story.id)}>Delete</button>
              </div>
            ))}
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
    </div>
  );
};

export default SimplifiedApp;
```

**Theory Note**: The three-panel interface (form, list, preview) follows established patterns in content management systems. This approach keeps the interface intuitive while maintaining a clear separation between content creation, selection, and viewing.

## 💡 Challenges and Solutions

### 🛠️ Challenge 1: Variable LLM Response Quality

LLMs can sometimes generate content that doesn't match the requested format or contains inappropriate content for educational use.

**Solution**:
- Implemented robust prompt engineering with clear constraints
- Added a post-processing layer to verify and format LLM outputs
- Created model-specific parameter tuning (temperature, top_p, etc.)
- Established fallback mechanisms for when primary models fail

**Developer Takeaway**: When working with LLMs in production applications, always build in multiple layers of quality control. The raw output from even the best models needs validation and sometimes correction before presenting to users.

### 💻 Challenge 2: Performance on Consumer Hardware

Running LLMs locally requires significant resources, which can be a barrier for many users.

**Solution**:
- Implemented dynamic model recommendations based on available hardware
- Created a quantized model option for better performance on limited hardware
- Added caching for frequent generations to reduce computational load
- Built progressive loading indicators to manage user expectations

**Developer Takeaway**: For AI applications targeting general users, always design with resource constraints in mind. Create graceful degradation paths that maintain functionality even on lower-end hardware.

### 🎓 Challenge 3: Maintaining Educational Quality Standards

Ensuring that AI-generated content meets educational standards and best practices is challenging.

**Solution**:
- Developed specialized prompts based on educational research
- Added format validation to ensure consistent structure
- Created educational-focused parameter controls (age group, complexity)
- Implemented content filters specific to educational contexts

**Developer Takeaway**: Domain-specific AI applications require deep integration of domain expertise. Partner with subject matter experts to encode their knowledge into your prompts and validation systems.

## 🎨 User Interface Design

The StorySketch interface is designed with educators in mind, focusing on workflow efficiency and clarity:

- **Parameter Selection Area**: Intuitive controls for story customization
- **Story Management Panel**: Simple listing of created stories with basic sorting
- **Content Preview Area**: WYSIWYG display of generated content with editing options
- **Export Functions**: One-click options for printing and saving stories

The design principles driving these choices were:
- Minimise technical complexity for non-technical users
- Prioritise content quality over interface flourishes
- Create a natural workflow that mirrors existing educational processes
- Provide immediate feedback on AI operations

## User Guide

### Story Creation

The StorySketch application provides an intuitive interface for creating personalized social stories:

1. **Fill out the story form**:
   - **Topic/Situation**: Enter the main topic or situation for the story (e.g., "Sharing toys at school")
   - **Age Group**: Select the appropriate age range (preschool, elementary, middle school, high school)
   - **Skill Type**: Choose the type of skill the story should focus on (social, emotional, behavioral, academic)
   - **Characters**: (Optional) Enter the names of the main characters
   - **Setting**: (Optional) Specify where the story takes place
   - **Complexity Level**: Adjust the slider to set the complexity level (1-5)
   - **Tone**: Select the desired tone for the story (encouraging, instructive, playful, serious, neutral)
   - **LLM Model**: Choose which Ollama model to use for generation

2. **Generate the story**:
   - Click the "Generate Story" button
   - The application will send your parameters to the LLM and create a personalized story
   - The generation process typically takes 10-30 seconds depending on the model and complexity

### Story Management

StorySketch allows you to save and manage your generated stories:

1. **View saved stories**:
   - All your generated stories appear in the "Your Stories" section
   - Stories are sorted by creation date (newest first)
   - Each story shows the topic, age group, and skill type

2. **Select a story**:
   - Click on any story in the list to view it in the preview panel
   - The selected story is highlighted in the list

3. **Delete a story**:
   - Click the trash icon next to a story to delete it
   - Confirm the deletion when prompted

### Story Preview

The story preview panel displays the generated story with proper formatting:

1. **Story structure**:
   - Title: The main title of the story
   - Introduction: Sets up the scenario or skill
   - Sections: 2-3 sections with headings that develop the story
   - Conclusion: Summarizes the learning points

2. **Formatting**:
   - Section headings are clearly distinguished
   - Paragraphs are properly spaced for readability
   - Text size and font are appropriate for the target age group

### Printing and Exporting

StorySketch allows you to print or export your stories for classroom or therapeutic use:

1. **Print a story**:
   - Select the story you want to print
   - Click the "Print Story" button
   - A print-friendly version will open in a new tab
   - Use your browser's print function to print or save as PDF

2. **Future export options** (planned for full version):
   - Export to PDF with custom formatting
   - Export to Google Slides for presentation
   - Export to Word document for editing

## Ollama Integration

StorySketch uses Ollama to run Large Language Models locally, providing privacy, cost-effectiveness, and flexibility.

### Supported Models

The application has been tested with the following Ollama models:

1. **Llama 3 (Recommended)**
   - Model name: `llama3`
   - Best balance of quality and speed
   - Excellent for educational content generation

2. **Mistral**
   - Model name: `mistral`
   - Good alternative with different generation style
   - Slightly faster than Llama 3

3. **Phi**
   - Model name: `phi`
   - Smaller and faster model
   - Good for simpler stories

4. **Other models**
   - Any model available in Ollama should work
   - Quality and performance may vary

### Docker Configuration

When running Ollama in Docker, you need to configure the backend to communicate with the Docker container:

1. **Host Machine Docker**
   ```
   # In backend/.env
   OLLAMA_API_URL=http://host.docker.internal:11434
   ```

2. **Remote Docker**
   ```
   # In backend/.env
   OLLAMA_API_URL=http://your-docker-ip:11434
   ```

3. **Docker Compose**
   ```yaml
   # Example docker-compose.yml
   version: '3'
   services:
     ollama:
       image: ollama/ollama
       ports:
         - "11434:11434"
       volumes:
         - ollama_data:/root/.ollama
     backend:
       # ... backend service configuration
       environment:
         - OLLAMA_API_URL=http://ollama:11434
   volumes:
     ollama_data:
   ```

## Story Generation Process

StorySketch uses a sophisticated prompt engineering approach to generate high-quality social stories:

1. **System Prompt**
   - Defines the role as an educational content creator
   - Specifies the format and structure for social stories
   - Includes guidelines for age-appropriate language

2. **User Prompt**
   - Combines the user's input parameters (topic, age group, etc.)
   - Structures the request for a coherent social story
   - Includes specific formatting instructions

3. **Generation Process**
   - The combined prompt is sent to the Ollama API
   - The LLM generates the story content
   - The response is parsed and formatted for display

4. **Story Structure**
   - Title: Clearly states the topic or skill
   - Introduction: Sets up the scenario
   - Body: 2-3 sections with headings that develop the story
   - Conclusion: Summarizes the learning points

## Development

### Adding New Features

To add new features to the application:

1. Create a new branch for your feature
2. Implement the feature in the appropriate files
3. Add any necessary dependencies to package.json
4. Test the feature thoroughly
5. Update the relevant documentation
6. Create a pull request to merge your changes

### Code Style

The project follows these coding standards:

- **JavaScript/React**:
  - Use modern ES6+ syntax
  - Follow React best practices
  - Use functional components with hooks
  - Document components with JSDoc comments

- **Node.js/Express**:
  - Use async/await for asynchronous operations
  - Implement proper error handling
  - Document API endpoints

## 📝 Practical Lessons for Developers

### 💯 Lesson 1: Prompt Engineering Is 80% of Success

**The Problem**: "I've integrated an LLM, but the results are inconsistent and often miss the mark for my specific use case."

**Solution Approach**: Invest heavily in prompt development, testing, and iteration. Create a systematic process for evaluating prompts against diverse use cases and user needs.

For StorySketch, I developed a prompt testing framework that evaluated outputs against educational criteria. Each prompt variant was tested against 20 different parameter combinations and scored based on adherence to educational standards, age-appropriateness, and structural consistency.

**Key Insight**: The quality difference between a good prompt and a great prompt is often larger than the quality difference between different LLM models.

### 🏡 Lesson 2: Local LLMs Are Production-Ready

**The Problem**: "Cloud APIs are expensive for my use case, but I'm concerned about the quality and reliability of local models."

**Solution Approach**: Modern local LLMs (especially those 7B+ parameters) are capable of production-quality results for many specialized applications. The key is matching the model to the specific domain needs.

For StorySketch, I found that Mistral 7B and Llama 3 8B models provided sufficient quality for educational content generation, while remaining runnable on consumer hardware. By fine-tuning the prompts specifically for these models' strengths, we achieved quality comparable to much larger cloud-based models.

**Key Insight**: The performance gap between local and cloud LLMs is closing rapidly, especially for specialized domain-specific applications.

### 👤 Lesson 3: Build for Non-Technical Users First

**The Problem**: "AI applications often intimidate users who don't understand the underlying technology."

**Solution Approach**: Design interfaces that abstract away technical complexity while giving users meaningful control over the parameters that matter for their use case.

StorySketch uses domain-specific language (e.g., "complexity level" instead of "temperature") and presents options in terms familiar to educators. The interface focuses on the educational parameters rather than exposing model details, making the application accessible to users without technical background.

**Key Insight**: The most successful AI applications hide the AI and foreground the domain-specific value proposition.

## 🚀 Deployment Instructions

Setting up StorySketch on your local machine is straightforward:

```bash
# Clone the repository
git clone https://github.com/shanojpillai/AI-Engineering-Mastery.git
cd AI-Engineering-Mastery/projects/02_storysketch

# Install dependencies
npm install

# Start Ollama (in a separate terminal)
ollama serve

# Pull a recommended model
ollama pull llama3:8b

# Start the application
npm start
```

Once running, the application will be available at http://localhost:3000, and the backend API will be accessible at http://localhost:5000/api.

For production deployment, I recommend using Docker Compose to manage both the application and Ollama:

```bash
# Start the full stack with Docker Compose
docker-compose up -d
```

## 🔧 Troubleshooting

### ⚠️ Common Issues

1. **Ollama Connection Issues**
   - Ensure Ollama is running (`ollama list` or check Docker container)
   - Verify the correct URL in the `.env` file
   - Check if port 11434 is accessible and not blocked by a firewall
   - Run the test script: `node quick-test-ollama.js`

2. **Frontend Build Errors**
   - For Node.js v20+, use `set NODE_OPTIONS=--openssl-legacy-provider` (Windows) or `export NODE_OPTIONS=--openssl-legacy-provider` (macOS/Linux)
   - Update React Scripts to a newer version if possible

3. **Port Conflicts**
   - If port 3000 is in use, allow React to use a different port when prompted
   - If port 5000 is in use, change the PORT in the backend `.env` file

4. **Story Generation Errors**
   - Check if the selected model is available in Ollama
   - Try a different model if generation is slow or failing
   - Ensure the prompt parameters are valid

### 💬 Getting Help

If you encounter issues not covered in this documentation:

1. Check the issue tracker on GitHub
2. Create a new issue with detailed information about the problem
3. Include error messages, steps to reproduce, and your environment details

## 📁 Repository Structure

This project is part of the AI-Engineering-Mastery repository, which contains multiple AI and machine learning projects. The StorySketch is located in the `projects/02_storysketch` directory.

The repository structure is as follows:

```
AI-Engineering-Mastery/
├── projects/                      # Directory containing all projects
│   ├── 01_finance_assistant/      # Finance Assistant project
│   ├── 02_storysketch/            # This project
│   └── ...                        # Additional projects (planned)
└── README.md                      # Main repository documentation
```

To access this project specifically, clone the repository and navigate to the project directory:

```bash
git clone https://github.com/shanojpillai/AI-Engineering-Mastery.git
cd AI-Engineering-Mastery/projects/02_storysketch
```

## 👨‍💻 Contributors and Acknowledgments

### 👤 Contributors

- **Shanoj Pillai** - Project Lead and Main Developer
- **AI Engineering Team** - Development and Documentation

### 🌟 Acknowledgments

- **React** - For the frontend framework
- **Express** - For the backend API framework
- **Ollama** - For making local LLM deployment accessible
- **Llama 3 / Mistral** - For the open-source LLM models
- **Open Source Community** - For the various libraries and tools that made this project possible

## 📃 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

© 2024 StorySketch Team. All rights reserved.
