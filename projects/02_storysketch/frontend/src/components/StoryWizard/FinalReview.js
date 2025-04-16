import React from 'react';
import './FinalReview.css';

/**
 * Final Review Component
 * 
 * Displays a final review of the story and images before saving
 * 
 * @param {Object} props - Component props
 * @param {Object} props.story - Generated story content
 * @param {Array} props.images - Generated images
 * @param {Function} props.onSave - Handler for saving the story
 * @param {Function} props.onBack - Handler for moving to the previous step
 * @param {boolean} props.loading - Loading state
 */
const FinalReview = ({ story, images, onSave, onBack, loading }) => {
  // Get image for a section
  const getImageForSection = (sectionId) => {
    return images.find(img => img.sectionTitle === sectionId);
  };
  
  return (
    <div className="final-review-container">
      <div className="review-header">
        <h2>Review Your Story</h2>
        <p>Review your story and images before saving.</p>
      </div>
      
      <div className="story-preview">
        <div className="story-title">
          <h1>{story.title}</h1>
        </div>
        
        <div className="story-section">
          <h3>Introduction</h3>
          <div className="section-content">
            <p>{story.introduction}</p>
            {getImageForSection('introduction') && (
              <div className="section-image">
                <img 
                  src={getImageForSection('introduction').imageUrl} 
                  alt="Introduction illustration" 
                />
              </div>
            )}
          </div>
        </div>
        
        {story.sections.map((section, index) => (
          <div key={index} className="story-section">
            <h3>{section.title}</h3>
            <div className="section-content">
              <p>{section.content}</p>
              {getImageForSection(section.title) && (
                <div className="section-image">
                  <img 
                    src={getImageForSection(section.title).imageUrl} 
                    alt={`${section.title} illustration`} 
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div className="story-section">
          <h3>Conclusion</h3>
          <div className="section-content">
            <p>{story.conclusion}</p>
            {getImageForSection('conclusion') && (
              <div className="section-image">
                <img 
                  src={getImageForSection('conclusion').imageUrl} 
                  alt="Conclusion illustration" 
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="story-summary">
        <h3>Story Summary</h3>
        <div className="summary-details">
          <div className="summary-item">
            <span className="summary-label">Title:</span>
            <span className="summary-value">{story.title}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Sections:</span>
            <span className="summary-value">{story.sections.length + 2}</span> {/* +2 for intro and conclusion */}
          </div>
          <div className="summary-item">
            <span className="summary-label">Images:</span>
            <span className="summary-value">{images.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Age Group:</span>
            <span className="summary-value">
              {story.ageGroup === 'preschool' ? 'Preschool (3-5 years)' :
               story.ageGroup === 'elementary' ? 'Elementary (6-10 years)' :
               story.ageGroup === 'middle' ? 'Middle School (11-13 years)' :
               'High School (14-18 years)'}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Skill Type:</span>
            <span className="summary-value">
              {story.skillType === 'social' ? 'Social Skills' :
               story.skillType === 'emotional' ? 'Emotional Regulation' :
               story.skillType === 'behavioral' ? 'Behavioral Skills' :
               story.skillType === 'academic' ? 'Academic Skills' : 'Other'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="navigation-buttons">
        <button
          className="btn btn-outline"
          onClick={onBack}
          disabled={loading}
        >
          Back
        </button>
        <button
          className="btn btn-primary"
          onClick={onSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Story'}
        </button>
      </div>
    </div>
  );
};

export default FinalReview;
