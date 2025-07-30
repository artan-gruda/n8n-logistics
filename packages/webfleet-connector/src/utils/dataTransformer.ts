import { format, parseISO } from 'date-fns';
import type {
	WebfleetApiResponse,
	WebfleetVehicle,
	WebfleetVehiclePosition,
	WebfleetTrip,
	WebfleetDriver,
	WebfleetDriverWorkingTime,
	WebfleetLogbookEntry,
	WebfleetOrder,
	WebfleetEvent,
	WebfleetGeofence,
	StandardizedWebfleetResponse,
} from '../types/webfleet.types';

/**
 * Transform raw Webfleet API response into standardized format
 */
export function transformApiResponse<T>(
	rawResponse: any,
	transformFn?: (data: any) => T,
): StandardizedWebfleetResponse<T> {
	const timestamp = new Date().toISOString();

	// Handle API errors
	if (rawResponse.errorCode && rawResponse.errorCode !== 0) {
		return {
			success: false,
			error: {
				code: rawResponse.errorCode,
				message: rawResponse.errorMsg || 'Unknown Webfleet API error',
				details: rawResponse,
			},
			metadata: {
				timestamp,
			},
		};
	}

	// Extract data
	let data = rawResponse;
	if (transformFn && data) {
		data = Array.isArray(data) ? data.map(transformFn) : transformFn(data);
	}

	// Calculate metadata
	const metadata = {
		timestamp,
		totalRecords: Array.isArray(data) ? data.length : 1,
		hasMore: false, // Webfleet doesn't provide this info directly
	};

	return {
		success: true,
		data,
		metadata,
	};
}

/**
 * Transform raw vehicle data from Webfleet API
 */
export function transformVehicleData(rawVehicle: any): WebfleetVehicle {
	return {
		objectNo: rawVehicle.objectno || rawVehicle.objectNo || '',
		objectName: rawVehicle.objectname || rawVehicle.objectName || '',
		objectType: rawVehicle.objecttype || rawVehicle.objectType || '',
		registrationNo: rawVehicle.registrationno || rawVehicle.registrationNo || '',
		vin: rawVehicle.vin || '',
		brand: rawVehicle.brand || '',
		model: rawVehicle.model || '',
		year: parseInt(rawVehicle.year) || 0,
		fuelType: rawVehicle.fueltype || rawVehicle.fuelType || '',
		odometer: parseFloat(rawVehicle.odometer) || 0,
		engineHours: parseFloat(rawVehicle.enginehours || rawVehicle.engineHours) || 0,
		driverNo: rawVehicle.driverno || rawVehicle.driverNo,
		driverName: rawVehicle.drivername || rawVehicle.driverName,
		status: rawVehicle.status || 'unknown',
		isActive: rawVehicle.isactive === '1' || rawVehicle.isActive === true,
	};
}

/**
 * Transform raw vehicle position data from Webfleet API
 */
export function transformVehiclePositionData(rawPosition: any): WebfleetVehiclePosition {
	return {
		objectNo: rawPosition.objectno || rawPosition.objectNo || '',
		objectName: rawPosition.objectname || rawPosition.objectName || '',
		latitude: parseFloat(rawPosition.latitude || rawPosition.lat) || 0,
		longitude: parseFloat(rawPosition.longitude || rawPosition.lng || rawPosition.lon) || 0,
		altitude: parseFloat(rawPosition.altitude) || 0,
		heading: parseFloat(rawPosition.heading || rawPosition.course) || 0,
		speed: parseFloat(rawPosition.speed) || 0,
		timestamp: formatWebfleetTimestamp(rawPosition.timestamp || rawPosition.time),
		address: rawPosition.address || '',
		city: rawPosition.city || '',
		country: rawPosition.country || '',
		postalCode: rawPosition.postalcode || rawPosition.postalCode || '',
		isMoving: rawPosition.ismoving === '1' || rawPosition.isMoving === true,
		isEngineOn: rawPosition.isengineon === '1' || rawPosition.isEngineOn === true,
		odometer: parseFloat(rawPosition.odometer) || 0,
		engineHours: parseFloat(rawPosition.enginehours || rawPosition.engineHours) || 0,
		fuelLevel: parseFloat(rawPosition.fuellevel || rawPosition.fuelLevel),
		batteryVoltage: parseFloat(rawPosition.batteryvoltage || rawPosition.batteryVoltage),
	};
}

