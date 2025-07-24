
import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { ApiHandler, gitlabApiRequest } from '../gitlabApiRequest';

const apiHandlers: { [key: string]: ApiHandler } = {
	getTree: (gitlab, body) => {
		return gitlab.Repositories.allRepositoryTrees(body.projectId as string, {
			path: body.filePath as string,
			ref: body.ref as string,
			recursive: body.recursive as boolean,
		});
	},
	getFile: (gitlab, body) => {
		return gitlab.RepositoryFiles.show(
			body.projectId as string,
			body.filePath as string,
			body.ref as string,
		);
	},
};


export function execute(this: IExecuteFunctions, operation: string, body: IDataObject): Promise<any> {
	return gitlabApiRequest.call(this, { operation, body }, apiHandlers);
}
