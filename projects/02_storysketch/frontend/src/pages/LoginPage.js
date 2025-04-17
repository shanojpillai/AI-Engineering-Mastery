import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  
  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';
  
  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError(null);
      const result = await login(values);
      
      if (result.success) {
        // Redirect to the page they tried to visit or home
        navigate(from, { replace: true });
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to StorySketch</p>
        </div>
        
        {error && (
          <div className="auth-error">
            <p>{error}</p>
          </div>
        )}
        
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="form-control"
                />
                <ErrorMessage name="email" component="div" className="form-error" />
              </div>
              
              <div className="form-group">
                <div className="password-label-row">
                  <label htmlFor="password">Password</label>
                  <Link to="/forgot-password" className="forgot-password">
                    Forgot Password?
                  </Link>
                </div>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="form-control"
                />
                <ErrorMessage name="password" component="div" className="form-error" />
              </div>
              
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </Form>
          )}
        </Formik>
        
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      
      <div className="auth-info">
        <div className="info-content">
          <h2>Create Engaging Social Stories</h2>
          <p>
            StorySketch helps educators and parents create personalized social stories
            with AI-powered content and illustrations.
          </p>
          <ul className="feature-list">
            <li>Generate age-appropriate content</li>
            <li>Create custom illustrations</li>
            <li>Export in multiple formats</li>
            <li>Save and share your stories</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
