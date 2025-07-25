
import { IExecuteFunctions } from 'n8n-workflow';
import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	INodeInputConfiguration,
	INodeOutputConfiguration,
} from 'n8n-workflow';
import { execute } from './GitLabCommit.node.helper';

export class GitLabCommit implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GitLab Commit',
		name: 'gitLabCommit',
		icon: 'file:GitLabCommit.svg',
		group: ['apps'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with GitLab commits',
		defaults: {
			name: 'GitLab Commit',
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
						name: 'List Commits',
						value: 'list',
						action: 'List repository commits',
					},
					{
						name: 'Get Commit',
						value: 'get',
						action: 'Get a single commit',
					},
					{
						name: 'Get Commit Diff',
						value: 'diff',
						action: 'Get the diff of a commit',
					},
					{
						name: 'Compare Commits',
						value: 'compare',
						action: 'Compare two branches, tags or commits',
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
				displayName: 'Commit SHA',
				name: 'sha',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['get', 'diff'],
					},
				},
				description: 'The commit hash or name of a repository branch or tag',
			},
			{
				displayName: 'From',
				name: 'from',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['compare'],
					},
				},
				description: 'The branch name or commit SHA to compare from',
			},
			{
				displayName: 'To',
				name: 'to',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['compare'],
					},
				},
				description: 'The branch name or commit SHA to compare to',
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
			const sha = this.getNodeParameter('sha', i, '') as string;
			const from = this.getNodeParameter('from', i, '') as string;
			const to = this.getNodeParameter('to', i, '') as string;
			const maxPages = this.getNodeParameter('maxPages', i, 1) as number;

			const body = {
				projectId,
				sha,
				from,
				to,
				maxPages,
			};

			const responseData = await execute.call(this, operation, body);
			returnData.push(responseData);
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
