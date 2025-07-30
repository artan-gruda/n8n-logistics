/**
 * Configuration management for Webfleet connector
 * Handles environment variables, defaults, and validation
 */

export interface WebfleetConfig {
	api: {
		baseUrl: string;
		timeout: number;
		retryAttempts: number;
		retryDelay: number;
		rateLimit: {
			maxRequests: number;
			windowMs: number;
		};
	};
	logging: {
		level: 'error' | 'warn' | 'info' | 'debug';
		maxLogs: number;
		enableConsoleOutput: boolean;
	};
	cache: {
		enabled: boolean;
		ttl: number; // Time to live in seconds
		maxSize: number; // Maximum number of cached items
	};
	transform: {
		enableDataValidation: boolean;
		enableTimestampNormalization: boolean;
		enableAddressGeocoding: boolean;
	};
	security: {
		enableRequestSigning: boolean;
		enableResponseValidation: boolean;
		maxResponseSize: number; // Maximum response size in bytes
	};
	performance: {
		enableMetrics: boolean;
		enablePerformanceLogging: boolean;
		slowQueryThreshold: number; // Threshold in ms for slow query logging
	};
}

/**
 * Default configuration values
 */
const defaultConfig: WebfleetConfig = {
	api: {
		baseUrl: 'https://connect.webfleet.com',
		timeout: 30000, // 30 seconds
		retryAttempts: 3,
		retryDelay: 1000, // 1 second
		rateLimit: {
			maxRequests: 100,
			windowMs: 60000, // 1 minute
		},
	},
	logging: {
		level: 'info',
		maxLogs: 1000,
		enableConsoleOutput: true,
	},
	cache: {
		enabled: true,
		ttl: 300, // 5 minutes
		maxSize: 500,
	},
	transform: {
		enableDataValidation: true,
		enableTimestampNormalization: true,
		enableAddressGeocoding: false,
	},
	security: {
		enableRequestSigning: false,
		enableResponseValidation: true,
		maxResponseSize: 10485760, // 10MB
	},
	performance: {
		enableMetrics: true,
		enablePerformanceLogging: true,
		slowQueryThreshold: 5000, // 5 seconds
	},
};

/**
 * Environment variable mappings
 */
const envVarMappings = {
	'WEBFLEET_API_BASE_URL': 'api.baseUrl',
	'WEBFLEET_API_TIMEOUT': 'api.timeout',
	'WEBFLEET_API_RETRY_ATTEMPTS': 'api.retryAttempts',
	'WEBFLEET_API_RETRY_DELAY': 'api.retryDelay',
	'WEBFLEET_API_RATE_LIMIT_MAX_REQUESTS': 'api.rateLimit.maxRequests',
	'WEBFLEET_API_RATE_LIMIT_WINDOW_MS': 'api.rateLimit.windowMs',
	'WEBFLEET_LOG_LEVEL': 'logging.level',
	'WEBFLEET_LOG_MAX_LOGS': 'logging.maxLogs',
	'WEBFLEET_LOG_ENABLE_CONSOLE': 'logging.enableConsoleOutput',
	'WEBFLEET_CACHE_ENABLED': 'cache.enabled',
	'WEBFLEET_CACHE_TTL': 'cache.ttl',
	'WEBFLEET_CACHE_MAX_SIZE': 'cache.maxSize',
	'WEBFLEET_TRANSFORM_ENABLE_VALIDATION': 'transform.enableDataValidation',
	'WEBFLEET_TRANSFORM_ENABLE_TIMESTAMP_NORMALIZATION': 'transform.enableTimestampNormalization',
	'WEBFLEET_TRANSFORM_ENABLE_ADDRESS_GEOCODING': 'transform.enableAddressGeocoding',
	'WEBFLEET_SECURITY_ENABLE_REQUEST_SIGNING': 'security.enableRequestSigning',
	'WEBFLEET_SECURITY_ENABLE_RESPONSE_VALIDATION': 'security.enableResponseValidation',
	'WEBFLEET_SECURITY_MAX_RESPONSE_SIZE': 'security.maxResponseSize',
	'WEBFLEET_PERFORMANCE_ENABLE_METRICS': 'performance.enableMetrics',
	'WEBFLEET_PERFORMANCE_ENABLE_LOGGING': 'performance.enablePerformanceLogging',
	'WEBFLEET_PERFORMANCE_SLOW_QUERY_THRESHOLD': 'performance.slowQueryThreshold',
};

