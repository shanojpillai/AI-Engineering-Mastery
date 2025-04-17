import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SimplifiedApp.css';

// API base URL
const API_URL = 'http://localhost:5000/api';

function SimplifiedApp() {
  // State for Ollama status
  const [ollamaStatus, setOllamaStatus] = useState({
    checking: true,
    connected: false,
    models: [],
    error: null
  });

  // State for story form
  const [storyForm, setStoryForm] = useState({
    topic: '',
    ageGroup: 'elementary',
    skillType: 'social',
    characters: '',
    setting: '',
    complexity: 3,
    tone: 'encouraging',
    model: 'llama3'
  });

  // State for story generation
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  // State for stories
  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);

  // Check Ollama status on mount
  useEffect(() => {
    checkOllamaStatus();
    fetchStories();
  }, []);

  // Check if Ollama is running
  const checkOllamaStatus = async () => {
    try {
      setOllamaStatus(prev => ({ ...prev, checking: true, error: null }));

      const response = await axios.get(`${API_URL}/ollama/status`);

      setOllamaStatus({
        checking: false,
        connected: response.data.connected,
        models: response.data.models || [],
        error: null
      });
    } catch (error) {
      setOllamaStatus({
        checking: false,
        connected: false,
        models: [],
        error: error.response?.data?.message || error.message
      });
    }
  };

  // Fetch all stories
  const fetchStories = async () => {
    try {
      setLoadingStories(true);

      const response = await axios.get(`${API_URL}/stories`);

      setStories(response.data.stories || []);
      setLoadingStories(false);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setStories([]);
      setLoadingStories(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoryForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setGenerating(true);
      setGenerationError(null);

      const response = await axios.post(`${API_URL}/stories/generate`, storyForm);

      // Add the new story to the list
      setStories(prev => [response.data.story, ...prev]);

      // Select the new story
      setSelectedStory(response.data.story);

      setGenerating(false);
    } catch (error) {
      setGenerationError(error.response?.data?.message || error.message);
      setGenerating(false);
    }
  };

  // Delete a story
  const handleDeleteStory = async (storyId) => {
    if (!window.confirm('Are you sure you want to delete this story?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/stories/${storyId}`);

      // Remove the story from the list
      setStories(prev => prev.filter(story => story.id !== storyId));

      // If the deleted story was selected, clear the selection
      if (selectedStory && selectedStory.id === storyId) {
        setSelectedStory(null);
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('Failed to delete story: ' + (error.response?.data?.message || error.message));
    }
  };

  // Format the story content for display
  const formatStoryContent = (content) => {
    if (!content) return null;

    // Split by markdown headings and newlines
    const parts = content.split(/(?=##)|(?=\n)/g);

    return parts.map((part, index) => {
      // Check if this part is a heading
      if (part.startsWith('##')) {
        return (
          <h3 key={index} className="story-section-heading">
            {part.replace('##', '').trim()}
          </h3>
        );
      }

      // Check if this part is a title (usually at the beginning)
      if (index === 0 && !part.startsWith('#') && part.trim().length > 0) {
        return (
          <h2 key={index} className="story-title">
            {part.trim()}
          </h2>
        );
      }

      // Regular paragraph
      if (part.trim().length > 0) {
        return <p key={index}>{part}</p>;
      }

      return null;
    });
  };

  return (
    <div className="simplified-app">
      <header className="app-header">
        <h1>StorySketch MVP</h1>
        <p>Generate social stories for K-12 learners using Ollama</p>
      </header>

      <main className="app-content">
        <div className="ollama-status">
          <h2>Ollama Status</h2>

          {ollamaStatus.checking ? (
            <p>Checking Ollama status...</p>
          ) : ollamaStatus.connected ? (
            <div className="status-connected">
              <p>✅ Ollama is running</p>
              <p className="api-url">API URL: {ollamaStatus.apiUrl}</p>

              {ollamaStatus.models.length > 0 && (
                <div className="models-list">
                  <p>Available models:</p>
                  <ul>
                    {ollamaStatus.models.map(model => (
                      <li key={model.name}>{model.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="status-error">
              <p>❌ Ollama is not connected</p>
              <p className="api-url">API URL: {ollamaStatus.apiUrl}</p>
              {ollamaStatus.error && <p className="error-message">{ollamaStatus.error}</p>}
              <div className="troubleshooting">
                <p>Troubleshooting:</p>
                <ol>
                  <li>Make sure Ollama is installed and running</li>
                  <li>If using Docker, make sure the container is running</li>
                  <li>Check that the API URL is correct in the backend config</li>
                  <li>Pull a model with <code>ollama pull llama3</code></li>
                </ol>
                <button onClick={checkOllamaStatus} className="btn">
                  Check Again
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="app-columns">
          <div className="left-column">
            <div className="story-form-container">
              <h2>Create a Story</h2>

              <form onSubmit={handleSubmit} className="story-form">
                <div className="form-group">
                  <label htmlFor="topic">Topic/Situation*</label>
                  <input
                    type="text"
                    id="topic"
                    name="topic"
                    value={storyForm.topic}
                    onChange={handleInputChange}
                    placeholder="e.g., Sharing toys at school"
                    required
                    className="form-control"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ageGroup">Age Group*</label>
                    <select
                      id="ageGroup"
                      name="ageGroup"
                      value={storyForm.ageGroup}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="preschool">Preschool (3-5 years)</option>
                      <option value="elementary">Elementary (6-10 years)</option>
                      <option value="middle">Middle School (11-13 years)</option>
                      <option value="high">High School (14-18 years)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="skillType">Skill Type*</label>
                    <select
                      id="skillType"
                      name="skillType"
                      value={storyForm.skillType}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="social">Social Skills</option>
                      <option value="emotional">Emotional Regulation</option>
                      <option value="behavioral">Behavioral Skills</option>
                      <option value="academic">Academic Skills</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="characters">Main Characters</label>
                    <input
                      type="text"
                      id="characters"
                      name="characters"
                      value={storyForm.characters}
                      onChange={handleInputChange}
                      placeholder="e.g., Alex, Jamie, Teacher Ms. Lee"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="setting">Setting</label>
                    <input
                      type="text"
                      id="setting"
                      name="setting"
                      value={storyForm.setting}
                      onChange={handleInputChange}
                      placeholder="e.g., Classroom, Playground"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="complexity">Complexity Level*</label>
                    <div className="range-container">
                      <input
                        type="range"
                        id="complexity"
                        name="complexity"
                        min="1"
                        max="5"
                        step="1"
                        value={storyForm.complexity}
                        onChange={handleInputChange}
                        className="range-input"
                      />
                      <div className="range-value">{storyForm.complexity}</div>
                    </div>
                    <div className="range-labels">
                      <span>Simple</span>
                      <span>Complex</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="tone">Tone*</label>
                    <select
                      id="tone"
                      name="tone"
                      value={storyForm.tone}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="encouraging">Encouraging</option>
                      <option value="instructive">Instructive</option>
                      <option value="playful">Playful</option>
                      <option value="serious">Serious</option>
                      <option value="neutral">Neutral</option>
                    </select>
                  </div>
                </div>

                {ollamaStatus.models.length > 0 && (
                  <div className="form-group">
                    <label htmlFor="model">LLM Model*</label>
                    <select
                      id="model"
                      name="model"
                      value={storyForm.model}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      {ollamaStatus.models.map(model => (
                        <option key={model.name} value={model.name}>
                          {model.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={generating || !ollamaStatus.connected}
                  >
                    {generating ? 'Generating...' : 'Generate Story'}
                  </button>
                </div>

                {generationError && (
                  <div className="error-message">
                    <p>{generationError}</p>
                  </div>
                )}
              </form>
            </div>

            <div className="stories-list-container">
              <h2>Your Stories</h2>

              {loadingStories ? (
                <p>Loading stories...</p>
              ) : stories.length === 0 ? (
                <p>No stories yet. Create your first story!</p>
              ) : (
                <div className="stories-list">
                  {stories.map(story => (
                    <div
                      key={story.id}
                      className={`story-item ${selectedStory?.id === story.id ? 'selected' : ''}`}
                      onClick={() => setSelectedStory(story)}
                    >
                      <div className="story-item-content">
                        <h3>{story.topic}</h3>
                        <div className="story-meta">
                          <span>{story.ageGroup}</span>
                          <span>{story.skillType}</span>
                          <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStory(story.id);
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="right-column">
            <div className="story-preview-container">
              <h2>Story Preview</h2>

              {selectedStory ? (
                <div className="story-preview">
                  <div className="story-content">
                    {formatStoryContent(selectedStory.content)}
                  </div>

                  <div className="story-actions">
                    <button
                      className="btn"
                      onClick={() => {
                        // Create a printable version
                        const printWindow = window.open('', '_blank');
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>${selectedStory.topic}</title>
                              <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
                                h1 { text-align: center; margin-bottom: 20px; }
                                h2 { margin-top: 20px; }
                                p { margin-bottom: 10px; }
                              </style>
                            </head>
                            <body>
                              <div>${selectedStory.content}</div>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                        printWindow.print();
                      }}
                    >
                      Print Story
                    </button>
                  </div>
                </div>
              ) : (
                <div className="empty-preview">
                  <p>Select a story to preview or generate a new one.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>StorySketch MVP - Powered by Ollama</p>
      </footer>
    </div>
  );
}

export default SimplifiedApp;
