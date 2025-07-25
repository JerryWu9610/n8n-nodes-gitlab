import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { ApiHandler, gitlabApiRequest } from '../gitlabApiRequest';

const apiHandlers: { [key: string]: ApiHandler } = {
	list: (gitlab, body) => {
		return gitlab.MergeRequests.all({
			projectId: body.projectId as string,
			maxPages: body.maxPages as number ?? 1,
			perPage: 20,
			showExpanded: true,
		});
	},
	create: (gitlab, body) => {
		return gitlab.MergeRequests.create(
			body.projectId as string,
			body.sourceBranch as string,
			body.targetBranch as string,
			body.title as string,
		);
	},
	update: (gitlab, body) => {
		return gitlab.MergeRequests.edit(
			body.projectId as string,
			body.mergeRequestIid as number,
			{
				title: body.title as string,
			},
		);
	},
	delete: (gitlab, body) => {
		return gitlab.MergeRequests.remove(body.projectId as string, body.mergeRequestIid as number);
	},
};

export function execute(this: IExecuteFunctions, operation: string, body: IDataObject): Promise<any> {
	return gitlabApiRequest.call(this, { operation, body }, apiHandlers);
}
