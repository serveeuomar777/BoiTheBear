import { topics } from './config.js';
import { GeminiService } from './services/geminiService.js';
import { ContentFormatter } from './services/contentFormatter.js';
import { logger } from './logger.js';

export class ContentGenerator {
  constructor() {
    this.geminiService = new GeminiService();
    this.formatter = new ContentFormatter();
    this.usedTopics = new Set();
  }

  async init() {
    try {
      await this.geminiService.init();
      return true;
    } catch (error) {
      logger.error('Failed to initialize Boithebear content generator', { error: error.message });
      return false;
    }
  }

  async generatePost(promptName = 'default') {
    try {
      // Try up to 3 times to generate valid content
      for (let attempt = 1; attempt <= 3; attempt++) {
        logger.debug(`Boithebear generation attempt ${attempt}/3`);
        
        const topic = this.getRandomTopic();
        const rawContent = await this.geminiService.generateContent(topic);
        
        if (!rawContent) {
          logger.warn('No Boithebear content generated, retrying...');
          continue;
        }

        // Pre-format check
        if (rawContent.length > 160) { // Leave room for tags
          logger.debug('Raw content too long, retrying...', {
            length: rawContent.length,
            content: rawContent
          });
          continue;
        }

        const formattedPost = this.formatter.formatPost(rawContent);
        
        if (this.formatter.validateLength(formattedPost)) {
          logger.debug('Valid Boithebear post generated', {
            length: formattedPost.length,
            content: formattedPost
          });
          return formattedPost;
        }
      }

      throw new Error('Failed to generate valid Boithebear content after 3 attempts');
    } catch (error) {
      logger.error('Boithebear content generation failed', { error: error.message });
      throw error;
    }
  }

  getRandomTopic() {
    if (this.usedTopics.size === topics.length) {
      this.usedTopics.clear();
    }

    let availableTopics = topics.filter(topic => !this.usedTopics.has(topic));
    const topic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
    this.usedTopics.add(topic);
    return topic;
  }
}