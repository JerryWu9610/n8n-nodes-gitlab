
import { IExecuteFunctions } from 'n8n-workflow';
import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	INodeInputConfiguration,
	INodeOutputConfiguration,
} from 'n8n-workflow';
import { execute } from './GitLabFile.node.helper';


export class GitLabFile implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GitLab File',
		name: 'gitLabFile',
		icon: 'file:GitLabFile.svg',
		group: ['apps'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with GitLab repository files',
		defaults: {
			name: 'GitLab File',
		},
		inputs: ['main'] as [NodeConnectionType | INodeInputConfiguration],
		outputs: ['main'] as [NodeConnectionType | INodeOutputConfiguration],
		credentials: [
			{
				name: 'gitlabApi',
			},
		],
		properties: [
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
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Tree',
						value: 'getTree',
						action: 'Get a repository tree',
					},
					{
						name: 'Get File',
						value: 'getFile',
						action: 'Get a file',
					},
				],
				default: 'getTree',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: true,
				description: 'The ID or URL-encoded path of the project',
				displayOptions: {
					show: {
						operation: ['getTree', 'getFile'],
					},
				},
			},
			{
				displayName: 'Path',
				name: 'filePath',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['getTree'],
					},
				},
				description: 'The path inside repository. Used to get content of subdirectories',
			},
			{
				displayName: 'Path',
				name: 'filePath',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['getFile'],
					},
				},
				description: 'The path of the file to retrieve',
			},
			{
				displayName: 'Ref',
				name: 'ref',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['getTree', 'getFile'],
					},
				},
				description: 'The name of a repository branch or tag or if not given the default branch',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						operation: ['getTree'],
					},
				},
				options: [
					{
						displayName: 'Recursive',
						name: 'recursive',
						type: 'boolean',
						default: false,
						description: 'Whether to get the tree recursively',
					},
					{
						displayName: 'Max Pages',
						name: 'maxPages',
						type: 'number',
						default: 1,
						description: 'The maximum number of pages to return. Each page can contain up to 20 items.',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<any> {
		const items = this.getInputData();
		const returnData = [];

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i, '') as string;
			const projectId = this.getNodeParameter('projectId', i, '') as string;
			const filePath = this.getNodeParameter('filePath', i, '') as string;
			const ref = this.getNodeParameter('ref', i, '') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as {
				recursive?: boolean;
				maxPages?: number;
			};

			const body = {
				projectId,
				filePath,
				ref,
				...additionalFields,
			};

			const responseData = await execute.call(this, operation, body);
			returnData.push(responseData);
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
