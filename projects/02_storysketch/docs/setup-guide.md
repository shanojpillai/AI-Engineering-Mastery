# StorySketch Setup Guide

This guide provides detailed instructions for setting up the StorySketch application for development or production use.

## Development Environment Setup

### System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Node.js**: v16.0.0 or higher
- **PostgreSQL**: v12.0 or higher
- **Ollama**: Latest version
- **Storage**: At least 10GB free space (for code, dependencies, and LLM models)
- **RAM**: Minimum 8GB, recommended 16GB+ (especially for larger LLM models)
- **GPU**: Optional but recommended for faster LLM inference

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/storysketch.git
cd storysketch
```

### Step 2: Set Up the Backend

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your specific configuration:
   - Database credentials
   - JWT secret
   - LLM settings (if using a different model)
   - Image generation API key (if using)

3. **Set up the database**:
   ```bash
   # Create the database
   createdb storysketch
   
   # Once migrations are implemented:
   npm run migrate
   ```

### Step 3: Set Up Ollama

1. **Install Ollama**:
   - Windows/macOS: Download from [ollama.ai](https://ollama.ai/)
   - Linux: Follow the instructions on the Ollama website
   - Docker: `docker pull ollama/ollama`

2. **Pull the required model**:
   ```bash
   ollama pull llama3
   ```

3. **Start Ollama**:
   ```bash
   # Direct installation
   ollama serve
   
   # Docker
   docker run -d -p 11434:11434 ollama/ollama
   ```

4. **Test the Ollama integration**:
   ```bash
   # From the backend directory
   node src/test-ollama.js
   ```

### Step 4: Set Up the Frontend

1. **Install dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

2. **Configure the frontend** (if needed):
   - The frontend is pre-configured to connect to the backend at `http://localhost:5000`
   - If your backend is at a different URL, update the `proxy` field in `package.json`

### Step 5: Start the Development Servers

1. **Start the backend server**:
   ```bash
   # From the backend directory
   npm run dev
   ```

2. **Start the frontend development server**:
   ```bash
   # From the frontend directory
   npm start
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/health (health check endpoint)

## Production Deployment

For production deployment, additional steps are recommended:

### Backend Deployment

1. **Build the backend**:
   ```bash
   cd backend
   npm run build
   ```

2. **Set up environment variables** for production:
   - Use a strong JWT secret
   - Configure database connection pooling
   - Set NODE_ENV=production

3. **Start the server**:
   ```bash
   npm start
   ```

   Or use a process manager like PM2:
   ```bash
   pm2 start npm --name "storysketch-backend" -- start
   ```

### Frontend Deployment

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Serve the static files**:
   - Use a web server like Nginx or Apache
   - Or deploy to a static hosting service

### Database Considerations

- Set up proper database backups
- Consider using a managed PostgreSQL service
- Implement database connection pooling

### Ollama in Production

For production use of Ollama:

1. **Dedicated server** with sufficient resources
2. **GPU acceleration** for better performance
3. **Security considerations**:
   - Run behind a reverse proxy
   - Implement proper authentication
   - Consider network isolation

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure the database exists

2. **Ollama Connection Issues**:
   - Verify Ollama is running (`ollama list` should work)
   - Check that port 11434 is accessible
   - Ensure the model is pulled (`ollama pull llama3`)

3. **Node.js Version Conflicts**:
   - Use nvm (Node Version Manager) to switch to a compatible version

4. **Out of Memory Errors with LLM**:
   - Try a smaller model
   - Increase system RAM
   - Add swap space

## Additional Resources

- [Ollama Integration Guide](ollama-integration.md) - Detailed information about the Ollama LLM integration
- [API Documentation](api-docs.md) - Backend API reference
- [Contributing Guide](contributing.md) - Guidelines for contributing to the project
