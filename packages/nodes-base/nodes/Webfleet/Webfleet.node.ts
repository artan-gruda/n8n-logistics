import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IRequestOptions,
} from 'n8n-workflow';

import { NodeOperationError } from 'n8n-workflow';

export class Webfleet implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Webfleet',
		name: 'webfleet',
		icon: 'file:webfleet.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Webfleet Connect API for fleet management operations',
		defaults: {
			name: 'Webfleet',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'webfleetApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Vehicle',
						value: 'vehicle',
					},
					{
						name: 'Driver',
						value: 'driver',
					},
					{
						name: 'Order',
						value: 'order',
					},
					{
						name: 'Trip',
						value: 'trip',
					},
					{
						name: 'Event',
						value: 'event',
					},
					{
						name: 'Geofence',
						value: 'geofence',
					},
					{
						name: 'Report',
						value: 'report',
					},
				],
				default: 'vehicle',
			},
			// Vehicle Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['vehicle'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all vehicles in the fleet',
						action: 'Get all vehicles',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a specific vehicle',
						action: 'Get a vehicle',
					},
					{
						name: 'Get Position',
						value: 'getPosition',
						description: 'Get current position of vehicle(s)',
						action: 'Get vehicle position',
					},
					{
						name: 'Get Trips',
						value: 'getTrips',
						description: 'Get trip history for vehicle(s)',
						action: 'Get vehicle trips',
					},
					{
						name: 'Get Working Times',
						value: 'getWorkingTimes',
						description: 'Get working times for vehicle(s)',
						action: 'Get vehicle working times',
					},
				],
				default: 'getAll',
			},
			// Driver Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['driver'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all drivers',
						action: 'Get all drivers',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a specific driver',
						action: 'Get a driver',
					},
					{
						name: 'Get Working Times',
						value: 'getWorkingTimes',
						description: 'Get driver working times',
						action: 'Get driver working times',
					},
					{
						name: 'Get Logbook',
						value: 'getLogbook',
						description: 'Get driver logbook entries',
						action: 'Get driver logbook',
					},
				],
				default: 'getAll',
			},
			// Order Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['order'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all orders',
						action: 'Get all orders',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new order',
						action: 'Create an order',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an existing order',
						action: 'Update an order',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an order',
						action: 'Delete an order',
					},
					{
						name: 'Send',
						value: 'send',
						description: 'Send order to vehicle',
						action: 'Send order to vehicle',
					},
				],
				default: 'getAll',
			},
			// Trip Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['trip'],
					},
				},
				options: [
					{
						name: 'Get Summary',
						value: 'getSummary',
						description: 'Get trip summary report',
						action: 'Get trip summary',
					},
					{
						name: 'Get Details',
						value: 'getDetails',
						description: 'Get detailed trip information',
						action: 'Get trip details',
					},
				],
				default: 'getSummary',
			},
			// Event Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['event'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all events',
						action: 'Get all events',
					},
					{
						name: 'Get Speeding Events',
						value: 'getSpeedingEvents',
						description: 'Get speeding events',
						action: 'Get speeding events',
					},
					{
						name: 'Get Idling Events',
						value: 'getIdlingEvents',
						description: 'Get idling events',
						action: 'Get idling events',
					},
					{
						name: 'Get Driving Time Events',
						value: 'getDrivingTimeEvents',
						description: 'Get driving time events',
						action: 'Get driving time events',
					},
				],
				default: 'getAll',
			},
			// Geofence Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['geofence'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all geofences',
						action: 'Get all geofences',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new geofence',
						action: 'Create a geofence',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an existing geofence',
						action: 'Update a geofence',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a geofence',
						action: 'Delete a geofence',
					},
				],
				default: 'getAll',
			},
			// Report Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['report'],
					},
				},
				options: [
					{
						name: 'Fleet Utilization',
						value: 'fleetUtilization',
						description: 'Get fleet utilization report',
						action: 'Get fleet utilization report',
					},
					{
						name: 'Fuel Consumption',
						value: 'fuelConsumption',
						description: 'Get fuel consumption report',
						action: 'Get fuel consumption report',
					},
					{
						name: 'Driving Behaviour',
						value: 'drivingBehaviour',
						description: 'Get driving behaviour report',
						action: 'Get driving behaviour report',
					},
					{
						name: 'Mileage',
						value: 'mileage',
						description: 'Get mileage report',
						action: 'Get mileage report',
					},
				],
				default: 'fleetUtilization',
			},
			// Common fields
			{
				displayName: 'Vehicle Object Name',
				name: 'vehicleObjectName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['vehicle'],
						operation: ['get', 'getPosition', 'getTrips', 'getWorkingTimes'],
					},
				},
				default: '',
				description: 'Name of the vehicle object',
			},
			{
				displayName: 'Driver Object Name',
				name: 'driverObjectName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['driver'],
						operation: ['get', 'getWorkingTimes', 'getLogbook'],
					},
				},
				default: '',
				description: 'Name of the driver object',
			},
			{
				displayName: 'Object Names',
				name: 'objectNames',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['vehicle', 'driver'],
						operation: ['getAll'],
					},
				},
				default: '',
				description: 'Comma-separated list of object names to filter results (optional)',
			},
			{
				displayName: 'Range From',
				name: 'rangeFrom',
				type: 'dateTime',
				displayOptions: {
					show: {
						operation: ['getTrips', 'getWorkingTimes', 'getLogbook', 'getSummary', 'getDetails', 'getAll'],
					},
				},
				default: '',
				description: 'Start date and time for the query range',
			},
			{
				displayName: 'Range To',
				name: 'rangeTo',
				type: 'dateTime',
				displayOptions: {
					show: {
						operation: ['getTrips', 'getWorkingTimes', 'getLogbook', 'getSummary', 'getDetails', 'getAll'],
					},
				},
				default: '',
				description: 'End date and time for the query range',
			},
			{
				displayName: 'Additional Parameters',
				name: 'additionalParameters',
				type: 'collection',
				placeholder: 'Add Parameter',
				default: {},
				options: [
					{
						displayName: 'Offset',
						name: 'offset',
						type: 'number',
						default: 0,
						description: 'Number of records to skip',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 100,
						description: 'Maximum number of records to return',
					},
					{
						displayName: 'Time Zone',
						name: 'timeZone',
						type: 'string',
						default: 'UTC',
						description: 'Time zone for date/time values',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				if (resource === 'vehicle') {
					responseData = await this.executeVehicleOperation(i, operation);
				} else if (resource === 'driver') {
					responseData = await this.executeDriverOperation(i, operation);
				} else if (resource === 'order') {
					responseData = await this.executeOrderOperation(i, operation);
				} else if (resource === 'trip') {
					responseData = await this.executeTripOperation(i, operation);
				} else if (resource === 'event') {
					responseData = await this.executeEventOperation(i, operation);
				} else if (resource === 'geofence') {
					responseData = await this.executeGeofenceOperation(i, operation);
				} else if (resource === 'report') {
					responseData = await this.executeReportOperation(i, operation);
				}

				if (Array.isArray(responseData)) {
					returnData.push(...responseData.map(item => ({ json: item })));
				} else {
					returnData.push({ json: responseData });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}

	private async makeWebfleetRequest(
		this: IExecuteFunctions,
		action: string,
		params: Record<string, any> = {},
	): Promise<any> {
		const credentials = await this.getCredentials('webfleetApi');

		const options: IRequestOptions = {
			method: 'GET',
			baseURL: credentials.baseUrl as string,
			url: '/extern',
			qs: {
				action,
				account: credentials.account,
				apikey: credentials.apiKey,
				lang: credentials.language || 'en',
				...params,
			},
			json: true,
		};

		try {
			const response = await this.helpers.request(options);
			
			if (response.errorCode && response.errorCode !== 0) {
				throw new NodeOperationError(this.getNode(), `Webfleet API Error: ${response.errorMsg || 'Unknown error'}`);
			}

			return response;
		} catch (error) {
			throw new NodeOperationError(this.getNode(), `Failed to make Webfleet API request: ${error.message}`);
		}
	}

	private async executeVehicleOperation(this: IExecuteFunctions, itemIndex: number, operation: string): Promise<any> {
		const additionalParams = this.getNodeParameter('additionalParameters', itemIndex) as Record<string, any>;

		switch (operation) {
			case 'getAll':
				const objectNames = this.getNodeParameter('objectNames', itemIndex) as string;
				return this.makeWebfleetRequest('showVehicleList', {
					objectNames: objectNames || undefined,
					...additionalParams,
				});

			case 'get':
				const vehicleObjectName = this.getNodeParameter('vehicleObjectName', itemIndex) as string;
				return this.makeWebfleetRequest('showVehicleInfo', {
					objectNo: vehicleObjectName,
					...additionalParams,
				});

			case 'getPosition':
				const vehicleForPosition = this.getNodeParameter('vehicleObjectName', itemIndex) as string;
				return this.makeWebfleetRequest('showObjectData', {
					objectNo: vehicleForPosition,
					...additionalParams,
				});

			case 'getTrips':
				const vehicleForTrips = this.getNodeParameter('vehicleObjectName', itemIndex) as string;
				const rangeFrom = this.getNodeParameter('rangeFrom', itemIndex) as string;
				const rangeTo = this.getNodeParameter('rangeTo', itemIndex) as string;
				return this.makeWebfleetRequest('showTrips', {
					objectNo: vehicleForTrips,
					rangeFrom,
					rangeTo,
					...additionalParams,
				});

			case 'getWorkingTimes':
				const vehicleForWorkingTimes = this.getNodeParameter('vehicleObjectName', itemIndex) as string;
				const workingTimeFrom = this.getNodeParameter('rangeFrom', itemIndex) as string;
				const workingTimeTo = this.getNodeParameter('rangeTo', itemIndex) as string;
				return this.makeWebfleetRequest('showWorkingTimes', {
					objectNo: vehicleForWorkingTimes,
					rangeFrom: workingTimeFrom,
					rangeTo: workingTimeTo,
					...additionalParams,
				});

			default:
				throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported for vehicles`);
		}
	}

	private async executeDriverOperation(this: IExecuteFunctions, itemIndex: number, operation: string): Promise<any> {
		const additionalParams = this.getNodeParameter('additionalParameters', itemIndex) as Record<string, any>;

		switch (operation) {
			case 'getAll':
				const objectNames = this.getNodeParameter('objectNames', itemIndex) as string;
				return this.makeWebfleetRequest('showDriverList', {
					objectNames: objectNames || undefined,
					...additionalParams,
				});

			case 'get':
				const driverObjectName = this.getNodeParameter('driverObjectName', itemIndex) as string;
				return this.makeWebfleetRequest('showDriverInfo', {
					objectNo: driverObjectName,
					...additionalParams,
				});

			case 'getWorkingTimes':
				const driverForWorkingTimes = this.getNodeParameter('driverObjectName', itemIndex) as string;
				const workingTimeFrom = this.getNodeParameter('rangeFrom', itemIndex) as string;
				const workingTimeTo = this.getNodeParameter('rangeTo', itemIndex) as string;
				return this.makeWebfleetRequest('showDriverWorkingTimes', {
					objectNo: driverForWorkingTimes,
					rangeFrom: workingTimeFrom,
					rangeTo: workingTimeTo,
					...additionalParams,
				});

			case 'getLogbook':
				const driverForLogbook = this.getNodeParameter('driverObjectName', itemIndex) as string;
				const logbookFrom = this.getNodeParameter('rangeFrom', itemIndex) as string;
				const logbookTo = this.getNodeParameter('rangeTo', itemIndex) as string;
				return this.makeWebfleetRequest('showLogbook', {
					objectNo: driverForLogbook,
					rangeFrom: logbookFrom,
					rangeTo: logbookTo,
					...additionalParams,
				});

			default:
				throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported for drivers`);
		}
	}

	private async executeOrderOperation(this: IExecuteFunctions, itemIndex: number, operation: string): Promise<any> {
		const additionalParams = this.getNodeParameter('additionalParameters', itemIndex) as Record<string, any>;

		switch (operation) {
			case 'getAll':
				return this.makeWebfleetRequest('showOrderList', additionalParams);

			case 'create':
				// Order creation would require additional fields - this is a simplified version
				return this.makeWebfleetRequest('insertOrder', additionalParams);

			case 'update':
				return this.makeWebfleetRequest('updateOrder', additionalParams);

			case 'delete':
				return this.makeWebfleetRequest('deleteOrder', additionalParams);

			case 'send':
				return this.makeWebfleetRequest('sendOrderToVehicle', additionalParams);

			default:
				throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported for orders`);
		}
	}

	private async executeTripOperation(this: IExecuteFunctions, itemIndex: number, operation: string): Promise<any> {
		const additionalParams = this.getNodeParameter('additionalParameters', itemIndex) as Record<string, any>;
		const rangeFrom = this.getNodeParameter('rangeFrom', itemIndex) as string;
		const rangeTo = this.getNodeParameter('rangeTo', itemIndex) as string;

		switch (operation) {
			case 'getSummary':
				return this.makeWebfleetRequest('showTripSummary', {
					rangeFrom,
					rangeTo,
					...additionalParams,
				});

			case 'getDetails':
				return this.makeWebfleetRequest('showTripDetails', {
					rangeFrom,
					rangeTo,
					...additionalParams,
				});

			default:
				throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported for trips`);
		}
	}

	private async executeEventOperation(this: IExecuteFunctions, itemIndex: number, operation: string): Promise<any> {
		const additionalParams = this.getNodeParameter('additionalParameters', itemIndex) as Record<string, any>;
		const rangeFrom = this.getNodeParameter('rangeFrom', itemIndex) as string;
		const rangeTo = this.getNodeParameter('rangeTo', itemIndex) as string;

		switch (operation) {
			case 'getAll':
				return this.makeWebfleetRequest('showEventList', {
					rangeFrom,
					rangeTo,
					...additionalParams,
				});

			case 'getSpeedingEvents':
				return this.makeWebfleetRequest('showSpeedingEvents', {
					rangeFrom,
					rangeTo,
					...additionalParams,
				});

			case 'getIdlingEvents':
				return this.makeWebfleetRequest('showIdlingEvents', {
					rangeFrom,
					rangeTo,
					...additionalParams,
				});

			case 'getDrivingTimeEvents':
				return this.makeWebfleetRequest('showDrivingTimeEvents', {
					rangeFrom,
					rangeTo,
					...additionalParams,
				});

			default:
				throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported for events`);
		}
	}

	private async executeGeofenceOperation(this: IExecuteFunctions, itemIndex: number, operation: string): Promise<any> {
		const additionalParams = this.getNodeParameter('additionalParameters', itemIndex) as Record<string, any>;

		switch (operation) {
			case 'getAll':
				return this.makeWebfleetRequest('showGeofenceList', additionalParams);

			case 'create':
				return this.makeWebfleetRequest('insertGeofence', additionalParams);

			case 'update':
				return this.makeWebfleetRequest('updateGeofence', additionalParams);

			case 'delete':
				return this.makeWebfleetRequest('deleteGeofence', additionalParams);

			default:
				throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported for geofences`);
		}
	}

	private async executeReportOperation(this: IExecuteFunctions, itemIndex: number, operation: string): Promise<any> {
		const additionalParams = this.getNodeParameter('additionalParameters', itemIndex) as Record<string, any>;
		const rangeFrom = this.getNodeParameter('rangeFrom', itemIndex) as string;
		const rangeTo = this.getNodeParameter('rangeTo', itemIndex) as string;

		switch (operation) {
			case 'fleetUtilization':
				return this.makeWebfleetRequest('getFleetUtilizationReport', {
					rangeFrom,
					rangeTo,
					...additionalParams,
				});

			case 'fuelConsumption':
				return this.makeWebfleetRequest('getFuelConsumptionReport', {
					rangeFrom,
					rangeTo,
					...additionalParams,
				});

			case 'drivingBehaviour':
				return this.makeWebfleetRequest('getDrivingBehaviourReport', {
					rangeFrom,
					rangeTo,
					...additionalParams,
				});

			case 'mileage':
				return this.makeWebfleetRequest('getMileageReport', {
					rangeFrom,
					rangeTo,
					...additionalParams,
				});

			default:
				throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported for reports`);
		}
	}
}