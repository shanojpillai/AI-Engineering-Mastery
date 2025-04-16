/**
 * User Routes
 * 
 * This module defines the routes for user management operations.
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, checkRole } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(checkRole('admin'));

// User management routes
router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.post('/:id/reset-password', userController.resetPassword);
router.delete('/:id', userController.deleteUser);

module.exports = router;
