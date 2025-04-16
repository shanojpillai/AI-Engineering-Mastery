/**
 * User Controller
 * 
 * This controller handles user management operations.
 */

const { v4: uuidv4 } = require('uuid');
const { User } = require('../models');

/**
 * Get all users (admin only)
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getUsers(req, res, next) {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    
    // Build query conditions
    const conditions = {};
    
    if (role) {
      conditions.role = role;
    }
    
    if (search) {
      conditions[Sequelize.Op.or] = [
        { name: { [Sequelize.Op.iLike]: `%${search}%` } },
        { email: { [Sequelize.Op.iLike]: `%${search}%` } },
        { organization: { [Sequelize.Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Get users
    const { count, rows: users } = await User.findAndCountAll({
      where: conditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting users:', error);
    next(error);
  }
}

/**
 * Get a user by ID (admin only)
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getUser(req, res, next) {
  try {
    const { id } = req.params;
    
    // Get user
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Error getting user:', error);
    next(error);
  }
}

/**
 * Create a user (admin only)
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function createUser(req, res, next) {
  try {
    const { name, email, password, role, organization } = req.body;
    
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
      role: role || 'user',
      organization,
      isActive: true
    });
    
    // Return user data (excluding password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      createdAt: user.createdAt
    };
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: userData }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    next(error);
  }
}

/**
 * Update a user (admin only)
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, role, organization, isActive } = req.body;
    
    // Get user
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update user
    await user.update({
      name: name || user.name,
      email: email || user.email,
      role: role || user.role,
      organization: organization !== undefined ? organization : user.organization,
      isActive: isActive !== undefined ? isActive : user.isActive
    });
    
    // Return updated user data
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      isActive: user.isActive,
      updatedAt: user.updatedAt
    };
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user: userData }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    next(error);
  }
}

/**
 * Reset user password (admin only)
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function resetPassword(req, res, next) {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    // Validate required fields
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password is required'
      });
    }
    
    // Get user
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update password
    await user.update({ password: newPassword });
    
    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    next(error);
  }
}

/**
 * Delete a user (admin only)
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    
    // Get user
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Delete user (soft delete)
    await user.destroy();
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  resetPassword,
  deleteUser
};
