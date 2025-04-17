import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import storyService from '../services/storyService';
import './StoryViewPage.css';

const StoryViewPage = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('read');
  
  // Fetch story data
  const { data: story, isLoading, isError, error } = useQuery(
    ['story', storyId],
    () => storyService.getStory(storyId),
    {
      refetchOnWindowFocus: false
    }
  );
  
  // Handle story deletion
  const handleDeleteStory = async () => {
    if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      try {
        await storyService.deleteStory(storyId);
        navigate('/stories');
      } catch (error) {
        console.error('Error deleting story:', error);
      }
    }
  };
  
  // Get image for a section
  const getImageForSection = (sectionId) => {
    if (!story || !story.images) return null;
    return story.images.find(img => img.sectionTitle === sectionId);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get age group label
  const getAgeGroupLabel = (ageGroup) => {
    switch (ageGroup) {
      case 'preschool': return 'Preschool (3-5)';
      case 'elementary': return 'Elementary (6-10)';
      case 'middle': return 'Middle School (11-13)';
      case 'high': return 'High School (14-18)';
      default: return ageGroup;
    }
  };
  
  // Get skill type label
  const getSkillTypeLabel = (skillType) => {
    switch (skillType) {
      case 'social': return 'Social Skills';
      case 'emotional': return 'Emotional Regulation';
      case 'behavioral': return 'Behavioral Skills';
      case 'academic': return 'Academic Skills';
      default: return skillType;
    }
  };
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading story...</p>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="error-container">
        <h2>Error Loading Story</h2>
        <p>{error.message || 'An error occurred while loading the story.'}</p>
        <div className="error-actions">
          <button onClick={() => navigate('/stories')} className="btn btn-primary">
            Back to Library
          </button>
        </div>
      </div>
    );
  }
  
  if (!story) {
    return (
      <div className="error-container">
        <h2>Story Not Found</h2>
        <p>The story you're looking for doesn't exist or has been deleted.</p>
        <div className="error-actions">
          <button onClick={() => navigate('/stories')} className="btn btn-primary">
            Back to Library
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="story-view-page">
      <div className="story-header">
        <div className="header-content">
          <div className="header-left">
            <Link to="/stories" className="back-link">
              ← Back to Library
            </Link>
            <h1>{story.title}</h1>
            <div className="story-meta">
              <span className="meta-item">
                <span className="meta-label">Age Group:</span>
                <span className="meta-value">{getAgeGroupLabel(story.ageGroup)}</span>
              </span>
              <span className="meta-item">
                <span className="meta-label">Skill Type:</span>
                <span className="meta-value">{getSkillTypeLabel(story.skillType)}</span>
              </span>
              <span className="meta-item">
                <span className="meta-label">Created:</span>
                <span className="meta-value">{formatDate(story.createdAt)}</span>
              </span>
            </div>
          </div>
          
          <div className="header-actions">
            <button className="btn btn-outline" onClick={handleDeleteStory}>
              Delete
            </button>
            <Link to={`/stories/${storyId}/edit`} className="btn btn-primary">
              Edit Story
            </Link>
          </div>
        </div>
        
        <div className="story-tabs">
          <button
            className={`tab-button ${activeTab === 'read' ? 'active' : ''}`}
            onClick={() => setActiveTab('read')}
          >
            Read
          </button>
          <button
            className={`tab-button ${activeTab === 'print' ? 'active' : ''}`}
            onClick={() => setActiveTab('print')}
          >
            Print View
          </button>
          <button
            className={`tab-button ${activeTab === 'export' ? 'active' : ''}`}
            onClick={() => setActiveTab('export')}
          >
            Export
          </button>
          <button
            className={`tab-button ${activeTab === 'versions' ? 'active' : ''}`}
            onClick={() => setActiveTab('versions')}
          >
            Versions
          </button>
        </div>
      </div>
      
      <div className="story-content">
        {activeTab === 'read' && (
          <div className="read-view">
            <div className="story-title-section">
              <h1>{story.title}</h1>
            </div>
            
            <div className="story-section">
              <h2>Introduction</h2>
              <div className="section-content">
                <div className="section-text">
                  <p>{story.content.introduction}</p>
                </div>
                {getImageForSection('introduction') && (
                  <div className="section-image">
                    <img
                      src={getImageForSection('introduction').imagePath}
                      alt="Introduction illustration"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {story.content.sections.map((section, index) => (
              <div key={index} className="story-section">
                <h2>{section.title}</h2>
                <div className="section-content">
                  <div className="section-text">
                    <p>{section.content}</p>
                  </div>
                  {getImageForSection(section.title) && (
                    <div className="section-image">
                      <img
                        src={getImageForSection(section.title).imagePath}
                        alt={`${section.title} illustration`}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="story-section">
              <h2>Conclusion</h2>
              <div className="section-content">
                <div className="section-text">
                  <p>{story.content.conclusion}</p>
                </div>
                {getImageForSection('conclusion') && (
                  <div className="section-image">
                    <img
                      src={getImageForSection('conclusion').imagePath}
                      alt="Conclusion illustration"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'print' && (
          <div className="print-view">
            <div className="print-header">
              <h2>Print View</h2>
              <button className="btn btn-primary" onClick={() => window.print()}>
                Print Story
              </button>
            </div>
            
            <div className="print-preview">
              <div className="print-title">
                <h1>{story.title}</h1>
              </div>
              
              <div className="print-section">
                <h2>Introduction</h2>
                <p>{story.content.introduction}</p>
                {getImageForSection('introduction') && (
                  <div className="print-image">
                    <img
                      src={getImageForSection('introduction').imagePath}
                      alt="Introduction illustration"
                    />
                  </div>
                )}
              </div>
              
              {story.content.sections.map((section, index) => (
                <div key={index} className="print-section">
                  <h2>{section.title}</h2>
                  <p>{section.content}</p>
                  {getImageForSection(section.title) && (
                    <div className="print-image">
                      <img
                        src={getImageForSection(section.title).imagePath}
                        alt={`${section.title} illustration`}
                      />
                    </div>
                  )}
                </div>
              ))}
              
              <div className="print-section">
                <h2>Conclusion</h2>
                <p>{story.content.conclusion}</p>
                {getImageForSection('conclusion') && (
                  <div className="print-image">
                    <img
                      src={getImageForSection('conclusion').imagePath}
                      alt="Conclusion illustration"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'export' && (
          <div className="export-view">
            <h2>Export Options</h2>
            <p>Choose a format to export your story:</p>
            
            <div className="export-options">
              <div className="export-option">
                <div className="export-icon">📄</div>
                <h3>PDF Document</h3>
                <p>Export as a PDF file for printing or sharing.</p>
                <button className="btn btn-primary">Export as PDF</button>
              </div>
              
              <div className="export-option">
                <div className="export-icon">🖼️</div>
                <h3>Google Slides</h3>
                <p>Create a presentation with one slide per section.</p>
                <button className="btn btn-primary">Export to Slides</button>
              </div>
              
              <div className="export-option">
                <div className="export-icon">📱</div>
                <h3>Digital Format</h3>
                <p>Optimized for viewing on screens and mobile devices.</p>
                <button className="btn btn-primary">Export Digital Version</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'versions' && (
          <div className="versions-view">
            <h2>Story Versions</h2>
            
            {story.versions && story.versions.length > 0 ? (
              <div className="versions-list">
                {story.versions.map((version) => (
                  <div key={version.id} className="version-item">
                    <div className="version-info">
                      <h3>Version {version.versionNumber}</h3>
                      <div className="version-meta">
                        <span className="version-date">
                          {formatDate(version.createdAt)}
                        </span>
                        {version.variationType && (
                          <span className="version-type">
                            {version.variationType.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      {version.changes && (
                        <div className="version-changes">
                          <p>{version.changes}</p>
                        </div>
                      )}
                    </div>
                    <div className="version-actions">
                      <button className="btn btn-outline">View</button>
                      <button className="btn btn-primary">Restore</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-versions">
                <p>No previous versions available for this story.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryViewPage;