/**
 * Transform raw trip data from Webfleet API
 */
export function transformTripData(rawTrip: any): WebfleetTrip {
	return {
		tripId: rawTrip.tripid || rawTrip.tripId || generateTripId(rawTrip),
		objectNo: rawTrip.objectno || rawTrip.objectNo || '',
		objectName: rawTrip.objectname || rawTrip.objectName || '',
		startTime: formatWebfleetTimestamp(rawTrip.starttime || rawTrip.startTime),
		endTime: formatWebfleetTimestamp(rawTrip.endtime || rawTrip.endTime),
		duration: parseInt(rawTrip.duration) || 0,
		distance: parseFloat(rawTrip.distance) || 0,
		startLocation: {
			latitude: parseFloat(rawTrip.startlat || rawTrip.startLatitude) || 0,
			longitude: parseFloat(rawTrip.startlon || rawTrip.startLongitude) || 0,
			address: rawTrip.startaddress || rawTrip.startAddress || '',
		},
		endLocation: {
			latitude: parseFloat(rawTrip.endlat || rawTrip.endLatitude) || 0,
			longitude: parseFloat(rawTrip.endlon || rawTrip.endLongitude) || 0,
			address: rawTrip.endaddress || rawTrip.endAddress || '',
		},
		avgSpeed: parseFloat(rawTrip.avgspeed || rawTrip.avgSpeed) || 0,
		maxSpeed: parseFloat(rawTrip.maxspeed || rawTrip.maxSpeed) || 0,
		fuelConsumed: parseFloat(rawTrip.fuelconsumed || rawTrip.fuelConsumed),
		co2Emission: parseFloat(rawTrip.co2emission || rawTrip.co2Emission),
		driverNo: rawTrip.driverno || rawTrip.driverNo,
		driverName: rawTrip.drivername || rawTrip.driverName,
	};
}

/**
 * Transform raw driver data from Webfleet API
 */
export function transformDriverData(rawDriver: any): WebfleetDriver {
	return {
		driverNo: rawDriver.driverno || rawDriver.driverNo || '',
		driverName: rawDriver.drivername || rawDriver.driverName || '',
		firstName: rawDriver.firstname || rawDriver.firstName || '',
		lastName: rawDriver.lastname || rawDriver.lastName || '',
		email: rawDriver.email || '',
		phone: rawDriver.phone || '',
		licenseNumber: rawDriver.licenseno || rawDriver.licenseNumber || '',
		licenseClass: rawDriver.licenseclass || rawDriver.licenseClass || '',
		licenseExpiryDate: formatWebfleetDate(rawDriver.licenseexpiry || rawDriver.licenseExpiryDate),
		isActive: rawDriver.isactive === '1' || rawDriver.isActive === true,
		vehicleNo: rawDriver.vehicleno || rawDriver.vehicleNo,
		vehicleName: rawDriver.vehiclename || rawDriver.vehicleName,
	};
}

/**
 * Transform raw driver working time data from Webfleet API
 */
export function transformDriverWorkingTimeData(rawWorkingTime: any): WebfleetDriverWorkingTime {
	return {
		driverNo: rawWorkingTime.driverno || rawWorkingTime.driverNo || '',
		driverName: rawWorkingTime.drivername || rawWorkingTime.driverName || '',
		date: formatWebfleetDate(rawWorkingTime.date),
		workingTime: parseInt(rawWorkingTime.workingtime || rawWorkingTime.workingTime) || 0,
		drivingTime: parseInt(rawWorkingTime.drivingtime || rawWorkingTime.drivingTime) || 0,
		breakTime: parseInt(rawWorkingTime.breaktime || rawWorkingTime.breakTime) || 0,
		restTime: parseInt(rawWorkingTime.resttime || rawWorkingTime.restTime) || 0,
		availableTime: parseInt(rawWorkingTime.availabletime || rawWorkingTime.availableTime) || 0,
		dutyTime: parseInt(rawWorkingTime.dutytime || rawWorkingTime.dutyTime) || 0,
		violations: (rawWorkingTime.violations || []).map(transformViolationData),
	};
}

