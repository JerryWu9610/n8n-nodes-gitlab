
import { IExecuteFunctions, IDataObject, NodeApiError } from 'n8n-workflow';
import { Gitlab } from '@gitbeaker/rest';

type GitlabApiClient = InstanceType<typeof Gitlab>;
export type ApiHandler = (gitlab: GitlabApiClient, body: IDataObject) => Promise<any>;

export async function gitlabApiRequest(
	this: IExecuteFunctions,
	{ operation, body }: { operation: string; body: IDataObject },
	apiHandlers: { [key: string]: ApiHandler },
): Promise<any> {
	let host = this.getNodeParameter('host', 0, '') as string;
	let accessToken = this.getNodeParameter('accessToken', 0, '') as string;

	if (!host || !accessToken) {
		try {
			const credentials = await this.getCredentials('gitlabApi', 0);
			host = credentials.host as string;
			accessToken = credentials.accessToken as string;
		} catch (error) {
			// No credentials selected and no dynamic input provided
		}
	}

	if (!host || !accessToken) {
		throw new NodeApiError(this.getNode(), { message: 'You must either select a credential or provide a Host and Access Token.' });
	}

	const gitlab = new Gitlab({
		host: host,
		token: accessToken,
	});

	try {
		const handler = apiHandlers[operation];

		if (handler) {
			return await handler(gitlab, body);
		}

		throw new NodeApiError(this.getNode(), {
			message: `The operation '${operation}' is not supported.`,
		});
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		throw new NodeApiError(this.getNode(), { message: (error as Error).message });
	}
}
