const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const storyRoutes = require('./routes/story.routes');
const userRoutes = require('./routes/user.routes');
const llmRoutes = require('./routes/llm.routes');
const imageRoutes = require('./routes/image.routes');
const exportRoutes = require('./routes/export.routes');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

// Initialize Express app
const app = express();

// Set up middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // HTTP request logger
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/stories', authenticateToken, storyRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/llm', authenticateToken, llmRoutes);
app.use('/api/images', authenticateToken, imageRoutes);
app.use('/api/export', authenticateToken, exportRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // In production, you might want to exit the process and let a process manager restart it
  // process.exit(1);
});

module.exports = app; // Export for testing
