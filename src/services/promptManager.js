import fs from 'fs/promises';
import path from 'path';
import { defaultPrompts } from '../prompts/defaultPrompts.js';

export class PromptManager {
  constructor() {
    this.customPromptsPath = path.join(process.cwd(), 'src/prompts/customPrompts.json');
    this.prompts = { ...defaultPrompts };
  }

  async loadPrompts() {
    try {
      const data = await fs.readFile(this.customPromptsPath, 'utf8');
      const customPrompts = JSON.parse(data).custom_prompts;
      this.prompts = { ...defaultPrompts, ...customPrompts };
    } catch (error) {
      console.error('Error loading custom prompts:', error);
    }
  }

  async addCustomPrompt(name, prompt) {
    try {
      const data = await fs.readFile(this.customPromptsPath, 'utf8');
      const json = JSON.parse(data);
      json.custom_prompts[name] = prompt;
      await fs.writeFile(this.customPromptsPath, JSON.stringify(json, null, 2));
      await this.loadPrompts();
      return true;
    } catch (error) {
      console.error('Error adding custom prompt:', error);
      return false;
    }
  }

  getPrompt(name = 'default') {
    return this.prompts[name] || this.prompts.default;
  }

  listPrompts() {
    return Object.keys(this.prompts);
  }
}