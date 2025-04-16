import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          // Set default auth header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch user profile
          const response = await axios.get('/api/auth/profile');
          setUser(response.data.data.user);
        } catch (error) {
          console.error('Error initializing auth:', error);
          // If token is invalid, clear it
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
          setError(error.response?.data?.message || 'Authentication failed');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  // Register a new user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/auth/register', userData);
      
      const { token, user } = response.data.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Set token and user in state
      setToken(token);
      setUser(user);
      
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Login a user
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/auth/login', credentials);
      
      const { token, user } = response.data.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Set token and user in state
      setToken(token);
      setUser(user);
      
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout a user
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Clear token and user from state
    setToken(null);
    setUser(null);
    
    // Remove default auth header
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put('/api/auth/profile', profileData);
      
      // Update user in state
      setUser(response.data.data.user);
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.response?.data?.message || 'Profile update failed');
      return { success: false, error: error.response?.data?.message || 'Profile update failed' };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.post('/api/auth/change-password', passwordData);
      
      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      setError(error.response?.data?.message || 'Password change failed');
      return { success: false, error: error.response?.data?.message || 'Password change failed' };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isEducator: user?.role === 'educator' || user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
