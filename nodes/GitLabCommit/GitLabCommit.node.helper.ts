import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { ApiHandler, gitlabApiRequest } from '../gitlabApiRequest';

const apiHandlers: { [key: string]: ApiHandler } = {
	list: (gitlab, body) => {
		return gitlab.Commits.all(body.projectId as string, {
			maxPages: body.maxPages as number ?? 1,
			perPage: 20,
			showExpanded: true,
		});
	},
	get: (gitlab, body) => {
		return gitlab.Commits.show(body.projectId as string, body.sha as string);
	},
	diff: (gitlab, body) => {
		return gitlab.Commits.showDiff(body.projectId as string, body.sha as string);
	},
	compare: (gitlab, body) => {
		return gitlab.Repositories.compare(
			body.projectId as string,
			body.from as string,
			body.to as string,
		);
	},
};

export function execute(this: IExecuteFunctions, operation: string, body: IDataObject): Promise<any> {
	return gitlabApiRequest.call(this, { operation, body }, apiHandlers);
}
