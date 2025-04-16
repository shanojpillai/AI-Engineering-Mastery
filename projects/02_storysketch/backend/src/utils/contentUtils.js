/**
 * Content Utilities
 * 
 * This module contains utilities for processing and sanitizing content.
 */

// List of inappropriate terms to filter out
// This is a simplified example - in a real application, you would have a more comprehensive list
// and potentially use a third-party content moderation service
const inappropriateTerms = [
  'violent', 'kill', 'hate', 'weapon', 'gun', 'knife', 'blood',
  'inappropriate', 'adult content', 'explicit', 'sexual',
  // Add more terms as needed
];

/**
 * Sanitize content to remove inappropriate material
 * 
 * @param {string} content - Content to sanitize
 * @returns {string} - Sanitized content
 */
function sanitizeContent(content) {
  if (!content) return '';
  
  let sanitized = content;
  
  // Replace inappropriate terms with appropriate alternatives
  inappropriateTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    sanitized = sanitized.replace(regex, '[appropriate content]');
  });
  
  // Remove any HTML tags that might be in the content
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  return sanitized;
}

/**
 * Check if content is appropriate for the specified age group
 * 
 * @param {string} content - Content to check
 * @param {string} ageGroup - Target age group
 * @returns {boolean} - Whether the content is appropriate
 */
function isContentAppropriate(content, ageGroup) {
  if (!content) return true;
  
  // Check for inappropriate terms
  const containsInappropriateTerms = inappropriateTerms.some(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    return regex.test(content);
  });
  
  if (containsInappropriateTerms) {
    return false;
  }
  
  // Additional age-specific checks
  switch (ageGroup.toLowerCase()) {
    case 'preschool':
      // For preschool, check for complex language and concepts
      const averageWordLength = calculateAverageWordLength(content);
      const sentenceCount = countSentences(content);
      const wordCount = countWords(content);
      
      // Preschool content should have shorter words and sentences
      if (averageWordLength > 5 || (wordCount / sentenceCount) > 10) {
        return false;
      }
      break;
      
    case 'elementary':
      // For elementary, slightly more complex language is acceptable
      const elemAverageWordLength = calculateAverageWordLength(content);
      const elemSentenceCount = countSentences(content);
      const elemWordCount = countWords(content);
      
      if (elemAverageWordLength > 6 || (elemWordCount / elemSentenceCount) > 15) {
        return false;
      }
      break;
      
    // Add more age groups as needed
  }
  
  return true;
}

/**
 * Calculate the average word length in a text
 * 
 * @param {string} text - Text to analyze
 * @returns {number} - Average word length
 */
function calculateAverageWordLength(text) {
  const words = text.match(/\b\w+\b/g) || [];
  if (words.length === 0) return 0;
  
  const totalLength = words.reduce((sum, word) => sum + word.length, 0);
  return totalLength / words.length;
}

/**
 * Count the number of sentences in a text
 * 
 * @param {string} text - Text to analyze
 * @returns {number} - Number of sentences
 */
function countSentences(text) {
  const sentences = text.match(/[.!?]+\s/g) || [];
  return sentences.length > 0 ? sentences.length : 1;
}

/**
 * Count the number of words in a text
 * 
 * @param {string} text - Text to analyze
 * @returns {number} - Number of words
 */
function countWords(text) {
  const words = text.match(/\b\w+\b/g) || [];
  return words.length;
}

/**
 * Extract sections from structured content
 * 
 * @param {string} content - Structured content with section headings
 * @returns {Array<Object>} - Array of section objects with title and content
 */
function extractSections(content) {
  if (!content) return [];
  
  // Split content by section headings (## Heading)
  const sectionRegex = /##\s+([^\n]+)(?:\n+)([^#]*?)(?=\n+##|$)/gs;
  const sections = [];
  let match;
  
  while ((match = sectionRegex.exec(content)) !== null) {
    sections.push({
      title: match[1].trim(),
      content: match[2].trim()
    });
  }
  
  return sections;
}

/**
 * Format content for different reading levels
 * 
 * @param {string} content - Content to format
 * @param {string} readingLevel - Target reading level
 * @returns {string} - Formatted content
 */
function formatForReadingLevel(content, readingLevel) {
  if (!content) return '';
  
  // This is a simplified example - in a real application, you would have more sophisticated logic
  switch (readingLevel.toLowerCase()) {
    case 'beginner':
      // For beginners, simplify language and add more line breaks
      return content
        .replace(/\b\w{7,}\b/g, match => {
          // Replace long words with simpler alternatives (simplified example)
          const simplifications = {
            'difficult': 'hard',
            'assistance': 'help',
            'immediately': 'now',
            // Add more as needed
          };
          return simplifications[match.toLowerCase()] || match;
        })
        .replace(/([.!?])\s+/g, '$1\n\n'); // Add extra line breaks after sentences
      
    case 'intermediate':
      // For intermediate, moderate simplification
      return content
        .replace(/\b\w{10,}\b/g, match => {
          // Replace very long words with simpler alternatives
          const simplifications = {
            'subsequently': 'then',
            'approximately': 'about',
            'nevertheless': 'still',
            // Add more as needed
          };
          return simplifications[match.toLowerCase()] || match;
        })
        .replace(/([.!?])\s+/g, '$1\n'); // Add line breaks after sentences
      
    case 'advanced':
      // For advanced, minimal changes
      return content;
      
    default:
      return content;
  }
}

module.exports = {
  sanitizeContent,
  isContentAppropriate,
  extractSections,
  formatForReadingLevel
};
