import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class WebfleetApi implements ICredentialType {
	name = 'webfleetApi';
	displayName = 'Webfleet API';
	documentationUrl = 'https://www.webfleet.com/static/help/webfleet-connect/en_gb/index.html';
	properties: INodeProperties[] = [
		{
			displayName: 'Account',
			name: 'account',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Webfleet account name',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Webfleet username',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Webfleet password',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Webfleet API key for authentication',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://connect.webfleet.com',
			required: true,
			description: 'Base URL for Webfleet Connect API',
		},
		{
			displayName: 'Language',
			name: 'language',
			type: 'options',
			options: [
				{
					name: 'English',
					value: 'en',
				},
				{
					name: 'German',
					value: 'de',
				},
				{
					name: 'French',
					value: 'fr',
				},
				{
					name: 'Spanish',
					value: 'es',
				},
				{
					name: 'Italian',
					value: 'it',
				},
				{
					name: 'Dutch',
					value: 'nl',
				},
			],
			default: 'en',
			description: 'Language for API responses',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.username}}',
				password: '={{$credentials.password}}',
			},
			qs: {
				account: '={{$credentials.account}}',
				apikey: '={{$credentials.apiKey}}',
				lang: '={{$credentials.language}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/extern',
			method: 'GET',
			qs: {
				action: 'showAccountInfo',
			},
		},
	};
}