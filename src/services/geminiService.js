import { GoogleGenerativeAI } from '@google/generative-ai';
import { geminiPrompt } from '../config.js';
import { logger } from '../logger.js';

export class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  }

  async init() {
    try {
      // Test the API connection
      await this.generateContent('test');
      return true;
    } catch (error) {
      logger.error('Failed to initialize Gemini service', { error: error.message });
      throw error;
    }
  }

  async generateContent(topic) {
    try {
      const prompt = geminiPrompt.replace('{topic}', topic);
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      return text.trim();
    } catch (error) {
      logger.error('Gemini API error', { error: error.message });
      throw error;
    }
  }
}
