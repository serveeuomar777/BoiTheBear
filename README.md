<div align="center">
  <img src="ss.png" alt="Flexx Richie Banner"/>
</div>

# BoiTheBear Twitter Bot

An automated social media bot that generates and posts engaging content about cryptocurrency points, community engagement, and BoiTheBear ecosystem using AI-powered content generation.

## Features

- 🐻 AI-powered content generation 
- 📊 Configurable posting intervals (2-5 hours)
- 🏆 Focus on BoiTheBear points and community
- ✨ Custom prompt system with bear-themed humor
- 📝 Automatic post formatting with tags
- 📋 Daily post limit management
- 🐾 Playful, engaging content strategy


## Prerequisites

- Node.js 18.0.0 or higher
- Twitter Developer Account
- Google Cloud Account (for Gemini API)

## Installation
apt update && apt upgrade -y  
pkg install git -y  
pkg install nodejs -y  
pkg install python -y  
pkg install wget -y  
pkg install curl -y  
pkg install openssh -y  
pkg install nano -y  
### Windows

1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Open Command Prompt or PowerShell
3. Clone or download this repository
4. Navigate to the project directory:
   ```bash
   git clone https://github.com/Fl3xxRichie/BoiTheBear.git
   cd BoiTheBear
   npm install
   ```

### macOS

1. Install Node.js using Homebrew:
   ```bash
   brew install node
   ```
2. Navigate to project directory:
   ```bash
   git clone https://github.com/Fl3xxRichie/BoiTheBear.git
   cd BoiTheBear
   npm install
   ```

### Linux

1. Install Node.js using your package manager:
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Fedora
   sudo dnf install nodejs

   # Arch Linux
   sudo pacman -S nodejs npm
   ```
2. Navigate to project directory and install dependencies:
   ```bash
   git clone https://github.com/Fl3xxRichie/BoiTheBear.git
   cd BoiTheBear
   npm install
   ```

### Termux (Android)

1. Update package list:
   ```bash
   pkg update && pkg upgrade
   ```
2. Install Node.js:
   ```bash
   pkg install nodejs
   ```
3. Navigate to project directory:
   ```bash
   git clone https://github.com/Fl3xxRichie/BoiTheBear.git
   cd BoiTheBear
   npm install
   ```

## API Setup

### Twitter API Setup

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new project and app
3. Enable OAuth 1.0a in app settings
4. Generate these keys:
   - API Key and Secret
   - Access Token and Secret
5. Create a .env file, Copy keys to your \`.env\` file:
   ```
   TWITTER_API_KEY=your_api_key
   TWITTER_API_SECRET=your_api_secret
   TWITTER_ACCESS_TOKEN=your_access_token
   TWITTER_ACCESS_SECRET=your_access_secret
   ```

### Gemini API Setup

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Gemini API
4. Create API credentials
5. Copy API key to your \`.env\` file:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ```

## Configuration

### Posting Settings

Edit \`src/config.js\` to customize:
- Posting intervals
- Daily post limits
- Required tags
- Topics

```javascript
export const config = {
  postingIntervals: {
    min: 2 * 60 * 60 * 1000, // 2 hours
    max: 5 * 60 * 60 * 1000  // 5 hours
  },
  maxDailyPosts: 25,
  tags: {
    required: ['@BoiTheBear'],
    optional: ['$BOI']
  }
};
```

### Custom Prompts

1. Default prompts are in \`src/prompts/defaultPrompts.js\`
2. Add custom prompts programmatically:

```javascript
const generator = new ContentGenerator();
await generator.init();

// Add new prompt
await generator.addCustomPrompt('my_prompt', `
Create a tweet about {topic} that:
- Focuses on specific feature
- Includes real-world application
- Stays under 200 characters
`);
```

3. Custom prompts are stored in \`src/prompts/customPrompts.json\`

## Usage

1. Start the bot:
   ```bash
   npm start
   ```

2. Run tests:
   ```bash
   npm test
   ```

3. View logs:
   - Error logs: \`error.log\`
   - All logs: \`combined.log\`

## Prompt Templates

Prompts should:
- Include \`{topic}\` placeholder
- Specify character limits
- Define content focus
- Set tone guidelines

Example prompt template:
```
Create a tweet about {topic} that:
- Highlights technical innovation
- Includes specific benefits
- Maintains professional tone
- Stays under 200 characters
```

## Error Handling

The bot handles:
- API rate limits
- Network errors
- Content generation failures
- Character limit violations

Errors are logged to \`error.log\` with timestamps and details.

## Best Practices

1. Monitor your Twitter API usage
2. Review generated content regularly
3. Update prompts based on engagement
4. Keep API keys secure
5. Check logs for issues

## Troubleshooting

### Common Issues

1. **API Authentication Errors**
   - Verify API keys in \`.env\`
   - Check API quota limits
   - Ensure proper permissions

2. **Content Generation Issues**
   - Review prompt templates
   - Check character limits
   - Verify topic configuration

3. **Rate Limiting**
   - Adjust posting intervals
   - Monitor API usage
   - Check error logs

### Debug Mode

Enable debug logging in \`src/logger.js\`:
```javascript
const logger = winston.createLogger({
  level: 'debug',  // Change to 'debug'
  // ... other settings
});
```

## Security

- Never commit \`.env\` file
- Rotate API keys regularly
- Monitor account activity
- Review app permissions

## 🌐 Connect With Me

[![Twitter](https://img.shields.io/badge/Twitter-%231DA1F2.svg?style=for-the-badge&logo=Twitter&logoColor=white)](https://twitter.com/FlexxRichie)
[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/FlexxRichie)
[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Fl3xxRichie)
[![Private Channel](https://img.shields.io/badge/Private_Channel-%23FF5733.svg?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/+GIfY4Pb0Spw5OGZk)
[![Direct Contact](https://img.shields.io/badge/Direct_Contact-%23009688.svg?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/flexxrichie)


## License

MIT License - See LICENSE file for details