// Comprehensive logging utility with security and performance considerations

interface LogContext {
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ip?: string;
  url?: string;
  method?: string;
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private sanitizeData(data: any): any {
    // Remove sensitive information
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'credit', 'ssn'];
    
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      for (const key in sanitized) {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
          sanitized[key] = '[REDACTED]';
        }
      }
      return sanitized;
    }
    return data;
  }

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const sanitizedContext = context ? this.sanitizeData(context) : {};
    
    return JSON.stringify({
      timestamp,
      level,
      message,
      context: sanitizedContext,
      environment: process.env.NODE_ENV
    });
  }

  private log(level: string, message: string, context?: LogContext): void {
    const formattedMessage = this.formatMessage(level, message, context);
    
    // Console logging for development
    if (this.isDevelopment) {
      return;
    }
    
    // In production, you would send to external logging service
    if (this.isProduction) {
      // Example: Send to external logging service
      // this.sendToExternalService(formattedMessage);
    }
  }

  error(message: string, context?: LogContext): void {
    this.log('ERROR', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('WARN', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('INFO', message, context);
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log('DEBUG', message, context);
    }
  }

  // Security-specific logging
  securityEvent(event: string, context?: LogContext): void {
    this.error(`SECURITY_EVENT: ${event}`, {
      ...context,
      securityEvent: true,
      timestamp: new Date().toISOString()
    });
  }

  // Performance logging
  performance(operation: string, duration: number, context?: LogContext): void {
    this.info(`PERFORMANCE: ${operation} took ${duration}ms`, {
      ...context,
      performance: true,
      duration
    });
  }

  // User interaction logging
  userInteraction(action: string, context?: LogContext): void {
    this.info(`USER_INTERACTION: ${action}`, {
      ...context,
      userInteraction: true
    });
  }
}

export const logger = new Logger();
export default logger;
