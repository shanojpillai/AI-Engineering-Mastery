import React, { useState } from 'react';
import './ImageGenerator.css';

/**
 * Image Generator Component
 * 
 * Allows users to generate images for story sections
 * 
 * @param {Object} props - Component props
 * @param {Object} props.story - Generated story content
 * @param {Array} props.images - Generated images
 * @param {Function} props.onGenerateImage - Handler for generating images
 * @param {Function} props.onNext - Handler for moving to the next step
 * @param {Function} props.onBack - Handler for moving to the previous step
 * @param {boolean} props.loading - Loading state
 */
const ImageGenerator = ({ story, images, onGenerateImage, onNext, onBack, loading }) => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('cartoon');
  
  // Get all sections from the story
  const getAllSections = () => {
    const sections = [];
    
    sections.push({
      id: 'introduction',
      title: 'Introduction',
      content: story.introduction
    });
    
    story.sections.forEach(section => {
      sections.push({
        id: section.title,
        title: section.title,
        content: section.content
      });
    });
    
    sections.push({
      id: 'conclusion',
      title: 'Conclusion',
      content: story.conclusion
    });
    
    return sections;
  };
  
  // Check if a section already has an image
  const hasImage = (sectionId) => {
    return images.some(img => img.sectionTitle === sectionId);
  };
  
  // Get image for a section
  const getImage = (sectionId) => {
    return images.find(img => img.sectionTitle === sectionId);
  };
  
  // Handle section selection
  const handleSelectSection = (section) => {
    setSelectedSection(section);
  };
  
  // Handle image generation
  const handleGenerateImage = () => {
    if (!selectedSection) return;
    
    onGenerateImage(selectedSection.id, selectedStyle);
  };
  
  const sections = getAllSections();
  
  return (
    <div className="image-generator-container">
      <div className="generator-header">
        <h2>Add Images to Your Story</h2>
        <p>Generate images for different sections of your story to make it more engaging.</p>
      </div>
      
      <div className="generator-content">
        <div className="sections-panel">
          <h3>Story Sections</h3>
          <div className="sections-list">
            {sections.map((section) => (
              <div 
                key={section.id}
                className={`section-item ${selectedSection?.id === section.id ? 'selected' : ''} ${hasImage(section.id) ? 'has-image' : ''}`}
                onClick={() => handleSelectSection(section)}
              >
                <div className="section-title">{section.title}</div>
                {hasImage(section.id) && <div className="image-indicator">🖼️</div>}
              </div>
            ))}
          </div>
        </div>
        
        <div className="image-panel">
          {selectedSection ? (
            <>
              <h3>Generate Image for "{selectedSection.title}"</h3>
              
              {hasImage(selectedSection.id) ? (
                <div className="image-preview">
                  <img 
                    src={getImage(selectedSection.id).imageUrl} 
                    alt={`Illustration for ${selectedSection.title}`} 
                  />
                  <div className="image-info">
                    <p><strong>Style:</strong> {getImage(selectedSection.id).style}</p>
                    <p><strong>Prompt:</strong> {getImage(selectedSection.id).prompt}</p>
                  </div>
                </div>
              ) : (
                <div className="image-generator-form">
                  <div className="section-preview">
                    <h4>Section Content:</h4>
                    <p>{selectedSection.content}</p>
                  </div>
                  
                  <div className="style-selector">
                    <label htmlFor="imageStyle">Image Style:</label>
                    <select 
                      id="imageStyle" 
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      disabled={loading}
                    >
                      <option value="cartoon">Cartoon</option>
                      <option value="realistic">Realistic</option>
                      <option value="watercolor">Watercolor</option>
                      <option value="sketch">Sketch</option>
                    </select>
                  </div>
                  
                  <button
                    className="btn btn-primary"
                    onClick={handleGenerateImage}
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : 'Generate Image'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-selection">
              <p>Select a section to generate an image</p>
            </div>
          )}
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
          onClick={onNext}
          disabled={loading}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
};

export default ImageGenerator;
