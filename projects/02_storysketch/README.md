# StorySketch: LLM-Powered Social Story Generator for K-12 Learners

## Project Overview

StorySketch is an educational web application that leverages Large Language Models to generate personalized social stories for children, particularly those with developmental needs. The application allows educators and parents to input situations or skills, then uses LLM capabilities to generate age-appropriate, structured stories with accompanying images that help children understand social scenarios or develop specific skills.

The project follows an MVP (Minimum Viable Product) approach, with a simplified version that focuses on core functionality and can be quickly deployed and tested. The MVP uses locally running Ollama LLMs for story generation, with support for Docker-based deployment.

## Key Features

### LLM-Driven Story Engine
- Advanced prompt engineering to generate educational narratives
- Multi-step story generation with coherent progression
- Dynamic content adjustment based on age, complexity, and tone parameters
- Educational framework implementation through prompt design

### LLM-Guided Visualization System
- LLM creates detailed scene descriptions for image generation
- Character and setting consistency maintained across story
- Appropriate representation ensured through LLM guidance
- Image-text alignment verification

### User Story Management
- Save, categorize, and manage LLM-generated stories
- Edit capabilities with LLM assistance for story improvement
- LLM-suggested variations of existing stories
- Version history and comparison

### Export System
- LLM-optimized formatting for different export mediums
- PDF generation with print-appropriate layout
- Google Slides integration with presentation-optimized content
- Screen-friendly format for digital reading

## Technical Architecture

### Frontend
- React-based responsive interface with intuitive UX
- Story creation wizard that translates user inputs into effective LLM prompts
- Real-time preview of LLM-generated content with editing capabilities
- Dashboard for managing LLM-generated stories

### Backend
- Node.js/Express API server to handle LLM communication
- Prompt management system for different story types and educational needs
- Integration with image generation API (guided by LLM-created prompts)
- PostgreSQL database for user data and saved stories
- User authentication and story ownership management

### LLM Integration
- **Local LLM Integration**: Uses Ollama to run LLMs locally for privacy and cost-effectiveness
- **Docker Support**: Works with Ollama running in Docker containers
- **Multiple Model Support**: Compatible with various models like Llama 3, Mistral, and others
- **Sophisticated Prompt Engineering**: Carefully designed prompts for educational content generation
- **Custom Prompt Templates**: Implements evidence-based social story structure
- **Context Management System**: Maintains coherence across story steps
- **Parameter Control**: Adjusts age-appropriateness, tone, and complexity
- **Safety Filters**: Includes guardrails for generating child-appropriate content

> **Note**: See [Ollama Integration Guide](docs/ollama-integration.md) for details on setting up and using local LLMs, and [README-MVP.md](README-MVP.md) for the simplified Docker-ready version.

### Image Generation Pipeline
- LLM creates detailed image generation prompts based on story content
- Integration with Stable Diffusion or similar image generation API
- Image-text alignment verification by the LLM
- Age-appropriate style control and content filtering

## Project Structure

```
02_storysketch/
├── frontend/                  # React frontend application
│   ├── public/                # Static files
│   └── src/                   # Source code
│       ├── components/        # Reusable UI components
│       │   ├── Layout/        # Layout components
│       │   └── StoryWizard/   # Story creation wizard components
│       ├── pages/             # Page components
│       ├── services/          # API service integrations
│       ├── context/           # React context providers
│       └── App.js             # Main application component
│
├── backend/                   # Node.js/Express backend
│   ├── src/                   # Source code
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   ├── middleware/        # Express middleware
│   │   ├── config/            # Configuration files
│   │   └── server.js          # MVP simplified server
│   ├── tests/                 # Backend tests
│   └── data/                  # File storage for MVP version
│
├── docs/                      # Documentation
│   ├── setup-guide.md         # Detailed setup instructions
│   ├── ollama-integration.md  # Ollama integration guide
│   └── project-status.md      # Current project status
│
├── scripts/                   # Utility scripts
├── quick-test-ollama.js       # Script to test Ollama connection
└── README-MVP.md              # MVP version documentation
```

## Getting Started

### MVP Version

A simplified MVP version is available that focuses on core functionality and is easier to set up. The MVP:

- Uses file-based storage instead of a database
- Provides a single-page interface for story creation and viewing
- Runs entirely locally with Ollama integration
- Requires minimal configuration

For the MVP version, see [README-MVP.md](README-MVP.md) for setup instructions.

### Prerequisites

- Node.js (v14+)
- Ollama for local LLM integration
- For full version: PostgreSQL database
- (Optional) GPU for faster LLM inference

### Ollama Setup Options

#### Local Installation
- Download from [ollama.ai](https://ollama.ai/)
- Pull the required model: `ollama pull llama3`
- Ensure Ollama is running: `ollama serve`

#### Docker Installation
```bash
# Run Ollama in Docker
docker run -d -p 11434:11434 --name ollama ollama/ollama

# Pull a model in the container
docker exec -it ollama ollama pull llama3
```

### Quick Start (MVP Version)

1. **Clone the repository**
   ```bash
   git clone https://github.com/shanojpillai/AI-Engineering-Mastery.git
   cd AI-Engineering-Mastery/projects/02_storysketch
   ```

2. **Configure for Docker (if using Docker)**
   Edit the `.env` file in the backend directory:
   ```
   # For Docker on the same machine
   OLLAMA_API_URL=http://host.docker.internal:11434

   # Or use your Docker host's IP address
   # OLLAMA_API_URL=http://your-docker-ip:11434
   ```

3. **Test Ollama connection**
   ```bash
   node quick-test-ollama.js
   ```

4. **Start the backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

5. **Start the frontend**
   ```bash
   # In another terminal
   cd frontend
   npm install
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Full Version Setup

For the complete version with database integration and all features, see the [Setup Guide](docs/setup-guide.md) and [Ollama Integration Guide](docs/ollama-integration.md).

## Implementation Status

### Current Status

- **MVP Version**: Fully implemented with local Ollama integration
  - Single-page interface for story creation and viewing
  - File-based storage for stories
  - Docker support for Ollama integration
  - Basic story generation and management

- **Full Version**: In development
  - Backend API structure implemented
  - Authentication system implemented
  - Database models defined
  - Frontend components for story creation wizard created
  - Story management UI in progress

### Next Steps

1. Complete the database integration for persistent storage
2. Implement image generation capabilities
3. Add export functionality (PDF, Google Slides)
4. Enhance the UI with more interactive features
5. Add user profile management
6. Implement story sharing capabilities

## Development Roadmap

1. Define the LLM prompt engineering strategy for educational content ✅
2. Build the core LLM integration layer with appropriate context management ✅
3. Develop the story generation UI with real-time LLM feedback ✅
4. Implement the image generation pipeline with LLM-created prompts 🔄
5. Create user authentication and story management features 🔄
6. Develop export functionality with medium-specific optimization 📅

## License

*License information will be added.*

## Contributors

*Contributor information will be added.*