/**
 * Transform raw logbook entry data from Webfleet API
 */
export function transformLogbookEntryData(rawEntry: any): WebfleetLogbookEntry {
	return {
		logId: rawEntry.logid || rawEntry.logId || generateLogId(rawEntry),
		driverNo: rawEntry.driverno || rawEntry.driverNo || '',
		driverName: rawEntry.drivername || rawEntry.driverName || '',
		timestamp: formatWebfleetTimestamp(rawEntry.timestamp || rawEntry.time),
		activity: mapActivityType(rawEntry.activity || rawEntry.activitytype),
		duration: parseInt(rawEntry.duration) || 0,
		location: rawEntry.latitude && rawEntry.longitude ? {
			latitude: parseFloat(rawEntry.latitude),
			longitude: parseFloat(rawEntry.longitude),
			address: rawEntry.address || '',
		} : undefined,
		vehicleNo: rawEntry.vehicleno || rawEntry.vehicleNo,
		vehicleName: rawEntry.vehiclename || rawEntry.vehicleName,
	};
}

/**
 * Transform raw order data from Webfleet API
 */
export function transformOrderData(rawOrder: any): WebfleetOrder {
	return {
		orderId: rawOrder.orderid || rawOrder.orderId || '',
		orderNo: rawOrder.orderno || rawOrder.orderNo || '',
		status: mapOrderStatus(rawOrder.status),
		priority: mapOrderPriority(rawOrder.priority),
		type: mapOrderType(rawOrder.type || rawOrder.ordertype),
		vehicleNo: rawOrder.vehicleno || rawOrder.vehicleNo,
		vehicleName: rawOrder.vehiclename || rawOrder.vehicleName,
		driverNo: rawOrder.driverno || rawOrder.driverNo,
		driverName: rawOrder.drivername || rawOrder.driverName,
		customer: {
			name: rawOrder.customername || rawOrder.customer?.name || '',
			address: rawOrder.customeraddress || rawOrder.customer?.address || '',
			phone: rawOrder.customerphone || rawOrder.customer?.phone,
			email: rawOrder.customeremail || rawOrder.customer?.email,
		},
		destination: {
			latitude: parseFloat(rawOrder.destlat || rawOrder.destination?.latitude) || 0,
			longitude: parseFloat(rawOrder.destlon || rawOrder.destination?.longitude) || 0,
			address: rawOrder.destaddress || rawOrder.destination?.address || '',
			city: rawOrder.destcity || rawOrder.destination?.city || '',
			postalCode: rawOrder.destpostal || rawOrder.destination?.postalCode || '',
			country: rawOrder.destcountry || rawOrder.destination?.country || '',
		},
		plannedDate: formatWebfleetTimestamp(rawOrder.planneddate || rawOrder.plannedDate),
		actualStartTime: formatWebfleetTimestamp(rawOrder.actualstart || rawOrder.actualStartTime),
		actualEndTime: formatWebfleetTimestamp(rawOrder.actualend || rawOrder.actualEndTime),
		estimatedDuration: parseInt(rawOrder.estimatedduration || rawOrder.estimatedDuration) || 0,
		actualDuration: parseInt(rawOrder.actualduration || rawOrder.actualDuration),
		description: rawOrder.description || '',
		notes: rawOrder.notes,
	};
}

/**
 * Transform raw event data from Webfleet API
 */
