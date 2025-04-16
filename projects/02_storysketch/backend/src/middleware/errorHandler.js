/**
 * Error Handler Middleware
 * 
 * This middleware handles errors in the application.
 */

/**
 * Error handler middleware
 * 
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  console.error('Error:', err);
  
  // Default error status and message
  let statusCode = 500;
  let message = 'Internal server error';
  let errors = null;
  
  // Handle specific error types
  if (err.name === 'SequelizeValidationError') {
    // Sequelize validation error
    statusCode = 400;
    message = 'Validation error';
    errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    // Sequelize unique constraint error
    statusCode = 409;
    message = 'Duplicate entry';
    errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
  } else if (err.name === 'JsonWebTokenError') {
    // JWT error
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    // JWT expired error
    statusCode = 401;
    message = 'Token expired';
  } else if (err.statusCode) {
    // Custom error with status code
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.message) {
    // Error with message
    message = err.message;
  }
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

/**
 * Not found middleware
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Not found - ${req.originalUrl}`
  });
};

module.exports = {
  errorHandler,
  notFound
};