/**
 * Configuration validation rules
 */
const validationRules = {
	'api.baseUrl': (value: any) => {
		if (typeof value !== 'string' || !value.startsWith('http')) {
			throw new Error('api.baseUrl must be a valid HTTP URL');
		}
	},
	'api.timeout': (value: any) => {
		if (typeof value !== 'number' || value < 1000 || value > 300000) {
			throw new Error('api.timeout must be a number between 1000 and 300000 ms');
		}
	},
	'api.retryAttempts': (value: any) => {
		if (typeof value !== 'number' || value < 0 || value > 10) {
			throw new Error('api.retryAttempts must be a number between 0 and 10');
		}
	},
	'api.retryDelay': (value: any) => {
		if (typeof value !== 'number' || value < 100 || value > 10000) {
			throw new Error('api.retryDelay must be a number between 100 and 10000 ms');
		}
	},
	'api.rateLimit.maxRequests': (value: any) => {
		if (typeof value !== 'number' || value < 1 || value > 1000) {
			throw new Error('api.rateLimit.maxRequests must be a number between 1 and 1000');
		}
	},
	'api.rateLimit.windowMs': (value: any) => {
		if (typeof value !== 'number' || value < 1000 || value > 3600000) {
			throw new Error('api.rateLimit.windowMs must be a number between 1000 and 3600000 ms');
		}
	},
	'logging.level': (value: any) => {
		if (!['error', 'warn', 'info', 'debug'].includes(value)) {
			throw new Error('logging.level must be one of: error, warn, info, debug');
		}
	},
	'logging.maxLogs': (value: any) => {
		if (typeof value !== 'number' || value < 100 || value > 10000) {
			throw new Error('logging.maxLogs must be a number between 100 and 10000');
		}
	},
	'cache.ttl': (value: any) => {
		if (typeof value !== 'number' || value < 10 || value > 86400) {
			throw new Error('cache.ttl must be a number between 10 and 86400 seconds');
		}
	},
	'cache.maxSize': (value: any) => {
		if (typeof value !== 'number' || value < 10 || value > 10000) {
			throw new Error('cache.maxSize must be a number between 10 and 10000');
		}
	},
	'security.maxResponseSize': (value: any) => {
		if (typeof value !== 'number' || value < 1024 || value > 104857600) {
			throw new Error('security.maxResponseSize must be a number between 1024 and 104857600 bytes');
		}
	},
	'performance.slowQueryThreshold': (value: any) => {
		if (typeof value !== 'number' || value < 100 || value > 60000) {
			throw new Error('performance.slowQueryThreshold must be a number between 100 and 60000 ms');
		}
	},
};

/**
 * Set nested object property by dot notation path
 */
function setNestedProperty(obj: any, path: string, value: any): void {
	const keys = path.split('.');
	let current = obj;
	
	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i];
		if (!(key in current)) {
			current[key] = {};
		}
		current = current[key];
	}
	
	current[keys[keys.length - 1]] = value;
}

/**
 * Get nested object property by dot notation path
 */
function getNestedProperty(obj: any, path: string): any {
	const keys = path.split('.');
	let current = obj;
	
	for (const key of keys) {
		if (current === null || current === undefined || !(key in current)) {
			return undefined;
		}
		current = current[key];
	}
	
	return current;
}

/**
 * Parse environment variable value to appropriate type
 */
function parseEnvValue(value: string, path: string): any {
	// Boolean values
	if (value.toLowerCase() === 'true') return true;
	if (value.toLowerCase() === 'false') return false;
	
	// Number values
	if (!isNaN(Number(value))) {
		// Check if it's an integer or float
		const num = Number(value);
		return Number.isInteger(num) ? parseInt(value, 10) : parseFloat(value);
	}
	
	// String values
	return value;
}

/**
 * Load configuration from environment variables
 */
function loadConfigFromEnv(): Partial<WebfleetConfig> {
	const config: any = {};
	
	for (const [envVar, configPath] of Object.entries(envVarMappings)) {
		const envValue = process.env[envVar];
		if (envValue !== undefined) {
			const parsedValue = parseEnvValue(envValue, configPath);
			setNestedProperty(config, configPath, parsedValue);
		}
	}
	
	return config;
}

/**
 * Merge configurations with deep merge
 */
