import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './StoryForm.css';

// Validation schema
const StoryFormSchema = Yup.object().shape({
  topic: Yup.string()
    .required('Topic is required')
    .min(3, 'Topic must be at least 3 characters')
    .max(100, 'Topic must be less than 100 characters'),
  ageGroup: Yup.string()
    .required('Age group is required')
    .oneOf(['preschool', 'elementary', 'middle', 'high'], 'Invalid age group'),
  skillType: Yup.string()
    .required('Skill type is required')
    .oneOf(['social', 'emotional', 'behavioral', 'academic', 'other'], 'Invalid skill type'),
  characters: Yup.string()
    .max(100, 'Characters must be less than 100 characters'),
  setting: Yup.string()
    .max(100, 'Setting must be less than 100 characters'),
  complexity: Yup.number()
    .required('Complexity is required')
    .min(1, 'Complexity must be at least 1')
    .max(5, 'Complexity must be at most 5'),
  tone: Yup.string()
    .required('Tone is required')
    .oneOf(['encouraging', 'instructive', 'playful', 'serious', 'neutral'], 'Invalid tone'),
  additionalContext: Yup.string()
    .max(500, 'Additional context must be less than 500 characters')
});

/**
 * Story Form Component
 * 
 * Form for entering story parameters
 * 
 * @param {Object} props - Component props
 * @param {Object} props.initialValues - Initial form values
 * @param {Function} props.onSubmit - Form submission handler
 * @param {boolean} props.loading - Loading state
 */
const StoryForm = ({ initialValues, onSubmit, loading }) => {
  const [showTips, setShowTips] = useState(false);
  
  return (
    <div className="story-form-container">
      <div className="form-header">
        <h2>Story Details</h2>
        <button 
          type="button" 
          className="tips-toggle"
          onClick={() => setShowTips(!showTips)}
        >
          {showTips ? 'Hide Tips' : 'Show Tips'}
        </button>
      </div>
      
      {showTips && (
        <div className="tips-panel">
          <h3>Tips for Creating Effective Social Stories</h3>
          <ul>
            <li><strong>Be specific</strong> about the situation or skill you want to address</li>
            <li><strong>Consider the age group</strong> carefully - language and concepts should be age-appropriate</li>
            <li><strong>Keep it positive</strong> - focus on what to do rather than what not to do</li>
            <li><strong>Include characters</strong> that your audience can relate to</li>
            <li><strong>Set complexity</strong> based on the cognitive abilities of your audience</li>
          </ul>
        </div>
      )}
      
      <Formik
        initialValues={initialValues}
        validationSchema={StoryFormSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form className="story-form">
            <div className="form-group">
              <label htmlFor="topic">Topic/Situation*</label>
              <Field
                type="text"
                id="topic"
                name="topic"
                placeholder="e.g., Sharing toys at school"
                className="form-control"
              />
              <ErrorMessage name="topic" component="div" className="form-error" />
              <small>Describe the specific situation or skill the story will address</small>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ageGroup">Age Group*</label>
                <Field as="select" id="ageGroup" name="ageGroup" className="form-control">
                  <option value="preschool">Preschool (3-5 years)</option>
                  <option value="elementary">Elementary (6-10 years)</option>
                  <option value="middle">Middle School (11-13 years)</option>
                  <option value="high">High School (14-18 years)</option>
                </Field>
                <ErrorMessage name="ageGroup" component="div" className="form-error" />
              </div>
              
              <div className="form-group">
                <label htmlFor="skillType">Skill Type*</label>
                <Field as="select" id="skillType" name="skillType" className="form-control">
                  <option value="social">Social Skills</option>
                  <option value="emotional">Emotional Regulation</option>
                  <option value="behavioral">Behavioral Skills</option>
                  <option value="academic">Academic Skills</option>
                  <option value="other">Other</option>
                </Field>
                <ErrorMessage name="skillType" component="div" className="form-error" />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="characters">Main Characters</label>
                <Field
                  type="text"
                  id="characters"
                  name="characters"
                  placeholder="e.g., Alex, Jamie, Teacher Ms. Lee"
                  className="form-control"
                />
                <ErrorMessage name="characters" component="div" className="form-error" />
                <small>Optional: Names of main characters in the story</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="setting">Setting</label>
                <Field
                  type="text"
                  id="setting"
                  name="setting"
                  placeholder="e.g., Classroom, Playground"
                  className="form-control"
                />
                <ErrorMessage name="setting" component="div" className="form-error" />
                <small>Optional: Where the story takes place</small>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="complexity">Complexity Level*</label>
                <div className="range-container">
                  <Field
                    type="range"
                    id="complexity"
                    name="complexity"
                    min="1"
                    max="5"
                    step="1"
                    className="range-input"
                  />
                  <div className="range-value">{values.complexity}</div>
                </div>
                <div className="range-labels">
                  <span>Simple</span>
                  <span>Complex</span>
                </div>
                <ErrorMessage name="complexity" component="div" className="form-error" />
              </div>
              
              <div className="form-group">
                <label htmlFor="tone">Tone*</label>
                <Field as="select" id="tone" name="tone" className="form-control">
                  <option value="encouraging">Encouraging</option>
                  <option value="instructive">Instructive</option>
                  <option value="playful">Playful</option>
                  <option value="serious">Serious</option>
                  <option value="neutral">Neutral</option>
                </Field>
                <ErrorMessage name="tone" component="div" className="form-error" />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="additionalContext">Additional Context</label>
              <Field
                as="textarea"
                id="additionalContext"
                name="additionalContext"
                placeholder="Any additional details or specific requirements for the story..."
                className="form-control"
                rows="4"
              />
              <ErrorMessage name="additionalContext" component="div" className="form-error" />
              <small>Optional: Any specific details or requirements you want to include</small>
            </div>
            
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || loading}
              >
                {loading ? 'Generating...' : 'Generate Story'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StoryForm;
