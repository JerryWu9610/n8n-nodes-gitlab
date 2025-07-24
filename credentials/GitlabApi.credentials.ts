import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class GitlabApi implements ICredentialType {
	name = 'gitlabApi';
	displayName = 'GitLab API';
	documentationUrl = 'https://docs.gitlab.com/ee/api/';
	properties: INodeProperties[] = [
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: 'https://gitlab.com',
			placeholder: 'https://gitlab.com',
			description: 'The URL of the GitLab instance.',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Your GitLab Personal Access Token.',
		},
	];
}
