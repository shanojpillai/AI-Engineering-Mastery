# StorySketch: LLM-Powered Social Story Generator for K-12 Learners

## Project Overview

StorySketch is an educational web application that leverages Large Language Models to generate personalized social stories for children, particularly those with developmental needs. The application allows educators and parents to input situations or skills, then uses LLM capabilities to generate age-appropriate, structured stories with accompanying images that help children understand social scenarios or develop specific skills.

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
- **Multiple Model Support**: Compatible with various models like Llama 3, Mistral, and others
- **Sophisticated Prompt Engineering**: Carefully designed prompts for educational content generation
- **Custom Prompt Templates**: Implements evidence-based social story structure
- **Context Management System**: Maintains coherence across story steps
- **Parameter Control**: Adjusts age-appropriateness, tone, and complexity
- **Safety Filters**: Includes guardrails for generating child-appropriate content

> **Note**: See [Ollama Integration Guide](docs/ollama-integration.md) for details on setting up and using local LLMs.

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
│       ├── pages/             # Page components
│       ├── services/          # API service integrations
│       ├── utils/             # Utility functions
│       ├── assets/            # Images, fonts, etc.
│       ├── hooks/             # Custom React hooks
│       └── context/           # React context providers
│
├── backend/                   # Node.js/Express backend
│   ├── src/                   # Source code
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   ├── middleware/        # Express middleware
│   │   └── config/            # Configuration files
│   └── tests/                 # Backend tests
│
├── docs/                      # Documentation
└── scripts/                   # Utility scripts
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL database
- Ollama for local LLM integration
- (Optional) GPU for faster LLM inference

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/storysketch.git
   cd storysketch
   ```

2. **Install Ollama**
   - Download from [ollama.ai](https://ollama.ai/)
   - Pull the required model: `ollama pull llama3`
   - Ensure Ollama is running: `ollama serve`

3. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb storysketch
   # Run migrations (once implemented)
   npm run migrate
   ```

5. **Test Ollama integration**
   ```bash
   node src/test-ollama.js
   ```

6. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

7. **Start the development servers**
   ```bash
   # In one terminal (backend)
   cd backend
   npm run dev

   # In another terminal (frontend)
   cd frontend
   npm start
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

For more detailed instructions, see the [Setup Guide](docs/setup-guide.md) and [Ollama Integration Guide](docs/ollama-integration.md).

## Development Roadmap

1. Define the LLM prompt engineering strategy for educational content
2. Build the core LLM integration layer with appropriate context management
3. Develop the story generation UI with real-time LLM feedback
4. Implement the image generation pipeline with LLM-created prompts
5. Create user authentication and story management features
6. Develop export functionality with medium-specific optimization

## License

*License information will be added.*

## Contributors

*Contributor information will be added.*
