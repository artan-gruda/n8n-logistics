/**
 * Webfleet Connect API Integration - Main Entry Point
 * 
 * This is the primary export file for the Webfleet connector package.
 * It provides a unified interface to all connector functionality.
 */

// Export the main node and credentials
export { Webfleet } from './nodes/Webfleet/Webfleet.node';
export { WebfleetApi } from './credentials/WebfleetApi.credentials';

// Export types
export * from './types/webfleet.types';

// Export utilities
export * from './utils/dataTransformer';
export * from './utils/logger';

// Export configuration
export * from './config';

// Package information
export const PACKAGE_INFO = {
  name: '@n8n/webfleet-connector',
  version: '1.0.0',
  description: 'Webfleet FMS system integration connector for logistics operations',
  author: 'n8n Team',
  license: 'SEE LICENSE IN LICENSE.md',
  keywords: [
    'n8n-community-node-package',
    'webfleet',
    'fleet-management',
    'logistics',
    'telematics',
    'bridgestone'
  ],
  repository: {
    type: 'git',
    url: 'https://github.com/n8n-io/n8n.git'
  },
  homepage: 'https://n8n.io',
  documentation: 'https://www.webfleet.com/static/help/webfleet-connect/en_gb/index.html'
};

// API version information
export const API_INFO = {
  webfleetApiVersion: '1.0',
  supportedEndpoints: [
    'showVehicleList',
    'showVehicleInfo', 
    'showObjectData',
    'showTrips',
    'showWorkingTimes',
    'showDriverList',
    'showDriverInfo',
    'showDriverWorkingTimes',
    'showLogbook',
    'showOrderList',
    'insertOrder',
    'updateOrder',
    'deleteOrder',
    'sendOrderToVehicle',
    'showEventList',
    'showSpeedingEvents',
    'showIdlingEvents',
    'showDrivingTimeEvents',
    'showGeofenceList',
    'insertGeofence',
    'updateGeofence',
    'deleteGeofence',
    'getFleetUtilizationReport',
    'getFuelConsumptionReport',
    'getDrivingBehaviourReport',
    'getMileageReport'
  ],
  dataFormats: ['JSON'],
  authentication: ['Basic Auth', 'API Key'],
  rateLimit: '100 requests per minute'
};

// Default export for easy importing
export default {
  ...PACKAGE_INFO,
  ...API_INFO,
  nodes: {
    Webfleet
  },
  credentials: {
    WebfleetApi
  }
};