/**
 * Authentication Controller
 * 
 * This controller handles user authentication operations.
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models');
const config = require('../config/config');

/**
 * Register a new user
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function register(req, res, next) {
  try {
    const { name, email, password, organization } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Create user
    const user = await User.create({
      id: uuidv4(),
      name,
      email,
      password, // Hashed in the model's beforeCreate hook
      organization,
      role: 'user', // Default role
      isActive: true,
      lastLogin: new Date()
    });
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );
    
    // Return user data (excluding password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization
    };
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    next(error);
  }
}

/**
 * Login a user
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive. Please contact support.'
      });
    }
    
    // Check password
    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Update last login time
    await user.update({ lastLogin: new Date() });
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );
    
    // Return user data (excluding password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization
    };
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    next(error);
  }
}

/**
 * Get current user profile
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getProfile(req, res, next) {
  try {
    // User is already attached to req by the authenticateToken middleware
    const user = req.user;
    
    // Return user data (excluding password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      preferences: user.preferences,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };
    
    res.status(200).json({
      success: true,
      data: {
        user: userData
      }
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    next(error);
  }
}

/**
 * Update user profile
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function updateProfile(req, res, next) {
  try {
    const { name, organization, preferences } = req.body;
    
    // User is already attached to req by the authenticateToken middleware
    const user = req.user;
    
    // Update user
    await user.update({
      name: name || user.name,
      organization: organization !== undefined ? organization : user.organization,
      preferences: preferences || user.preferences
    });
    
    // Return updated user data
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      preferences: user.preferences,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: userData
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    next(error);
  }
}

/**
 * Change user password
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }
    
    // User is already attached to req by the authenticateToken middleware
    const user = req.user;
    
    // Check current password
    const isPasswordValid = await user.isValidPassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    await user.update({ password: newPassword });
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    next(error);
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};
