import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StoryForm from './StoryForm';
import StoryPreview from './StoryPreview';
import ImageGenerator from './ImageGenerator';
import FinalReview from './FinalReview';
import storyService from '../../services/storyService';
import './StoryWizard.css';

/**
 * Story Creation Wizard
 * 
 * A multi-step wizard for creating social stories
 */
const StoryWizard = () => {
  const navigate = useNavigate();
  
  // Wizard state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Story data
  const [storyParams, setStoryParams] = useState({
    topic: '',
    ageGroup: 'elementary',
    skillType: 'social',
    characters: '',
    setting: '',
    complexity: 3,
    tone: 'encouraging',
    additionalContext: ''
  });
  
  // Generated content
  const [generatedStory, setGeneratedStory] = useState(null);
  const [contextId, setContextId] = useState(null);
  const [images, setImages] = useState([]);
  
  // Handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update story parameters
      setStoryParams(formData);
      
      // Generate story preview
      const result = await storyService.generateStoryPreview(formData);
      
      // Update state with generated content
      setGeneratedStory(result.story);
      setContextId(result.contextId);
      
      // Move to next step
      setStep(2);
    } catch (error) {
      console.error('Error generating story:', error);
      setError(error.response?.data?.message || 'Failed to generate story. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle story refinement
  const handleRefineStory = async (feedback, section = null) => {
    try {
      setLoading(true);
      setError(null);
      
      // Refine the story
      const refinementData = {
        feedback,
        section
      };
      
      // Use the preview endpoint since we haven't saved the story yet
      const result = await storyService.generateStoryPreview({
        ...storyParams,
        feedback,
        section,
        contextId
      });
      
      // Update state with refined content
      setGeneratedStory(result.story);
      setContextId(result.contextId);
    } catch (error) {
      console.error('Error refining story:', error);
      setError(error.response?.data?.message || 'Failed to refine story. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle image generation
  const handleGenerateImage = async (sectionTitle, style) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the section content
      let sectionContent = '';
      if (sectionTitle === 'introduction') {
        sectionContent = generatedStory.introduction;
      } else if (sectionTitle === 'conclusion') {
        sectionContent = generatedStory.conclusion;
      } else {
        const section = generatedStory.sections.find(s => s.title === sectionTitle);
        if (section) {
          sectionContent = section.content;
        }
      }
      
      if (!sectionContent) {
        throw new Error('Section not found');
      }
      
      // Generate image prompt
      const promptResult = await storyService.generateImagePrompt({
        contextId,
        storySection: sectionContent
      });
      
      // For now, we'll just store the prompt since we don't have actual image generation
      // In a real implementation, you would call an image generation API with this prompt
      const newImage = {
        sectionTitle,
        prompt: promptResult.imagePrompt,
        // Placeholder for the actual image URL
        imageUrl: `https://via.placeholder.com/400x300?text=${encodeURIComponent(sectionTitle)}`,
        style
      };
      
      // Add to images array
      setImages([...images, newImage]);
    } catch (error) {
      console.error('Error generating image:', error);
      setError(error.response?.data?.message || 'Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle saving the story
  const handleSaveStory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Create the story
      const storyData = {
        ...storyParams,
        title: generatedStory.title,
        contextId
      };
      
      const savedStory = await storyService.createStory(storyData);
      
      // Navigate to the story view page
      navigate(`/stories/${savedStory.id}`);
    } catch (error) {
      console.error('Error saving story:', error);
      setError(error.response?.data?.message || 'Failed to save story. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Navigate between steps
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  // Render the current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StoryForm
            initialValues={storyParams}
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        );
      case 2:
        return (
          <StoryPreview
            story={generatedStory}
            onRefine={handleRefineStory}
            onNext={nextStep}
            onBack={prevStep}
            loading={loading}
          />
        );
      case 3:
        return (
          <ImageGenerator
            story={generatedStory}
            images={images}
            onGenerateImage={handleGenerateImage}
            onNext={nextStep}
            onBack={prevStep}
            loading={loading}
          />
        );
      case 4:
        return (
          <FinalReview
            story={generatedStory}
            images={images}
            onSave={handleSaveStory}
            onBack={prevStep}
            loading={loading}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };
  
  return (
    <div className="story-wizard">
      <div className="wizard-header">
        <h1>Create a Social Story</h1>
        <div className="wizard-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1. Story Details</div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2. Preview & Edit</div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3. Add Images</div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>4. Review & Save</div>
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      <div className="wizard-content">
        {renderStep()}
      </div>
    </div>
  );
};

export default StoryWizard;
