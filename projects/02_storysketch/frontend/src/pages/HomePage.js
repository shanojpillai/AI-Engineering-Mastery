import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Create Engaging Social Stories for K-12 Learners</h1>
          <p className="hero-subtitle">
            StorySketch helps educators and parents create personalized social stories
            with AI-powered content and illustrations.
          </p>
          
          {isAuthenticated ? (
            <Link to="/stories/create" className="btn btn-primary btn-lg">
              Create a Story
            </Link>
          ) : (
            <div className="hero-buttons">
              <Link to="/login" className="btn btn-primary btn-lg">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                Create Account
              </Link>
            </div>
          )}
        </div>
        
        <div className="hero-image">
          <img src="/images/hero-illustration.svg" alt="StorySketch illustration" />
        </div>
      </div>
      
      <div className="features-section">
        <h2>Why Choose StorySketch?</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>AI-Powered Story Generation</h3>
            <p>
              Create personalized social stories in minutes using advanced AI
              that follows evidence-based practices.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🖼️</div>
            <h3>Automatic Illustrations</h3>
            <p>
              Generate age-appropriate illustrations for each section of your story
              to enhance engagement and understanding.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Developmentally Appropriate</h3>
            <p>
              Customize content for different age groups and developmental needs
              with adjustable complexity and language.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Multiple Export Options</h3>
            <p>
              Export your stories as PDFs, Google Slides presentations, or
              digital formats for easy sharing and use.
            </p>
          </div>
        </div>
      </div>
      
      <div className="how-it-works-section">
        <h2>How It Works</h2>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Enter Story Details</h3>
            <p>
              Specify the topic, age group, and other parameters for your social story.
            </p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Review & Edit Content</h3>
            <p>
              Our AI generates a structured story that you can review and refine.
            </p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Add Illustrations</h3>
            <p>
              Generate custom illustrations for each section of your story.
            </p>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <h3>Export & Share</h3>
            <p>
              Save your story and export it in your preferred format.
            </p>
          </div>
        </div>
      </div>
      
      <div className="cta-section">
        <h2>Ready to Create Your First Story?</h2>
        <p>
          Join educators and parents who are using StorySketch to create
          engaging social stories for children.
        </p>
        
        {isAuthenticated ? (
          <Link to="/stories/create" className="btn btn-primary btn-lg">
            Create a Story
          </Link>
        ) : (
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started for Free
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomePage;
