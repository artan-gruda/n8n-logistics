/**
 * Logger utility for Webfleet connector
 * Provides structured logging with different levels and error tracking
 */

export enum LogLevel {
	ERROR = 'error',
	WARN = 'warn',
	INFO = 'info',
	DEBUG = 'debug',
}

export interface LogContext {
	operation?: string;
	resource?: string;
	objectNo?: string;
	timestamp?: string;
	duration?: number;
	requestId?: string;
	userId?: string;
	[key: string]: any;
}

export interface LogEntry {
	level: LogLevel;
	message: string;
	context?: LogContext;
	error?: Error;
	timestamp: string;
}

class WebfleetLogger {
	private logLevel: LogLevel = LogLevel.INFO;
	private logs: LogEntry[] = [];
	private maxLogs: number = 1000;

	constructor() {
		// Set log level from environment or default to INFO
		const envLogLevel = process.env.WEBFLEET_LOG_LEVEL?.toLowerCase();
		if (envLogLevel && Object.values(LogLevel).includes(envLogLevel as LogLevel)) {
			this.logLevel = envLogLevel as LogLevel;
		}
	}

	/**
	 * Set the current log level
	 */
	setLogLevel(level: LogLevel): void {
		this.logLevel = level;
	}

	/**
	 * Get the current log level
	 */
	getLogLevel(): LogLevel {
		return this.logLevel;
	}

	/**
	 * Check if a log level should be logged
	 */
	private shouldLog(level: LogLevel): boolean {
		const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
		const currentLevelIndex = levels.indexOf(this.logLevel);
		const logLevelIndex = levels.indexOf(level);
		return logLevelIndex <= currentLevelIndex;
	}

	/**
	 * Create a log entry
	 */
	private createLogEntry(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
		return {
			level,
			message,
			context: {
				...context,
				timestamp: context?.timestamp || new Date().toISOString(),
			},
			error,
			timestamp: new Date().toISOString(),
		};
	}

	/**
	 * Add log entry to memory store and output
	 */
	private addLogEntry(entry: LogEntry): void {
		// Add to memory store
		this.logs.push(entry);
		
		// Trim logs if exceeding max
		if (this.logs.length > this.maxLogs) {
			this.logs = this.logs.slice(-this.maxLogs);
		}

		// Output to console (in production, this would go to proper logging service)
		this.outputLog(entry);
	}

	/**
	 * Output log entry to console
	 */
	private outputLog(entry: LogEntry): void {
		const logOutput = {
			timestamp: entry.timestamp,
			level: entry.level,
			message: entry.message,
			context: entry.context,
			...(entry.error && {
				error: {
					name: entry.error.name,
					message: entry.error.message,
					stack: entry.error.stack,
				},
			}),
		};

		switch (entry.level) {
			case LogLevel.ERROR:
				console.error(JSON.stringify(logOutput, null, 2));
				break;
			case LogLevel.WARN:
				console.warn(JSON.stringify(logOutput, null, 2));
				break;
			case LogLevel.INFO:
				console.info(JSON.stringify(logOutput, null, 2));
				break;
			case LogLevel.DEBUG:
				console.debug(JSON.stringify(logOutput, null, 2));
				break;
		}
	}

	/**
	 * Log error message
	 */
	error(message: string, context?: LogContext, error?: Error): void {
		if (this.shouldLog(LogLevel.ERROR)) {
			const entry = this.createLogEntry(LogLevel.ERROR, message, context, error);
			this.addLogEntry(entry);
		}
	}

	/**
	 * Log warning message
	 */
	warn(message: string, context?: LogContext): void {
		if (this.shouldLog(LogLevel.WARN)) {
			const entry = this.createLogEntry(LogLevel.WARN, message, context);
			this.addLogEntry(entry);
		}
	}

	/**
	 * Log info message
	 */
	info(message: string, context?: LogContext): void {
		if (this.shouldLog(LogLevel.INFO)) {
			const entry = this.createLogEntry(LogLevel.INFO, message, context);
			this.addLogEntry(entry);
		}
	}

	/**
	 * Log debug message
	 */
	debug(message: string, context?: LogContext): void {
		if (this.shouldLog(LogLevel.DEBUG)) {
			const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
			this.addLogEntry(entry);
		}
	}

	/**
	 * Log API request start
	 */
	logApiRequest(action: string, params: any, requestId?: string): void {
		this.info('Webfleet API request started', {
			operation: 'api_request',
			action,
			params: JSON.stringify(params),
			requestId,
		});
	}

	/**
	 * Log API request success
	 */
	logApiResponse(action: string, responseSize: number, duration: number, requestId?: string): void {
		this.info('Webfleet API request completed successfully', {
			operation: 'api_response',
			action,
			responseSize,
			duration,
			requestId,
		});
	}

