const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  orange: '\x1b[38;5;208m',
};

function formatMessage(level: string, color: string, message: string, meta?: object): string {
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `${color}[${level}]${colors.reset} ${message}${metaStr}`;
}

export const logger = {
  info(message: string, meta?: object) {
    console.log(formatMessage('INFO', colors.cyan, message, meta));
  },

  success(message: string, meta?: object) {
    console.log(formatMessage('SUCCESS', colors.green, message, meta));
  },

  warn(message: string, meta?: object) {
    console.warn(formatMessage('WARN', colors.yellow, message, meta));
  },

  error(message: string, error?: Error | object) {
    const errorMeta = error instanceof Error
      ? { message: error.message }
      : error;
    console.error(formatMessage('ERROR', colors.red, message, errorMeta));
  },

  debug(message: string, meta?: object) {
    console.log(formatMessage('DEBUG', colors.gray, message, meta));
  },

  api(message: string, meta?: object) {
    console.log(formatMessage('API', colors.magenta, message, meta));
  },

  scraper(message: string, meta?: object) {
    console.log(formatMessage('SCRAPER', colors.blue, message, meta));
  },

  ai(message: string, meta?: object) {
    console.log(formatMessage('AI', colors.orange, message, meta));
  },

  obsidian(message: string, meta?: object) {
    console.log(formatMessage('OBSIDIAN', colors.yellow, message, meta));
  }
};

export default logger;
