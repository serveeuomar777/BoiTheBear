import { config } from '../config.js';
import { logger } from '../logger.js';

export class ContentFormatter {
  formatPost(content) {
    // First, clean and trim the content
    let cleanContent = this.cleanContent(content);
    
   // Remove hashtags and asterisks
   cleanContent = this.removeSpecialCharacters(cleanContent);

    // Get tags
    const tags = this.getPostTags();
    
    // Calculate available space
    const tagsLength = tags.join(' ').length;
    const maxContentLength = config.characterLimit - tagsLength - 1; // -1 for space before tags
    
    // Trim content if needed
    if (cleanContent.length > maxContentLength) {
      cleanContent = cleanContent.substring(0, maxContentLength - 3) + '...';
      logger.debug('Content trimmed to fit character limit', {
        originalLength: content.length,
        newLength: cleanContent.length,
        limit: maxContentLength
      });
    }

    // Combine content with tags
    const formattedPost = `${cleanContent} ${tags.join(' ')}`.trim();
    
    logger.debug('Post formatted', {
      contentLength: cleanContent.length,
      tagsLength,
      totalLength: formattedPost.length,
      limit: config.characterLimit
    });

    return formattedPost;
  }

  cleanContent(content) {
    return content
      .replace(/[\n\r]+/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ')     // Replace multiple spaces with single space
      .replace(/[""]/g, '"')    // Normalize quotes
      .trim();
  }

  removeSpecialCharacters(content) {
    return content
      .replace(/#\w+/g, '')     // Remove hashtags
      .replace(/\*/g, '')       // Remove asterisks
      .replace(/[ \t]+/g, ' ')  // Replace multiple spaces/tabs with single space
      .replace(/\n\s*\n\s*\n/g, '\n\n')  // Replace 3+ consecutive newlines with 2
      .replace(/^\s+|\s+$/gm, ''); // Trim each line
  }

  getPostTags() {
    const { required, optional } = config.tags;
    
    // Always include required tags
    let tags = [...required];
    
    // Add 1-2 random optional tags if there's space
    const remainingSpace = config.characterLimit - tags.join(' ').length;
    
    if (remainingSpace > 20) { // Only add if we have enough space
      const shuffledOptional = optional.sort(() => Math.random() - 0.5);
      for (let tag of shuffledOptional) {
        if (tags.join(' ').length + tag.length + 1 <= config.characterLimit) {
          tags.push(tag);
          if (tags.length >= required.length + 2) break; // Max 2 optional tags
        }
      }
    }
    
    return tags;
  }

  validateLength(content) {
    const isValid = content.length <= config.characterLimit;
    if (!isValid) {
      logger.warn('Content length validation failed', {
        length: content.length,
        limit: config.characterLimit,
        excess: content.length - config.characterLimit
      });
    }
    return isValid;
  }
}
