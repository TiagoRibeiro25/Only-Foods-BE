import { Response } from 'express';
import updateTokenWhiteList from '../services/updateTokenWhiteList';
import { Request } from '../types';
import handleError from '../utils/handleError';
import handleResponse from '../utils/handleResponse';

export default async (req: Request, res: Response): Promise<void> => {
	const { authorization } = req.headers;

	try {
		// Check if the key is not present or if it is not equal to the update token white list key
		if (!authorization || authorization !== process.env.UPDATE_TOKEN_WHITE_LIST_KEY) {
			throw new Error('Unauthorized');
		}

		// If the key is valid, then execute the function to update the token white list
		const result = await updateTokenWhiteList();

		// Send a response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: result,
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
