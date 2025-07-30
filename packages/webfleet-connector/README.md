# Webfleet Connect API Integration

A comprehensive n8n integration package for Webfleet FMS (Fleet Management System) by Bridgestone. This connector provides seamless integration with the Webfleet Connect API, enabling logistics companies to build powerful automation workflows for fleet management, vehicle tracking, driver management, and operational analytics.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Quick Start](#quick-start)
- [API Operations](#api-operations)
- [Data Transformation](#data-transformation)
- [Error Handling](#error-handling)
- [Configuration Options](#configuration-options)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

### 🚗 Vehicle Management
- Real-time vehicle tracking and positioning
- Vehicle fleet listing and details
- Trip history and analytics
- Working time tracking
- Odometer and engine hour monitoring

### 👨‍💼 Driver Management
- Driver information and profiles
- Working time compliance tracking
- Digital logbook entries
- Driver assignment to vehicles
- License management

### 📋 Order Management
- Create, update, and manage delivery orders
- Send orders to vehicles
- Track order status and completion
- Customer and destination management

### 🚨 Event & Alert System
- Real-time fleet events (speeding, idling, harsh driving)
- Geofence entry/exit alerts
- Maintenance notifications
- Custom event filtering and processing

### 🗺️ Geofencing
- Create and manage geographic boundaries
- Circle and polygon geofences
- Speed limit enforcement
- Entry/exit notifications

### 📊 Reporting & Analytics
- Fleet utilization reports
- Fuel consumption analysis
- Driving behavior insights
- Mileage reporting
- Performance metrics

### 🔄 Data Standardization
- Consistent data formats across all operations
- Automatic timestamp normalization
- Address standardization
- Type-safe data structures

## Installation

### Prerequisites

- n8n version 1.0.0 or higher
- Node.js 18+ 
- Active Webfleet Connect API credentials

### Install from npm

```bash
npm install @n8n/webfleet-connector
```

### Install in n8n

1. Copy the package to your n8n custom nodes directory
2. Restart n8n
3. The Webfleet node will appear in your node palette

## Configuration

### API Credentials Setup

1. **Get Webfleet Credentials**
   - Log into your Webfleet account
   - Navigate to API settings
   - Generate API key and note your account details

2. **Configure in n8n**
   - Add new credentials of type "Webfleet API"
   - Fill in the required fields:
     - Account: Your Webfleet account name
     - Username: Your Webfleet username
     - Password: Your Webfleet password
     - API Key: Your generated API key
     - Base URL: `https://connect.webfleet.com` (default)
     - Language: Preferred language for responses

### Environment Variables

Configure the connector using environment variables:

```bash
# API Configuration
WEBFLEET_API_BASE_URL=https://connect.webfleet.com
WEBFLEET_API_TIMEOUT=30000
WEBFLEET_API_RETRY_ATTEMPTS=3
WEBFLEET_API_RETRY_DELAY=1000

# Logging
WEBFLEET_LOG_LEVEL=info
WEBFLEET_LOG_MAX_LOGS=1000
WEBFLEET_LOG_ENABLE_CONSOLE=true

# Cache Settings
WEBFLEET_CACHE_ENABLED=true
WEBFLEET_CACHE_TTL=300
WEBFLEET_CACHE_MAX_SIZE=500

# Performance
WEBFLEET_PERFORMANCE_ENABLE_METRICS=true
WEBFLEET_PERFORMANCE_SLOW_QUERY_THRESHOLD=5000
```

## Quick Start

### Basic Vehicle Tracking

```javascript
// Get all vehicles in fleet
{
  "resource": "vehicle",
  "operation": "getAll"
}

// Get specific vehicle position
{
  "resource": "vehicle",
  "operation": "getPosition",
  "vehicleObjectName": "TRUCK001"
}
```

### Driver Management

```javascript
// Get all drivers
{
  "resource": "driver",
  "operation": "getAll"
}

// Get driver working times
{
  "resource": "driver",
  "operation": "getWorkingTimes",
  "driverObjectName": "DRIVER001",
  "rangeFrom": "2024-01-01T00:00:00Z",
  "rangeTo": "2024-01-31T23:59:59Z"
}
```

### Real-time Events

```javascript
// Get speeding events
{
  "resource": "event",
  "operation": "getSpeedingEvents",
  "rangeFrom": "2024-01-01T00:00:00Z",
  "rangeTo": "2024-01-31T23:59:59Z"
}
```

## API Operations

### Vehicle Operations

| Operation | Description | Required Parameters |
|-----------|-------------|-------------------|
| `getAll` | Get all vehicles | - |
| `get` | Get specific vehicle | `vehicleObjectName` |
| `getPosition` | Get vehicle position | `vehicleObjectName` |
| `getTrips` | Get trip history | `vehicleObjectName`, `rangeFrom`, `rangeTo` |
| `getWorkingTimes` | Get working times | `vehicleObjectName`, `rangeFrom`, `rangeTo` |

### Driver Operations

| Operation | Description | Required Parameters |
|-----------|-------------|-------------------|
| `getAll` | Get all drivers | - |
| `get` | Get specific driver | `driverObjectName` |
| `getWorkingTimes` | Get working times | `driverObjectName`, `rangeFrom`, `rangeTo` |
| `getLogbook` | Get logbook entries | `driverObjectName`, `rangeFrom`, `rangeTo` |

### Order Operations

| Operation | Description | Required Parameters |
|-----------|-------------|-------------------|
| `getAll` | Get all orders | - |
| `create` | Create new order | Order details |
| `update` | Update order | Order ID, updates |
| `delete` | Delete order | Order ID |
| `send` | Send order to vehicle | Order ID, Vehicle ID |

### Event Operations

| Operation | Description | Required Parameters |
|-----------|-------------|-------------------|
| `getAll` | Get all events | `rangeFrom`, `rangeTo` |
| `getSpeedingEvents` | Get speeding events | `rangeFrom`, `rangeTo` |
| `getIdlingEvents` | Get idling events | `rangeFrom`, `rangeTo` |
| `getDrivingTimeEvents` | Get driving time events | `rangeFrom`, `rangeTo` |

### Geofence Operations

| Operation | Description | Required Parameters |
|-----------|-------------|-------------------|
| `getAll` | Get all geofences | - |
| `create` | Create geofence | Geofence details |
| `update` | Update geofence | Geofence ID, updates |
| `delete` | Delete geofence | Geofence ID |

### Report Operations

| Operation | Description | Required Parameters |
|-----------|-------------|-------------------|
| `fleetUtilization` | Fleet utilization report | `rangeFrom`, `rangeTo` |
| `fuelConsumption` | Fuel consumption report | `rangeFrom`, `rangeTo` |
| `drivingBehaviour` | Driving behavior report | `rangeFrom`, `rangeTo` |
| `mileage` | Mileage report | `rangeFrom`, `rangeTo` |

## Data Transformation

The connector automatically transforms raw Webfleet API responses into standardized formats:

### Standardized Vehicle Data

```typescript
interface WebfleetVehicle {
  objectNo: string;
  objectName: string;
  registrationNo: string;
  vin: string;
  brand: string;
  model: string;
  year: number;
  fuelType: string;
  odometer: number;
  engineHours: number;
  driverNo?: string;
  driverName?: string;
  status: string;
  isActive: boolean;
}
```

### Standardized Position Data

```typescript
interface WebfleetVehiclePosition {
  objectNo: string;
  objectName: string;
  latitude: number;
  longitude: number;
  altitude: number;
  heading: number;
  speed: number;
  timestamp: string;
  address: string;
  city: string;
  country: string;
  isMoving: boolean;
  isEngineOn: boolean;
  odometer: number;
  fuelLevel?: number;
}
```

### Response Format

All responses follow a consistent format:

```typescript
interface StandardizedWebfleetResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: number;
    message: string;
    details?: any;
  };
  metadata?: {
    totalRecords?: number;
    timestamp: string;
    hasMore?: boolean;
  };
}
```

## Error Handling

The connector provides comprehensive error handling:

### API Errors

```javascript
// Automatic retry with exponential backoff
// Rate limiting detection and handling
// Network timeout management
// Authentication error recovery
```

### Error Response Format

```javascript
{
  "success": false,
  "error": {
    "code": 1001,
    "message": "Invalid API key",
    "details": { /* Raw API response */ }
  },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Common Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| 1001 | Invalid API key | Check credentials |
| 1002 | Account not found | Verify account name |
| 1003 | Rate limit exceeded | Implement delays |
| 1004 | Invalid parameters | Check required fields |
| 1005 | Resource not found | Verify object names |

## Configuration Options

### API Configuration

```typescript
interface ApiConfig {
  baseUrl: string;           // API base URL
  timeout: number;           // Request timeout (ms)
  retryAttempts: number;     // Max retry attempts
  retryDelay: number;        // Delay between retries (ms)
  rateLimit: {
    maxRequests: number;     // Max requests per window
    windowMs: number;        // Time window (ms)
  };
}
```

### Logging Configuration

```typescript
interface LoggingConfig {
  level: 'error' | 'warn' | 'info' | 'debug';
  maxLogs: number;           // Max logs in memory
  enableConsoleOutput: boolean;
}
```

### Cache Configuration

```typescript
interface CacheConfig {
  enabled: boolean;          // Enable response caching
  ttl: number;              // Time to live (seconds)
  maxSize: number;          // Max cached items
}
```

## Examples

### Example 1: Fleet Status Dashboard

```javascript
// Workflow to get complete fleet status
const workflow = {
  nodes: [
    {
      name: "Get Vehicles",
      type: "webfleet",
      parameters: {
        resource: "vehicle",
        operation: "getAll"
      }
    },
    {
      name: "Get Positions",
      type: "webfleet",
      parameters: {
        resource: "vehicle",
        operation: "getPosition"
      }
    },
    {
      name: "Combine Data",
      type: "merge",
      // Merge vehicle info with positions
    }
  ]
};
```

### Example 2: Driver Compliance Monitoring

```javascript
// Monitor driver working time compliance
const complianceCheck = {
  resource: "driver",
  operation: "getWorkingTimes",
  rangeFrom: "2024-01-01T00:00:00Z",
  rangeTo: "2024-01-31T23:59:59Z",
  additionalParameters: {
    limit: 100
  }
};
```

### Example 3: Geofence Alert Automation

```javascript
// Create automated geofence alerts
const geofenceWorkflow = [
  {
    // Get geofence events
    resource: "event",
    operation: "getAll",
    rangeFrom: "{{ $now() - 3600000 }}", // Last hour
    rangeTo: "{{ $now() }}"
  },
  {
    // Filter geofence events
    // Send notifications for violations
  }
];
```

### Example 4: Fuel Efficiency Analysis

```javascript
// Analyze fuel consumption patterns
const fuelAnalysis = {
  resource: "report",
  operation: "fuelConsumption",
  rangeFrom: "2024-01-01T00:00:00Z",
  rangeTo: "2024-01-31T23:59:59Z"
};
```

## Advanced Usage

### Custom Data Processing

```javascript
// Process and enrich vehicle data
const processVehicleData = (vehicles) => {
  return vehicles.map(vehicle => ({
    ...vehicle,
    efficiency: calculateEfficiency(vehicle.fuelConsumed, vehicle.distance),
    status: determineStatus(vehicle.isMoving, vehicle.isEngineOn),
    lastMaintenance: getMaintenanceDate(vehicle.objectNo)
  }));
};
```

### Batch Operations

```javascript
// Process multiple vehicles in parallel
const batchProcessing = {
  vehicles: ["TRUCK001", "TRUCK002", "TRUCK003"],
  operations: ["getPosition", "getTrips"],
  parallel: true,
  batchSize: 10
};
```

### Real-time Monitoring

```javascript
// Set up real-time monitoring workflow
const realtimeMonitoring = {
  trigger: "schedule",
  interval: "*/5 * * * *", // Every 5 minutes
  operations: [
    "getPositions",
    "getEvents",
    "checkAlerts"
  ]
};
```

## Rate Limiting and Performance

### Rate Limits

- Default: 100 requests per minute
- Configurable via environment variables
- Automatic backoff on rate limit exceeded
- Request queuing and batching

### Performance Optimization

```javascript
// Enable caching for frequently accessed data
const optimizedConfig = {
  cache: {
    enabled: true,
    ttl: 300, // 5 minutes
    strategies: ["vehicle_list", "driver_list"]
  },
  performance: {
    enableMetrics: true,
    slowQueryThreshold: 5000
  }
};
```

## Troubleshooting

### Common Issues

1. **Authentication Failures**
   ```
   Error: Invalid API key
   Solution: Verify credentials in n8n settings
   ```

2. **Rate Limiting**
   ```
   Error: Rate limit exceeded
   Solution: Increase delay between requests or reduce frequency
   ```

3. **Data Inconsistencies**
   ```
   Error: Unexpected data format
   Solution: Enable data validation in configuration
   ```

4. **Network Timeouts**
   ```
   Error: Request timeout
   Solution: Increase timeout value or check network connectivity
   ```

### Debug Mode

Enable debug logging to troubleshoot issues:

```bash
WEBFLEET_LOG_LEVEL=debug
```

### Health Check

Monitor connector health:

```javascript
const healthCheck = {
  resource: "account",
  operation: "getInfo"
};
```

## Support

### Documentation
- [Webfleet Connect API Documentation](https://www.webfleet.com/static/help/webfleet-connect/en_gb/index.html)
- [n8n Documentation](https://docs.n8n.io)

### Community
- [n8n Community Forum](https://community.n8n.io)
- [GitHub Issues](https://github.com/n8n-io/n8n/issues)

### Professional Support
For enterprise support and custom development, contact the n8n team.

## Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests for any improvements.

### Development Setup

```bash
git clone <repository>
cd webfleet-connector
npm install
npm run dev
```

### Testing

```bash
npm run test
npm run test:coverage
```

## License

This project is licensed under the terms specified in the main n8n license. See LICENSE.md for details.

## Changelog

### v1.0.0
- Initial release
- Complete Webfleet Connect API integration
- Vehicle, driver, order, event, and geofence operations
- Comprehensive data transformation
- Error handling and logging
- Configuration management
- Performance optimization

---

**Disclaimer**: This is an unofficial integration. Webfleet is a trademark of Bridgestone. This connector is not officially endorsed by Bridgestone.