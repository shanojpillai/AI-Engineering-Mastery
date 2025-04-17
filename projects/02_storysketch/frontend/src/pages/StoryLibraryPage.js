import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import storyService from '../services/storyService';
import './StoryLibraryPage.css';

const StoryLibraryPage = () => {
  // State for filters
  const [filters, setFilters] = useState({
    ageGroup: '',
    skillType: '',
    search: '',
    page: 1
  });
  
  // Fetch stories with the current filters
  const { data, isLoading, isError, error, refetch } = useQuery(
    ['stories', filters],
    () => storyService.getStories(filters),
    {
      keepPreviousData: true,
      staleTime: 5000
    }
  );
  
  // Reset page when other filters change
  useEffect(() => {
    const { page, ...otherFilters } = filters;
    return () => {
      setFilters({ ...otherFilters, page: 1 });
    };
  }, [filters.ageGroup, filters.skillType, filters.search]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  
  // Handle search input
  const handleSearch = (e) => {
    e.preventDefault();
    const searchInput = e.target.elements.searchInput.value;
    setFilters({ ...filters, search: searchInput, page: 1 });
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };
  
  // Handle story deletion
  const handleDeleteStory = async (id) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await storyService.deleteStory(id);
        refetch();
      } catch (error) {
        console.error('Error deleting story:', error);
      }
    }
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
  
  return (
    <div className="story-library-page">
      <div className="library-header">
        <div className="header-content">
          <h1>My Stories</h1>
          <Link to="/stories/create" className="btn btn-primary">
            Create New Story
          </Link>
        </div>
        
        <div className="library-filters">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              name="searchInput"
              placeholder="Search stories..."
              className="search-input"
              defaultValue={filters.search}
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
          
          <div className="filter-controls">
            <select
              name="ageGroup"
              value={filters.ageGroup}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Age Groups</option>
              <option value="preschool">Preschool (3-5)</option>
              <option value="elementary">Elementary (6-10)</option>
              <option value="middle">Middle School (11-13)</option>
              <option value="high">High School (14-18)</option>
            </select>
            
            <select
              name="skillType"
              value={filters.skillType}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Skill Types</option>
              <option value="social">Social Skills</option>
              <option value="emotional">Emotional Regulation</option>
              <option value="behavioral">Behavioral Skills</option>
              <option value="academic">Academic Skills</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="library-content">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading stories...</p>
          </div>
        ) : isError ? (
          <div className="error-message">
            <p>Error loading stories: {error.message}</p>
            <button onClick={() => refetch()} className="btn btn-primary">
              Try Again
            </button>
          </div>
        ) : data?.stories?.length === 0 ? (
          <div className="empty-library">
            <div className="empty-icon">📚</div>
            <h2>No Stories Found</h2>
            <p>
              {filters.search || filters.ageGroup || filters.skillType
                ? "No stories match your filters. Try adjusting your search criteria."
                : "You haven't created any stories yet. Click the button below to get started!"}
            </p>
            <Link to="/stories/create" className="btn btn-primary">
              Create Your First Story
            </Link>
          </div>
        ) : (
          <>
            <div className="stories-grid">
              {data?.stories?.map((story) => (
                <div key={story.id} className="story-card">
                  <div className="story-card-header">
                    <div className="story-meta">
                      <span className="age-group">{getAgeGroupLabel(story.ageGroup)}</span>
                      <span className="skill-type">{getSkillTypeLabel(story.skillType)}</span>
                    </div>
                    <div className="story-actions">
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDeleteStory(story.id)}
                        title="Delete Story"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <Link to={`/stories/${story.id}`} className="story-link">
                    <h3 className="story-title">{story.title}</h3>
                    
                    <div className="story-preview">
                      {story.content?.introduction ? (
                        <p>{story.content.introduction.substring(0, 100)}...</p>
                      ) : (
                        <p>No preview available</p>
                      )}
                    </div>
                  </Link>
                  
                  <div className="story-footer">
                    <div className="story-stats">
                      <span className="stat">
                        <span className="stat-icon">📄</span>
                        {(story.content?.sections?.length || 0) + 2} sections
                      </span>
                      <span className="stat">
                        <span className="stat-icon">🖼️</span>
                        {story.images?.length || 0} images
                      </span>
                    </div>
                    <div className="story-date">
                      Created: {formatDate(story.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {data?.pagination && data.pagination.pages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  disabled={filters.page === 1}
                  onClick={() => handlePageChange(filters.page - 1)}
                >
                  Previous
                </button>
                
                <div className="pagination-info">
                  Page {filters.page} of {data.pagination.pages}
                </div>
                
                <button
                  className="pagination-button"
                  disabled={filters.page === data.pagination.pages}
                  onClick={() => handlePageChange(filters.page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StoryLibraryPage;
