// Common types for Webfleet API responses
export interface WebfleetApiResponse<T = any> {
	errorCode: number;
	errorMsg?: string;
	data?: T;
}

// Vehicle related types
export interface WebfleetVehicle {
	objectNo: string;
	objectName: string;
	objectType: string;
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

export interface WebfleetVehiclePosition {
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
	postalCode: string;
	isMoving: boolean;
	isEngineOn: boolean;
	odometer: number;
	engineHours: number;
	fuelLevel?: number;
	batteryVoltage?: number;
}

export interface WebfleetTrip {
	tripId: string;
	objectNo: string;
	objectName: string;
	startTime: string;
	endTime: string;
	duration: number;
	distance: number;
	startLocation: {
		latitude: number;
		longitude: number;
		address: string;
	};
	endLocation: {
		latitude: number;
		longitude: number;
		address: string;
	};
	avgSpeed: number;
	maxSpeed: number;
	fuelConsumed?: number;
	co2Emission?: number;
	driverNo?: string;
	driverName?: string;
}

// Driver related types
export interface WebfleetDriver {
	driverNo: string;
	driverName: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	licenseNumber: string;
	licenseClass: string;
	licenseExpiryDate: string;
	isActive: boolean;
	vehicleNo?: string;
	vehicleName?: string;
}

export interface WebfleetDriverWorkingTime {
	driverNo: string;
	driverName: string;
	date: string;
	workingTime: number;
	drivingTime: number;
	breakTime: number;
	restTime: number;
	availableTime: number;
	dutyTime: number;
	violations: WebfleetViolation[];
}

export interface WebfleetLogbookEntry {
	logId: string;
	driverNo: string;
	driverName: string;
	timestamp: string;
	activity: 'driving' | 'work' | 'available' | 'break' | 'rest';
	duration: number;
	location?: {
		latitude: number;
		longitude: number;
		address: string;
	};
	vehicleNo?: string;
	vehicleName?: string;
}

// Order related types
export interface WebfleetOrder {
	orderId: string;
	orderNo: string;
	status: 'planned' | 'sent' | 'accepted' | 'started' | 'finished' | 'cancelled';
	priority: 'low' | 'normal' | 'high' | 'urgent';
	type: 'pickup' | 'delivery' | 'service' | 'other';
	vehicleNo?: string;
	vehicleName?: string;
	driverNo?: string;
	driverName?: string;
	customer: {
		name: string;
		address: string;
		phone?: string;
		email?: string;
	};
	destination: {
		latitude: number;
		longitude: number;
		address: string;
		city: string;
		postalCode: string;
		country: string;
	};
	plannedDate: string;
	actualStartTime?: string;
	actualEndTime?: string;
	estimatedDuration: number;
	actualDuration?: number;
	description: string;
	notes?: string;
}

// Event related types
export interface WebfleetEvent {
	eventId: string;
	eventType: 'speeding' | 'idling' | 'harsh_braking' | 'harsh_acceleration' | 'geofence' | 'panic' | 'maintenance' | 'other';
	severity: 'low' | 'medium' | 'high' | 'critical';
	objectNo: string;
	objectName: string;
	driverNo?: string;
	driverName?: string;
	timestamp: string;
	location: {
		latitude: number;
		longitude: number;
		address: string;
	};
	description: string;
	value?: number;
	unit?: string;
}

export interface WebfleetSpeedingEvent extends WebfleetEvent {
	eventType: 'speeding';
	speedLimit: number;
	actualSpeed: number;
	duration: number;
}

export interface WebfleetIdlingEvent extends WebfleetEvent {
	eventType: 'idling';
	duration: number;
	fuelWasted?: number;
}

// Geofence related types
export interface WebfleetGeofence {
	geofenceId: string;
	geofenceName: string;
	type: 'circle' | 'polygon';
	isActive: boolean;
	description?: string;
	center?: {
		latitude: number;
		longitude: number;
	};
	radius?: number; // in meters for circle type
	vertices?: Array<{
		latitude: number;
		longitude: number;
	}>; // for polygon type
	alertOnEntry: boolean;
	alertOnExit: boolean;
	speedLimit?: number;
}

// Report related types
export interface WebfleetFleetUtilizationReport {
	reportPeriod: {
		from: string;
		to: string;
	};
	totalVehicles: number;
	utilizationData: Array<{
		vehicleNo: string;
		vehicleName: string;
		totalTime: number;
		drivingTime: number;
		idleTime: number;
		utilizationPercentage: number;
	}>;
	averageUtilization: number;
}

export interface WebfleetFuelConsumptionReport {
	reportPeriod: {
		from: string;
		to: string;
	};
	totalFuelConsumed: number;
	totalDistance: number;
	averageFuelEfficiency: number;
	fuelData: Array<{
		vehicleNo: string;
		vehicleName: string;
		fuelConsumed: number;
		distance: number;
		fuelEfficiency: number;
		co2Emission: number;
	}>;
}

export interface WebfleetDrivingBehaviourReport {
	reportPeriod: {
		from: string;
		to: string;
	};
	drivingData: Array<{
		driverNo: string;
		driverName: string;
		vehicleNo?: string;
		vehicleName?: string;
		safetyScore: number;
		speedingEvents: number;
		harshBrakingEvents: number;
		harshAccelerationEvents: number;
		idlingTime: number;
		totalDrivingTime: number;
	}>;
	averageSafetyScore: number;
	totalViolations: number;
}

// Common violation type
export interface WebfleetViolation {
	violationType: 'driving_time' | 'rest_time' | 'break_time' | 'weekly_rest' | 'daily_driving';
	severity: 'low' | 'medium' | 'high';
	timestamp: string;
	duration: number;
	description: string;
}

// API request parameters
export interface WebfleetRequestParams {
	account?: string;
	apikey?: string;
	lang?: string;
	objectNo?: string;
	objectNames?: string;
	rangeFrom?: string;
	rangeTo?: string;
	offset?: number;
	limit?: number;
	timeZone?: string;
}

// Error handling
export interface WebfleetError {
	code: number;
	message: string;
	details?: any;
}

// Standardized response format for n8n
export interface StandardizedWebfleetResponse<T = any> {
	success: boolean;
	data?: T;
	error?: WebfleetError;
	metadata?: {
		totalRecords?: number;
		offset?: number;
		limit?: number;
		hasMore?: boolean;
		timestamp: string;
	};
}