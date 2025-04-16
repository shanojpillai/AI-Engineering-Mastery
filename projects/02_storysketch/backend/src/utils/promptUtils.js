/**
 * Prompt Utilities
 * 
 * This module contains utilities for formatting prompts for the LLM.
 * It includes templates for different types of prompts and functions to format them.
 */

// Prompt templates for different use cases
const promptTemplates = {
  // Template for generating a social story
  story_generation: `
You are an expert educational content creator specializing in social stories for children. 
Create a developmentally appropriate social story about {topic} for {ageGroup} students.

STORY PARAMETERS:
- Age Group: {ageGroup}
- Skill Type: {skillType}
- Main Characters: {characters}
- Setting: {setting}
- Complexity Level (1-5): {complexity}
- Tone: {tone}
- Additional Context: {additionalContext}

REQUIREMENTS:
1. Follow the evidence-based social story structure with clear sections.
2. Use language appropriate for {ageGroup} children.
3. Include concrete examples of the social skill being taught.
4. Maintain a {tone} tone throughout the story.
5. Structure the story with the following sections:
   - Title
   - Introduction (setting the scene)
   - Main content (3-5 sections with clear headings)
   - Conclusion (reinforcing the main lesson)
6. Keep sentences simple and direct, especially for younger age groups.
7. Avoid abstract concepts for younger children.
8. Include specific, concrete examples of the skill being demonstrated.
9. Format each section with a clear heading using ## (e.g., ## Title).

Please create a complete social story that meets these requirements.
`,

  // Template for generating image prompts
  image_prompt_generation: `
You are an expert at creating detailed image generation prompts for children's educational content.
Create a detailed image prompt for the following story section that would be appropriate for {ageGroup} children.

STORY CONTENT:
{storyContent}

SECTION TO ILLUSTRATE:
{storySection}

REQUIREMENTS:
1. Create a detailed, specific image prompt that captures the essence of this section.
2. The image should be age-appropriate for {ageGroup} children.
3. Include details about:
   - Characters (appearance, expressions, positioning)
   - Setting (environment, time of day, atmosphere)
   - Actions (what characters are doing)
   - Style (appropriate for children's educational content)
4. The image should clearly connect to the educational message of the story.
5. Avoid any potentially frightening, violent, or inappropriate elements.
6. Format your response as follows:
   IMAGE PROMPT: [Your detailed image prompt here]
   END PROMPT

Please create an image prompt that would result in an illustration that enhances the story and helps children understand the concept being taught.
`,

  // Template for refining a story based on feedback
  story_refinement: `
You are an expert educational content creator specializing in social stories for children.
Refine the following social story based on the feedback provided.

ORIGINAL STORY:
{originalStory}

FEEDBACK:
{feedback}

SECTION TO EDIT (if applicable):
{section}

REQUIREMENTS:
1. Maintain the evidence-based social story structure.
2. Address all points in the feedback.
3. Keep the same overall educational goal and message.
4. Ensure the language remains age-appropriate.
5. Maintain consistency in characters and setting.
6. Format each section with a clear heading using ## (e.g., ## Title).

Please provide the refined story that addresses the feedback while maintaining the quality and purpose of the original.
`,

  // Template for generating story variations
  story_variation: `
You are an expert educational content creator specializing in social stories for children.
Create a variation of the following social story based on the specified variation type.

ORIGINAL STORY:
{originalStory}

VARIATION TYPE:
{variationType}

ORIGINAL PARAMETERS:
- Age Group: {storyParams.ageGroup}
- Skill Type: {storyParams.skillType}
- Main Characters: {storyParams.characters}
- Setting: {storyParams.setting}
- Complexity Level: {storyParams.complexity}
- Tone: {storyParams.tone}

REQUIREMENTS:
1. Maintain the evidence-based social story structure.
2. Keep the same overall educational goal and message.
3. Create a variation that is distinctly different from the original while serving the same purpose.
4. If the variation type is "simpler", reduce complexity while maintaining the core message.
5. If the variation type is "more_complex", add more nuance and detail appropriate for older children.
6. If the variation type is "different_setting", change the environment while keeping the same lesson.
7. Format each section with a clear heading using ## (e.g., ## Title).

Please create a complete variation of the social story that meets these requirements.
`,

  // Template for formatting a story for export
  export_formatting: `
You are an expert at formatting educational content for different mediums.
Format the following social story for {exportFormat} export.

STORY CONTENT:
{storyContent}

TARGET AGE GROUP:
{ageGroup}

REQUIREMENTS:
1. Maintain the educational value and message of the original story.
2. Format specifically for {exportFormat} medium.
3. For PDF format:
   - Organize content into clear sections with headings
   - Include page breaks at appropriate points
   - Suggest font sizes and styles appropriate for {ageGroup} readers
4. For slides format:
   - Break content into individual slides (separated by ---)
   - Keep one main point per slide
   - Include speaker notes where helpful
   - Suggest visual elements for each slide
5. For digital format:
   - Optimize for screen reading
   - Suggest interactive elements where appropriate
   - Include navigation suggestions
6. Ensure all formatting is age-appropriate for {ageGroup} children.

Please format the story appropriately for {exportFormat} export while maintaining its educational value.
`
};

/**
 * Format a prompt using a template and parameters
 * 
 * @param {string} promptType - The type of prompt to format
 * @param {Object} params - Parameters to insert into the template
 * @returns {string} - Formatted prompt
 */
function formatPrompt(promptType, params) {
  if (!promptTemplates[promptType]) {
    throw new Error(`Unknown prompt type: ${promptType}`);
  }
  
  let prompt = promptTemplates[promptType];
  
  // Replace simple parameters
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === 'string' || typeof value === 'number') {
      prompt = prompt.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
  });
  
  // Replace nested parameters (e.g., {storyParams.ageGroup})
  prompt = prompt.replace(/\{(\w+)\.(\w+)\}/g, (match, obj, prop) => {
    return params[obj] && params[obj][prop] !== undefined ? params[obj][prop] : match;
  });
  
  // Handle optional sections
  // If a section parameter is null or undefined, remove the entire line containing it
  prompt = prompt.replace(/^.*\{[^}]+\}.*$\n?/gm, (match) => {
    const containsUnreplacedParam = /\{[^}]+\}/.test(match);
    return containsUnreplacedParam ? '' : match;
  });
  
  return prompt.trim();
}

/**
 * Create a system prompt for the LLM
 * 
 * @param {Object} config - Configuration for the system prompt
 * @returns {string} - Formatted system prompt
 */
function createSystemPrompt(config) {
  return `
You are an educational content creator specializing in creating social stories for children.
Your goal is to create developmentally appropriate, engaging, and educational content that helps children understand social situations and develop important skills.

GUIDELINES:
1. Create content that is age-appropriate and accessible for the specified age group.
2. Use clear, concrete language, especially for younger children.
3. Follow evidence-based practices for social story creation.
4. Ensure all content is positive, supportive, and encourages healthy social development.
5. Avoid any content that could be frightening, inappropriate, or reinforce negative stereotypes.
6. Structure content with clear sections and headings for better comprehension.
7. Focus on teaching practical skills through relatable examples and scenarios.

IMPORTANT: Always prioritize the educational value and developmental appropriateness of the content.
`.trim();
}

module.exports = {
  formatPrompt,
  createSystemPrompt,
  promptTemplates
};
