import dotenv from 'dotenv';
import { ContentGenerator } from './contentGenerator.js';
import { TwitterClient } from './twitterClient.js';
import { config } from './config.js';
import { logger } from './logger.js';
import { getBanner } from './utils/banner.js';

dotenv.config();

class PostingSystem {
  constructor() {
    this.contentGenerator = new ContentGenerator();
    this.twitterClient = new TwitterClient();
    this.postCount = 0;
    this.isRunning = false;
  }

  async start() {
    try {
      // Clear terminal and show banner
      console.clear();
      console.log(getBanner());
      
      logger.info('System initialized successfully');
      logger.info('Configuration loaded', { 
        maxDailyPosts: config.maxDailyPosts,
        interval: `${config.postingIntervals.min / 1000 / 60}-${config.postingIntervals.max / 1000 / 60} minutes`
      });
      
      // Initialize content generator
      const initialized = await this.contentGenerator.init();
      if (!initialized) {
        throw new Error('Failed to initialize content generator');
      }

      this.isRunning = true;
      // Make first post immediately
      await this.makePost();
      // Then schedule next posts
      this.scheduleNextPost();
    } catch (error) {
      logger.error('Failed to start system', { error: error.message });
      process.exit(1);
    }
  }

  scheduleNextPost() {
    if (!this.isRunning) return;

    const interval = this.getRandomInterval();
    const nextPostDate = new Date(Date.now() + interval);
    
    setTimeout(async () => {
      await this.makePost();
      this.scheduleNextPost();
    }, interval);

    logger.info('Next post scheduled', {
      scheduledFor: nextPostDate.toLocaleTimeString(),
      minutesFromNow: Math.floor(interval / 1000 / 60)
    });
  }

  async makePost() {
    if (!this.isRunning) return;

    try {
      logger.startSection(`Generating Post #${++this.postCount}`);
      
      const content = await this.contentGenerator.generatePost();
      if (!content) {
        throw new Error('No content generated');
      }

      logger.post('Generated new content', { content });
      
      const posted = await this.twitterClient.post(content);
      
      if (posted) {
        logger.info('Successfully posted to Twitter');
      } else {
        logger.warn('Failed to post to Twitter');
      }
      
      logger.endSection();
    } catch (error) {
      logger.error('Error during post creation', { error: error.message });
      logger.endSection();
    }
  }

  getRandomInterval() {
    const { min, max } = config.postingIntervals;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  stop() {
    this.isRunning = false;
    logger.info('System stopping...');
  }
}

// Handle process termination
process.on('SIGINT', () => {
  logger.info('Received SIGINT. Gracefully shutting down...');
  system.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM. Gracefully shutting down...');
  system.stop();
  process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message });
  system.stop();
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { error: reason });
  system.stop();
  process.exit(1);
});

// Start the system
const system = new PostingSystem();
system.start().catch(error => {
  logger.error('Critical system error', { error: error.message });
  process.exit(1);
});
