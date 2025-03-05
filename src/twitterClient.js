import { TwitterApi } from 'twitter-api-v2';
import { config } from './config.js';
import { logger } from './logger.js';

export class TwitterClient {
  constructor() {
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });
    
    this.postCount = 0;
    this.lastPostTime = null;
  }

  async post(content) {
    try {
      if (!this.canPost()) {
        logger.warn('Post restricted', {
          reason: this.postCount >= config.maxDailyPosts ? 'Daily limit reached' : 'Minimum interval not met',
          dailyPosts: `${this.postCount}/${config.maxDailyPosts}`
        });
        return false;
      }

      if (content.length > config.characterLimit) {
        logger.error('Content validation failed', {
          error: 'Character limit exceeded',
          length: content.length,
          limit: config.characterLimit
        });
        return false;
      }

      await this.client.v2.tweet(content);
      this.updatePostMetrics();
      
      logger.post('Tweet posted successfully', { content });
      return true;
    } catch (error) {
      logger.error('Twitter API error', { 
        error: error.message,
        content
      });
      return false;
    }
  }

  canPost() {
    const now = Date.now();
    
    if (this.postCount >= config.maxDailyPosts) {
      return false;
    }

    if (this.lastPostTime && 
        (now - this.lastPostTime) < config.postingIntervals.min) {
      return false;
    }

    return true;
  }

  updatePostMetrics() {
    this.postCount++;
    this.lastPostTime = Date.now();

    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeUntilMidnight = midnight - new Date();
    
    setTimeout(() => {
      logger.info('Daily post count reset');
      this.postCount = 0;
    }, timeUntilMidnight);
  }
}
