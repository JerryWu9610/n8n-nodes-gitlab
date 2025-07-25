
import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { ApiHandler, gitlabApiRequest } from '../gitlabApiRequest';

const apiHandlers: { [key: string]: ApiHandler } = {
	list: (gitlab, body) => {
		return gitlab.Branches.all(body.projectId as string, {
			maxPages: body.maxPages as number ?? 1,
			perPage: 20,
			showExpanded: true,
		});
	},
	get: (gitlab, body) => {
		return gitlab.Branches.show(body.projectId as string, body.branch as string);
	},
	create: (gitlab, body) => {
		return gitlab.Branches.create(body.projectId as string, body.branch as string, body.ref as string);
	},
	delete: async (gitlab, body) => {
		if (!body.deleteProtected) {
			const branchInfo = await gitlab.Branches.show(body.projectId as string, body.branch as string);
			if (branchInfo.protected) {
				throw new Error('This is a protected branch. To delete it, please check the "Delete Protected Branch" option.');
			}
		}
		return gitlab.Branches.remove(body.projectId as string, body.branch as string);
	},
};

export function execute(this: IExecuteFunctions, operation: string, body: IDataObject): Promise<any> {
	return gitlabApiRequest.call(this, { operation, body }, apiHandlers);
}