	/**
	 * Log API request error
	 */
	logApiError(action: string, error: Error, params?: any, requestId?: string): void {
		this.error('Webfleet API request failed', {
			operation: 'api_error',
			action,
			params: params ? JSON.stringify(params) : undefined,
			requestId,
		}, error);
	}

	/**
	 * Log data transformation
	 */
	logDataTransformation(type: string, inputCount: number, outputCount: number, duration: number): void {
		this.debug('Data transformation completed', {
			operation: 'data_transformation',
			type,
			inputCount,
			outputCount,
			duration,
		});
	}

	/**
	 * Log authentication event
	 */
	logAuthentication(success: boolean, account?: string, error?: Error): void {
		if (success) {
			this.info('Webfleet authentication successful', {
				operation: 'authentication',
				account,
			});
		} else {
			this.error('Webfleet authentication failed', {
				operation: 'authentication',
				account,
			}, error);
		}
	}

	/**
	 * Log rate limiting event
	 */
	logRateLimit(action: string, retryAfter?: number): void {
		this.warn('Webfleet API rate limit reached', {
			operation: 'rate_limit',
			action,
			retryAfter,
		});
	}

	/**
	 * Log configuration event
	 */
	logConfiguration(event: string, details?: any): void {
		this.info(`Webfleet configuration ${event}`, {
			operation: 'configuration',
			details: details ? JSON.stringify(details) : undefined,
		});
	}

	/**
	 * Get recent logs
	 */
	getLogs(count?: number, level?: LogLevel): LogEntry[] {
		let filteredLogs = this.logs;

		if (level) {
			filteredLogs = this.logs.filter(log => log.level === level);
		}

		if (count) {
			filteredLogs = filteredLogs.slice(-count);
		}

		return filteredLogs;
	}

	/**
	 * Clear all logs
	 */
	clearLogs(): void {
		this.logs = [];
	}

	/**
	 * Get log statistics
	 */
	getLogStats(): { [key in LogLevel]: number } & { total: number } {
		const stats = {
			[LogLevel.ERROR]: 0,
			[LogLevel.WARN]: 0,
			[LogLevel.INFO]: 0,
			[LogLevel.DEBUG]: 0,
			total: this.logs.length,
		};

		this.logs.forEach(log => {
			stats[log.level]++;
		});

		return stats;
	}

	/**
	 * Create a child logger with additional context
	 */
	child(baseContext: LogContext): WebfleetLogger {
		const childLogger = new WebfleetLogger();
		childLogger.setLogLevel(this.logLevel);
		
		// Override methods to include base context
		const originalMethods = {
			error: childLogger.error.bind(childLogger),
			warn: childLogger.warn.bind(childLogger),
			info: childLogger.info.bind(childLogger),
			debug: childLogger.debug.bind(childLogger),
		};

		childLogger.error = (message: string, context?: LogContext, error?: Error) => {
			originalMethods.error(message, { ...baseContext, ...context }, error);
		};

		childLogger.warn = (message: string, context?: LogContext) => {
			originalMethods.warn(message, { ...baseContext, ...context });
		};

		childLogger.info = (message: string, context?: LogContext) => {
			originalMethods.info(message, { ...baseContext, ...context });
		};

		childLogger.debug = (message: string, context?: LogContext) => {
			originalMethods.debug(message, { ...baseContext, ...context });
		};

		return childLogger;
	}
}

// Create and export singleton logger instance
export const logger = new WebfleetLogger();

// Export logger class for creating additional instances
export { WebfleetLogger };

// Utility functions for common logging patterns

/**
 * Create a performance timer for measuring operation duration
 */
export function createTimer(operation: string): {
	end: (message?: string, context?: LogContext) => number;
} {
	const startTime = Date.now();
	
	return {
		end: (message?: string, context?: LogContext): number => {
			const duration = Date.now() - startTime;
			logger.debug(message || `${operation} completed`, {
				...context,
				operation,
				duration,
			});
			return duration;
		},
	};
}

/**
 * Log and handle async operation with timing
 */
export async function logAsyncOperation<T>(
	operation: string,
	fn: () => Promise<T>,
	context?: LogContext,
): Promise<T> {
	const timer = createTimer(operation);
	logger.debug(`${operation} started`, context);
	
	try {
		const result = await fn();
		const duration = timer.end(`${operation} completed successfully`, context);
		return result;
	} catch (error) {
		const duration = timer.end(`${operation} failed`, context);
		logger.error(`${operation} failed after ${duration}ms`, context, error as Error);
		throw error;
	}
}

/**
 * Create request ID for tracking API calls
 */
export function createRequestId(): string {
	return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}