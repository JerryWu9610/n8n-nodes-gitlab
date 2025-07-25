
import { IExecuteFunctions } from 'n8n-workflow';
import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	INodeInputConfiguration,
	INodeOutputConfiguration,
} from 'n8n-workflow';
import { execute } from './GitLabBranch.node.helper';

export class GitLabBranch implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GitLab Branch',
		name: 'gitLabBranch',
		icon: 'file:GitLabBranch.svg',
		group: ['apps'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with GitLab branches',
		defaults: {
			name: 'GitLab Branch',
		},
		inputs: ['main'] as [NodeConnectionType | INodeInputConfiguration],
		outputs: ['main'] as [NodeConnectionType | INodeOutputConfiguration],
		credentials: [
			{
				name: 'gitlabApi',
			},
		],
		properties: [
			// Authentication
			{
				displayName: 'Host',
				name: 'host',
				type: 'string',
				default: '',
				placeholder: 'https://gitlab.com',
				description: 'GitLab instance host. Required if not using a credential.',
			},
			{
				displayName: 'Access Token',
				name: 'accessToken',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'GitLab access token. Required if not using a credential.',
			},
			// Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'List Branches',
						value: 'list',
						action: 'List repository branches',
					},
					{
						name: 'Get Branch',
						value: 'get',
						action: 'Get a single repository branch',
					},
					{
						name: 'Create Branch',
						value: 'create',
						action: 'Create a new branch',
					},
					{
						name: 'Delete Branch',
						value: 'delete',
						action: 'Delete a branch',
					},
				],
				default: 'list',
			},
			// Parameters
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: true,
				description: 'The ID or URL-encoded path of the project',
			},
			{
				displayName: 'Branch Name',
				name: 'branch',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['get', 'delete'],
					},
				},
				description: 'The name of the branch',
			},
			{
				displayName: 'Branch Name',
				name: 'branch',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
				description: 'The name of the new branch',
			},
			{
				displayName: 'Ref',
				name: 'ref',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
				description: 'The branch name or commit SHA to create branch from',
			},
			{
				displayName: 'Delete Protected Branch',
				name: 'deleteProtected',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						operation: ['delete'],
					},
				},
				description: 'Whether to allow the deletion of a protected branch',
			},
			{
				displayName: 'Max Pages',
				name: 'maxPages',
				type: 'number',
				default: 1,
				displayOptions: {
					show: {
						operation: ['list'],
					},
				},
				description: 'The maximum number of pages to return. Each page can contain up to 20 items.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<any> {
		const items = this.getInputData();
		const returnData = [];

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i, '') as string;
			const projectId = this.getNodeParameter('projectId', i, '') as string;
			const branch = this.getNodeParameter('branch', i, '') as string;
			const ref = this.getNodeParameter('ref', i, '') as string;
			const deleteProtected = this.getNodeParameter('deleteProtected', i, false) as boolean;
			const maxPages = this.getNodeParameter('maxPages', i, 1) as number;

			const body = {
				projectId,
				branch,
				ref,
				deleteProtected,
				maxPages,
			};

			const responseData = await execute.call(this, operation, body);
			returnData.push(responseData);
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
