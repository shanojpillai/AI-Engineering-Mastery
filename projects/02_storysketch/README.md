# StorySketch: LLM-Powered Social Story Generator for K-12 Learners

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Technical Stack](#technical-stack)
5. [Installation](#installation)
6. [Running the Application](#running-the-application)
7. [User Guide](#user-guide)
   - [Story Creation](#story-creation)
   - [Story Management](#story-management)
   - [Story Preview](#story-preview)
   - [Printing and Exporting](#printing-and-exporting)
8. [Ollama Integration](#ollama-integration)
   - [Supported Models](#supported-models)
   - [Docker Configuration](#docker-configuration)
9. [Story Generation Process](#story-generation-process)
10. [Development](#development)
11. [Troubleshooting](#troubleshooting)
12. [Project Status and Roadmap](#project-status-and-roadmap)
13. [Repository Structure](#repository-structure)
14. [Contributors and Acknowledgments](#contributors-and-acknowledgments)
15. [License](#license)

## Overview

StorySketch is an educational web application that leverages Large Language Models to generate personalized social stories for children, particularly those with developmental needs. The application allows educators and parents to input situations or skills, then uses LLM capabilities to generate age-appropriate, structured stories with accompanying images that help children understand social scenarios or develop specific skills.

Social stories are a valuable educational tool used by teachers, therapists, and parents to help children understand social situations, develop skills, and navigate challenging scenarios. StorySketch makes creating these stories quick and easy, with customizable parameters to match each child's specific needs.

The project follows an MVP (Minimum Viable Product) approach, with a simplified version that focuses on core functionality and can be quickly deployed and tested. The MVP uses locally running Ollama LLMs for story generation, with support for Docker-based deployment.

## Features

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

### MVP Features

- **Story Generation**: Create social stories with customizable parameters
- **Story Management**: Save and view generated stories
- **Print Functionality**: Print stories for classroom use
- **File-Based Storage**: Simple storage system with no authentication required
- **Local LLM Integration**: Complete privacy with locally running models

### Planned Full Version Features

- **Image Generation**: Automatically create illustrations for stories
- **User Authentication**: Secure login and user-specific story libraries
- **Database Storage**: Robust storage with search and filtering capabilities
- **Export Options**: Export to PDF, Google Slides, and other formats
- **Collaborative Editing**: Share and collaborate on stories with colleagues
- **Advanced Customization**: More detailed control over story elements

## Technical Stack

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

## Installation

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

## Running the Application

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

## Project Structure

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
├── quick-test-ollama.js       # Script to test Ollama connection
├── package.json               # Root package.json for dependencies
├── README.md                  # This file - main documentation
└── README-MVP.md              # MVP version documentation
```

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

## Troubleshooting

### Common Issues

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

### Getting Help

If you encounter issues not covered in this documentation:

1. Check the issue tracker on GitHub
2. Create a new issue with detailed information about the problem
3. Include error messages, steps to reproduce, and your environment details

## Project Status and Roadmap

### Current Status

The StorySketch project is currently in MVP (Minimum Viable Product) state with the following features implemented:

- **Core Functionality**:
  - Story generation with customizable parameters
  - Story management (save, view, delete)
  - Print functionality
  - Local LLM integration with Ollama
  - Docker support

- **Technical Implementation**:
  - React frontend with responsive design
  - Express backend with RESTful API
  - File-based storage system
  - Ollama integration for local LLM usage

### Development Roadmap

1. **MVP Phase** ✅
   - Define the LLM prompt engineering strategy for educational content ✅
   - Build the core LLM integration layer with Ollama ✅
   - Develop the story generation UI ✅
   - Implement basic story management ✅
   - Add print functionality ✅
   - Create Docker support ✅

2. **Enhancement Phase** 🔄
   - Implement image generation capabilities 🔄
   - Add user authentication and profiles 📅
   - Develop database storage 📅
   - Create advanced story management features 📅

3. **Full Version Phase** 📅
   - Add export functionality (PDF, Google Slides) 📅
   - Implement collaborative features 📅
   - Create a story library with templates 📅
   - Develop analytics and insights 📅

## Repository Structure

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

## Contributors and Acknowledgments

### Contributors

- **Shanoj Pillai** - Project Lead and Main Developer
- **AI Engineering Team** - Development and Documentation

### Acknowledgments

- **React** - For the frontend framework
- **Express** - For the backend API framework
- **Ollama** - For making local LLM deployment accessible
- **Llama 3 / Mistral** - For the open-source LLM models
- **Open Source Community** - For the various libraries and tools that made this project possible

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

© 2024 StorySketch Team. All rights reserved.