function mergeConfig(base: WebfleetConfig, override: Partial<WebfleetConfig>): WebfleetConfig {
	const merged = JSON.parse(JSON.stringify(base)); // Deep clone
	
	function deepMerge(target: any, source: any): void {
		for (const key in source) {
			if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
				if (!target[key]) target[key] = {};
				deepMerge(target[key], source[key]);
			} else {
				target[key] = source[key];
			}
		}
	}
	
	deepMerge(merged, override);
	return merged;
}

/**
 * Validate configuration
 */
function validateConfig(config: WebfleetConfig): void {
	for (const [path, validator] of Object.entries(validationRules)) {
		const value = getNestedProperty(config, path);
		if (value !== undefined) {
			try {
				validator(value);
			} catch (error) {
				throw new Error(`Configuration validation failed for ${path}: ${error.message}`);
			}
		}
	}
}

/**
 * Configuration manager class
 */
class ConfigManager {
	private config: WebfleetConfig;
	private isInitialized: boolean = false;

	constructor() {
		this.config = defaultConfig;
	}

	/**
	 * Initialize configuration
	 */
	init(overrideConfig?: Partial<WebfleetConfig>): void {
		// Load from environment variables
		const envConfig = loadConfigFromEnv();
		
		// Merge configurations: default -> env -> override
		let finalConfig = mergeConfig(defaultConfig, envConfig);
		
		if (overrideConfig) {
			finalConfig = mergeConfig(finalConfig, overrideConfig);
		}
		
		// Validate configuration
		validateConfig(finalConfig);
		
		this.config = finalConfig;
		this.isInitialized = true;
	}

	/**
	 * Get configuration value by path
	 */
	get<T = any>(path: string): T {
		if (!this.isInitialized) {
			this.init();
		}
		
		return getNestedProperty(this.config, path);
	}

	/**
	 * Get entire configuration
	 */
	getAll(): WebfleetConfig {
		if (!this.isInitialized) {
			this.init();
		}
		
		return { ...this.config };
	}

	/**
	 * Set configuration value by path
	 */
	set(path: string, value: any): void {
		// Validate if there's a validation rule
		const validator = validationRules[path as keyof typeof validationRules];
		if (validator) {
			validator(value);
		}
		
		setNestedProperty(this.config, path, value);
	}

	/**
	 * Update configuration with partial config
	 */
	update(partialConfig: Partial<WebfleetConfig>): void {
		const newConfig = mergeConfig(this.config, partialConfig);
		validateConfig(newConfig);
		this.config = newConfig;
	}

	/**
	 * Reset configuration to defaults
	 */
	reset(): void {
		this.config = { ...defaultConfig };
		this.isInitialized = false;
	}

	/**
	 * Check if configuration is initialized
	 */
	isReady(): boolean {
		return this.isInitialized;
	}

	/**
	 * Get configuration summary for logging
	 */
	getSummary(): any {
		const summary = { ...this.config };
		// Remove sensitive information
		return summary;
	}
}

// Create and export singleton config manager
export const config = new ConfigManager();

// Export types and classes
export { ConfigManager };
export type { WebfleetConfig };

// Helper functions
export function getConfig(): WebfleetConfig {
	return config.getAll();
}

export function initConfig(overrideConfig?: Partial<WebfleetConfig>): void {
	config.init(overrideConfig);
}

export function updateConfig(partialConfig: Partial<WebfleetConfig>): void {
	config.update(partialConfig);
}

// Configuration presets for different environments
export const configPresets = {
	development: {
		logging: {
			level: 'debug' as const,
			enableConsoleOutput: true,
		},
		cache: {
			enabled: false,
		},
		performance: {
			enableMetrics: true,
			enablePerformanceLogging: true,
		},
	},
	
	production: {
		logging: {
			level: 'warn' as const,
			enableConsoleOutput: false,
		},
		cache: {
			enabled: true,
			ttl: 600, // 10 minutes
		},
		api: {
			timeout: 15000, // 15 seconds
			retryAttempts: 5,
		},
		performance: {
			enableMetrics: true,
			enablePerformanceLogging: false,
		},
	},
	
	testing: {
		logging: {
			level: 'error' as const,
			enableConsoleOutput: false,
		},
		cache: {
			enabled: false,
		},
		api: {
			timeout: 5000, // 5 seconds
			retryAttempts: 1,
		},
		performance: {
			enableMetrics: false,
			enablePerformanceLogging: false,
		},
	},
} as const;