export function transformEventData(rawEvent: any): WebfleetEvent {
	return {
		eventId: rawEvent.eventid || rawEvent.eventId || generateEventId(rawEvent),
		eventType: mapEventType(rawEvent.eventtype || rawEvent.eventType),
		severity: mapEventSeverity(rawEvent.severity),
		objectNo: rawEvent.objectno || rawEvent.objectNo || '',
		objectName: rawEvent.objectname || rawEvent.objectName || '',
		driverNo: rawEvent.driverno || rawEvent.driverNo,
		driverName: rawEvent.drivername || rawEvent.driverName,
		timestamp: formatWebfleetTimestamp(rawEvent.timestamp || rawEvent.time),
		location: {
			latitude: parseFloat(rawEvent.latitude || rawEvent.lat) || 0,
			longitude: parseFloat(rawEvent.longitude || rawEvent.lng || rawEvent.lon) || 0,
			address: rawEvent.address || '',
		},
		description: rawEvent.description || '',
		value: parseFloat(rawEvent.value),
		unit: rawEvent.unit,
	};
}

/**
 * Transform raw geofence data from Webfleet API
 */
export function transformGeofenceData(rawGeofence: any): WebfleetGeofence {
	const type = rawGeofence.type || (rawGeofence.radius ? 'circle' : 'polygon');
	
	return {
		geofenceId: rawGeofence.geofenceid || rawGeofence.geofenceId || '',
		geofenceName: rawGeofence.geofencename || rawGeofence.geofenceName || '',
		type,
		isActive: rawGeofence.isactive === '1' || rawGeofence.isActive === true,
		description: rawGeofence.description,
		center: type === 'circle' && rawGeofence.latitude && rawGeofence.longitude ? {
			latitude: parseFloat(rawGeofence.latitude),
			longitude: parseFloat(rawGeofence.longitude),
		} : undefined,
		radius: type === 'circle' ? parseFloat(rawGeofence.radius) : undefined,
		vertices: type === 'polygon' && rawGeofence.vertices ? 
			rawGeofence.vertices.map((vertex: any) => ({
				latitude: parseFloat(vertex.latitude || vertex.lat),
				longitude: parseFloat(vertex.longitude || vertex.lng || vertex.lon),
			})) : undefined,
		alertOnEntry: rawGeofence.alertonentry === '1' || rawGeofence.alertOnEntry === true,
		alertOnExit: rawGeofence.alertonexit === '1' || rawGeofence.alertOnExit === true,
		speedLimit: parseFloat(rawGeofence.speedlimit || rawGeofence.speedLimit),
	};
}

// Helper functions

/**
 * Format Webfleet timestamp to ISO string
 */
function formatWebfleetTimestamp(timestamp: string | number): string {
	if (!timestamp) return '';
	
	// Handle Unix timestamp
	if (typeof timestamp === 'number' || /^\d+$/.test(timestamp)) {
		return new Date(parseInt(timestamp.toString()) * (timestamp.toString().length === 10 ? 1000 : 1)).toISOString();
	}
	
	// Handle various date formats
	try {
		return parseISO(timestamp.toString()).toISOString();
	} catch {
		return timestamp.toString();
	}
}

/**
 * Format Webfleet date to YYYY-MM-DD format
 */
function formatWebfleetDate(date: string): string {
	if (!date) return '';
	
	try {
		return format(parseISO(date), 'yyyy-MM-dd');
	} catch {
		return date;
	}
}

/**
 * Generate trip ID from raw trip data
 */
function generateTripId(rawTrip: any): string {
	const objectNo = rawTrip.objectno || rawTrip.objectNo || 'unknown';
	const startTime = rawTrip.starttime || rawTrip.startTime || Date.now();
	return `${objectNo}_${startTime}`;
}

/**
 * Generate log ID from raw logbook entry
 */
function generateLogId(rawEntry: any): string {
	const driverNo = rawEntry.driverno || rawEntry.driverNo || 'unknown';
	const timestamp = rawEntry.timestamp || rawEntry.time || Date.now();
	return `${driverNo}_${timestamp}`;
}

/**
 * Generate event ID from raw event data
 */
