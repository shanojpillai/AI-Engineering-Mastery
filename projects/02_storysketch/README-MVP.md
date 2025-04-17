# StorySketch MVP

A simplified version of StorySketch that generates social stories for K-12 learners using locally running Ollama LLMs.

## Features

- Generate social stories with customizable parameters
- Save and view generated stories
- Print stories for classroom use
- No authentication required - simple file-based storage
- Runs completely locally using Ollama

## Prerequisites

1. **Node.js** (v14 or higher)
2. **Ollama** installed and running
3. At least one LLM model pulled in Ollama (recommended: `llama3`)

## Quick Start

### 1. Install Ollama

First, make sure Ollama is installed on your system:

- **Windows/macOS**: Download from [ollama.ai](https://ollama.ai/)
- **Linux**: Follow the instructions on the Ollama website

### 2. Pull a Model

Pull at least one model to use with StorySketch:

```bash
ollama pull llama3
```

Other models that work well:
- `mistral`
- `llama2`
- `phi`

### 3. Start Ollama

Make sure Ollama is running:

```bash
ollama serve
```

### 4. Test Ollama Connection

Run the quick test script to verify Ollama is working:

```bash
cd projects/02_storysketch
node quick-test-ollama.js
```

You should see a success message and a sample story generation.

### 5. Start the Backend

```bash
cd projects/02_storysketch/backend
npm install
npm run dev
```

The backend will start on http://localhost:5000

### 6. Start the Frontend

In a new terminal:

```bash
cd projects/02_storysketch/frontend
npm install
npm start
```

The frontend will start on http://localhost:3000

## Usage

1. Open http://localhost:3000 in your browser
2. Verify that Ollama is connected (green status indicator)
3. Fill out the story form with your desired parameters
4. Click "Generate Story" to create a new story
5. View your story in the preview panel
6. Use the "Print Story" button to print or save as PDF

## Folder Structure

```
projects/02_storysketch/
├── backend/                # Backend server
│   ├── data/               # Story data storage
│   ├── src/                # Source code
│   │   └── server.js       # Express server
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   │   └── SimplifiedApp.js  # Main app component
│   │   └── App.js          # Root component
│   └── package.json        # Frontend dependencies
├── quick-test-ollama.js    # Ollama test script
└── README-MVP.md           # This file
```

## Troubleshooting

### Ollama Connection Issues

- Make sure Ollama is running with `ollama serve`
- Verify you have pulled at least one model with `ollama list`
- Check that port 11434 is accessible

### Story Generation Issues

- Try a different model if generation is slow or low quality
- Reduce complexity for faster generation
- Check the browser console for any error messages

## Next Steps

After testing the MVP, you might want to:

1. Add user authentication
2. Implement database storage
3. Add image generation capabilities
4. Create export options for different formats
5. Implement more advanced story editing features

## License

This project is licensed under the MIT License.
