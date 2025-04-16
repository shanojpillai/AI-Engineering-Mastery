import React, { useState } from 'react';
import './StoryPreview.css';

/**
 * Story Preview Component
 * 
 * Displays a preview of the generated story with editing capabilities
 * 
 * @param {Object} props - Component props
 * @param {Object} props.story - Generated story content
 * @param {Function} props.onRefine - Handler for refining the story
 * @param {Function} props.onNext - Handler for moving to the next step
 * @param {Function} props.onBack - Handler for moving to the previous step
 * @param {boolean} props.loading - Loading state
 */
const StoryPreview = ({ story, onRefine, onNext, onBack, loading }) => {
  const [editMode, setEditMode] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [feedback, setFeedback] = useState('');
  
  // Handle section selection for editing
  const handleSectionSelect = (section) => {
    setSelectedSection(section);
    setEditMode(true);
    setFeedback('');
  };
  
  // Handle feedback submission
  const handleSubmitFeedback = () => {
    if (!feedback.trim()) {
      return;
    }
    
    onRefine(feedback, selectedSection);
    setEditMode(false);
    setFeedback('');
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditMode(false);
    setSelectedSection(null);
    setFeedback('');
  };
  
  // Get section content
  const getSectionContent = (section) => {
    if (section === 'title') {
      return story.title;
    } else if (section === 'introduction') {
      return story.introduction;
    } else if (section === 'conclusion') {
      return story.conclusion;
    } else {
      const sectionObj = story.sections.find(s => s.title === section);
      return sectionObj ? sectionObj.content : '';
    }
  };
  
  if (!story) {
    return <div className="loading">Loading story...</div>;
  }
  
  return (
    <div className="story-preview-container">
      <div className="preview-header">
        <h2>Story Preview</h2>
        {!editMode && (
          <div className="preview-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => handleSectionSelect('general')}
              disabled={loading}
            >
              Edit Entire Story
            </button>
          </div>
        )}
      </div>
      
      {editMode ? (
        <div className="edit-panel">
          <h3>
            {selectedSection === 'general' 
              ? 'Edit Entire Story' 
              : `Edit ${selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}`}
          </h3>
          
          {selectedSection !== 'general' && (
            <div className="current-content">
              <h4>Current Content:</h4>
              <div className="content-preview">
                {getSectionContent(selectedSection)}
              </div>
            </div>
          )}
          
          <div className="feedback-form">
            <label htmlFor="feedback">
              {selectedSection === 'general' 
                ? 'Provide feedback for the entire story:' 
                : 'Provide feedback for this section:'}
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={
                selectedSection === 'general'
                  ? "Example: 'Make the story more engaging and add more details about sharing.'"
                  : "Example: 'Simplify the language and add an example of turn-taking.'"
              }
              rows="5"
              disabled={loading}
            />
            
            <div className="edit-actions">
              <button
                className="btn btn-primary"
                onClick={handleSubmitFeedback}
                disabled={!feedback.trim() || loading}
              >
                {loading ? 'Updating...' : 'Update Story'}
              </button>
              <button
                className="btn btn-outline"
                onClick={handleCancelEdit}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="story-content">
          <div className="story-section title-section" onClick={() => handleSectionSelect('title')}>
            <h1>{story.title}</h1>
            <div className="edit-icon" title="Edit Title">✏️</div>
          </div>
          
          <div className="story-section" onClick={() => handleSectionSelect('introduction')}>
            <h3>Introduction</h3>
            <p>{story.introduction}</p>
            <div className="edit-icon" title="Edit Introduction">✏️</div>
          </div>
          
          {story.sections.map((section, index) => (
            <div 
              key={index} 
              className="story-section"
              onClick={() => handleSectionSelect(section.title)}
            >
              <h3>{section.title}</h3>
              <p>{section.content}</p>
              <div className="edit-icon" title={`Edit ${section.title}`}>✏️</div>
            </div>
          ))}
          
          <div className="story-section" onClick={() => handleSectionSelect('conclusion')}>
            <h3>Conclusion</h3>
            <p>{story.conclusion}</p>
            <div className="edit-icon" title="Edit Conclusion">✏️</div>
          </div>
        </div>
      )}
      
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
          onClick={onNext}
          disabled={loading || editMode}
        >
          Continue to Images
        </button>
      </div>
    </div>
  );
};

export default StoryPreview;