function generateEventId(rawEvent: any): string {
	const objectNo = rawEvent.objectno || rawEvent.objectNo || 'unknown';
	const timestamp = rawEvent.timestamp || rawEvent.time || Date.now();
	const eventType = rawEvent.eventtype || rawEvent.eventType || 'unknown';
	return `${objectNo}_${eventType}_${timestamp}`;
}

/**
 * Map Webfleet activity type to standardized format
 */
function mapActivityType(activityType: string): 'driving' | 'work' | 'available' | 'break' | 'rest' {
	const type = activityType?.toLowerCase() || '';
	
	if (type.includes('driv')) return 'driving';
	if (type.includes('work')) return 'work';
	if (type.includes('avail')) return 'available';
	if (type.includes('break')) return 'break';
	if (type.includes('rest')) return 'rest';
	
	return 'work'; // default
}

/**
 * Map Webfleet order status to standardized format
 */
function mapOrderStatus(status: string): 'planned' | 'sent' | 'accepted' | 'started' | 'finished' | 'cancelled' {
	const s = status?.toLowerCase() || '';
	
	if (s.includes('plan')) return 'planned';
	if (s.includes('sent')) return 'sent';
	if (s.includes('accept')) return 'accepted';
	if (s.includes('start')) return 'started';
	if (s.includes('finish') || s.includes('complet')) return 'finished';
	if (s.includes('cancel')) return 'cancelled';
	
	return 'planned'; // default
}

/**
 * Map Webfleet order priority to standardized format
 */
function mapOrderPriority(priority: string | number): 'low' | 'normal' | 'high' | 'urgent' {
	const p = priority?.toString().toLowerCase() || '';
	
	if (p.includes('low') || p === '1') return 'low';
	if (p.includes('high') || p === '3') return 'high';
	if (p.includes('urgent') || p === '4') return 'urgent';
	
	return 'normal'; // default
}

/**
 * Map Webfleet order type to standardized format
 */
function mapOrderType(type: string): 'pickup' | 'delivery' | 'service' | 'other' {
	const t = type?.toLowerCase() || '';
	
	if (t.includes('pickup') || t.includes('collect')) return 'pickup';
	if (t.includes('deliver') || t.includes('drop')) return 'delivery';
	if (t.includes('service') || t.includes('maintain')) return 'service';
	
	return 'other'; // default
}

/**
 * Map Webfleet event type to standardized format
 */
function mapEventType(eventType: string): 'speeding' | 'idling' | 'harsh_braking' | 'harsh_acceleration' | 'geofence' | 'panic' | 'maintenance' | 'other' {
	const type = eventType?.toLowerCase() || '';
	
	if (type.includes('speed')) return 'speeding';
	if (type.includes('idl') || type.includes('idle')) return 'idling';
	if (type.includes('harsh') && type.includes('brak')) return 'harsh_braking';
	if (type.includes('harsh') && type.includes('accel')) return 'harsh_acceleration';
	if (type.includes('geofence') || type.includes('fence')) return 'geofence';
	if (type.includes('panic') || type.includes('sos')) return 'panic';
	if (type.includes('mainten') || type.includes('service')) return 'maintenance';
	
	return 'other'; // default
}

/**
 * Map Webfleet event severity to standardized format
 */
function mapEventSeverity(severity: string | number): 'low' | 'medium' | 'high' | 'critical' {
	const s = severity?.toString().toLowerCase() || '';
	
	if (s.includes('low') || s === '1') return 'low';
	if (s.includes('medium') || s === '2') return 'medium';
	if (s.includes('high') || s === '3') return 'high';
	if (s.includes('critical') || s === '4') return 'critical';
	
	return 'medium'; // default
}

/**
 * Transform violation data
 */
function transformViolationData(rawViolation: any): any {
	return {
		violationType: rawViolation.violationtype || rawViolation.type || 'other',
		severity: mapEventSeverity(rawViolation.severity),
		timestamp: formatWebfleetTimestamp(rawViolation.timestamp || rawViolation.time),
		duration: parseInt(rawViolation.duration) || 0,
		description: rawViolation.description || '',
	};
}