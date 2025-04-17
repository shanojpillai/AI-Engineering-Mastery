import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

// Validation schema
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  organization: Yup.string()
    .max(100, 'Organization name is too long'),
  agreeTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
});

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  
  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError(null);
      
      // Remove confirmPassword and agreeTerms from the data sent to the API
      const { confirmPassword, agreeTerms, ...userData } = values;
      
      const result = await register(userData);
      
      if (result.success) {
        // Redirect to the home page or onboarding
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create an Account</h1>
          <p>Join StorySketch to create engaging social stories</p>
        </div>
        
        {error && (
          <div className="auth-error">
            <p>{error}</p>
          </div>
        )}
        
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            organization: '',
            agreeTerms: false
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  className="form-control"
                />
                <ErrorMessage name="name" component="div" className="form-error" />
              </div>
              
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
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  className="form-control"
                />
                <ErrorMessage name="password" component="div" className="form-error" />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className="form-control"
                />
                <ErrorMessage name="confirmPassword" component="div" className="form-error" />
              </div>
              
              <div className="form-group">
                <label htmlFor="organization">Organization (Optional)</label>
                <Field
                  type="text"
                  id="organization"
                  name="organization"
                  placeholder="School, clinic, or organization name"
                  className="form-control"
                />
                <ErrorMessage name="organization" component="div" className="form-error" />
              </div>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <Field
                    type="checkbox"
                    name="agreeTerms"
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">
                    I agree to the{' '}
                    <Link to="/terms" className="auth-link">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="auth-link">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                <ErrorMessage name="agreeTerms" component="div" className="form-error" />
              </div>
              
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </Form>
          )}
        </Formik>
        
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign In
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

export default RegisterPage;
