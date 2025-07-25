import { IExecuteFunctions } from 'n8n-workflow';
import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	INodeInputConfiguration,
	INodeOutputConfiguration,
} from 'n8n-workflow';
import { execute } from './GitLabMergeRequest.node.helper';

export class GitLabMergeRequest implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GitLab Merge Request',
		name: 'gitLabMergeRequest',
		icon: 'file:GitLabMergeRequest.svg',
		group: ['apps'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with GitLab merge requests',
		defaults: {
			name: 'GitLab Merge Request',
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
						name: 'List Merge Requests',
						value: 'list',
						action: 'List merge requests',
					},
					{
						name: 'Create Merge Request',
						value: 'create',
						action: 'Create a merge request',
					},
					{
						name: 'Update Merge Request',
						value: 'update',
						action: 'Update a merge request',
					},
					{
						name: 'Delete Merge Request',
						value: 'delete',
						action: 'Delete a merge request',
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
				displayName: 'Merge Request IID',
				name: 'mergeRequestIid',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						operation: ['update', 'delete'],
					},
				},
				description: 'The IID of a merge request',
			},
			{
				displayName: 'Source Branch',
				name: 'sourceBranch',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
				description: 'The source branch',
			},
			{
				displayName: 'Target Branch',
				name: 'targetBranch',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
				description: 'The target branch',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
				description: 'The title of the merge request',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['update'],
					},
				},
				description: 'The new title of the merge request',
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
		const returnData: any[] = [];

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i, '') as string;
			const projectId = this.getNodeParameter('projectId', i, '') as string;
			const mergeRequestIid = this.getNodeParameter('mergeRequestIid', i, 0) as number;
			const sourceBranch = this.getNodeParameter('sourceBranch', i, '') as string;
			const targetBranch = this.getNodeParameter('targetBranch', i, '') as string;
			const title = this.getNodeParameter('title', i, '') as string;
			const maxPages = this.getNodeParameter('maxPages', i, 1) as number;

			const body = {
				projectId,
				mergeRequestIid,
				sourceBranch,
				targetBranch,
				title,
				maxPages,
			};

			const responseData = await execute.call(this, operation, body);
			returnData.push(responseData);
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
