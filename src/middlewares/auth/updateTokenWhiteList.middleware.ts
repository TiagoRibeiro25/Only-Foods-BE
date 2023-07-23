import { Request, Response } from 'express';
import updateTokenWhiteList from '../../services/updateTokenWhiteList';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

export default async (req: Request, res: Response): Promise<void> => {
	// Get the key "authorization" from the request headers
	const { authorization } = req.headers;

	try {
		// Check if the key is not present or if it is not equal to the update token white list key
		if (!authorization || authorization !== process.env.UPDATE_TOKEN_WHITE_LIST_KEY) {
			throw new Error('Unauthorized');
		}

		// If the key is valid, then execute the function to update the token white list
		await updateTokenWhiteList();

		// Send a response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'Token white list updated successfully',
		});
	} catch (error) {
		const fileName =
			process.env.NODE_ENV !== 'production' ? __filename.split('\\').at(-1) : '';
		handleError({ res, error, fileName });
	}
};
