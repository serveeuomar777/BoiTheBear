import winston from 'winston';
import chalk from 'chalk';

// Custom formatter for terminal output
const terminalFormat = () => {
  return winston.format.printf(({ level, message, timestamp, ...meta }) => {
    // Timestamp formatting
    const time = chalk.gray(`[${timestamp}]`);
    
    // Level badge formatting
    const badges = {
      error: chalk.bgRed.white.bold(' ERROR '),
      warn: chalk.bgYellow.black.bold(' WARN '),
      info: chalk.bgGreen.black.bold(' INFO '),
      debug: chalk.bgBlue.white.bold(' DEBUG '),
      post: chalk.bgMagenta.white.bold(' POST ')
    };
    
    // Format meta data
    let metaOutput = '';
    if (Object.keys(meta).length > 0) {
      if (meta.error) {
        metaOutput = `\n${chalk.red('└─')} ${chalk.red(meta.error)}`;
      } else if (meta.content) {
        // Special formatting for tweet content
        metaOutput = `\n${chalk.cyan('└─')} Preview: ${formatTweetPreview(meta.content)}`;
      } else {
        metaOutput = `\n${chalk.gray('└─')} ${chalk.gray(JSON.stringify(meta))}`;
      }
    }

    // Main message formatting
    const badge = badges[level] || badges.info;
    const text = level === 'error' ? chalk.red(message) : message;

    return `${time} ${badge} ${text}${metaOutput}`;
  });
};

// Format tweet preview with character count and tags highlighting
const formatTweetPreview = (content) => {
  const charCount = content.length;
  const remainingChars = 280 - charCount;
  const tags = content.match(/@\w+|#\w+/g) || [];
  
  let formattedContent = content;
  tags.forEach(tag => {
    formattedContent = formattedContent.replace(
      tag,
      tag.startsWith('@') ? chalk.yellow(tag) : chalk.blue(tag)
    );
  });

  return `${chalk.white(formattedContent)}\n   ${chalk.gray('└─')} ${
    remainingChars >= 50 
      ? chalk.green(`${charCount} chars (${remainingChars} remaining)`)
      : chalk.yellow(`${charCount} chars (${remainingChars} remaining)`)
  }`;
};

// Create custom log levels
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    post: 2,
    info: 3,
    debug: 4
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    post: 'magenta',
    info: 'green',
    debug: 'blue'
  }
};

// Create the logger
export const logger = winston.createLogger({
  levels: customLevels.levels,
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'error.log', 
      level: 'error'
    }),
    new winston.transports.File({ 
      filename: 'combined.log'
    })
  ]
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      terminalFormat()
    )
  }));
}

// Add custom logging methods
logger.startSection = (title) => {
  console.log('\n' + chalk.cyan('━'.repeat(process.stdout.columns)));
  console.log(chalk.cyan.bold(` ${title} `));
  console.log(chalk.cyan('━'.repeat(process.stdout.columns)) + '\n');
};

logger.endSection = () => {
  console.log(chalk.cyan('━'.repeat(process.stdout.columns)) + '\n');
};
