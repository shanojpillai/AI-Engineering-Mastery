/**
 * Authentication Middleware
 * 
 * This middleware handles JWT authentication for protected routes.
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/config');

/**
 * Authenticate JWT token middleware
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    // Verify the token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Find the user
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. User account is inactive.'
      });
    }
    
    // Add user to request object
    req.user = user;
    
    // Update last login time
    await user.update({ lastLogin: new Date() });
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

/**
 * Check if user has required role
 * 
 * @param {string|string[]} roles - Required role(s)
 * @returns {Function} - Express middleware function
 */
const checkRole = (roles) => {
  return (req, res, next) => {
    // Convert roles to array if it's a string
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    // Check if user has required role
    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    
    next();
  };
};

module.exports = {
  authenticateToken,
  checkRole
};
