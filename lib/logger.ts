
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
  userId?: string;
}

export const logger = {
  log: (level: LogLevel, message: string, context?: any, userId?: string) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      userId,
    };

    // In production, send to a service like Sentry, Datadog, or DB
    // For now, structured console logging
    console.log(JSON.stringify(entry));
  },

  info: (message: string, context?: any, userId?: string) => logger.log('info', message, context, userId),
  warn: (message: string, context?: any, userId?: string) => logger.log('warn', message, context, userId),
  error: (message: string, context?: any, userId?: string) => logger.log('error', message, context, userId),
  debug: (message: string, context?: any, userId?: string) => logger.log('debug', message, context, userId),
};
