import { Response } from 'express';
import { getDeleteCookiesOptions } from '../../config/cookies.config';
import redis from '../../config/redis.config';
import { Request } from '../../types';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

export default async (req: Request, res: Response): Promise<void> => {
	try {
		// Delete the cookie authorization
		const deleteCookiesOptions = getDeleteCookiesOptions();
		res.clearCookie('onlyfoods_jwt', deleteCookiesOptions);

		// Delete the token from Redis
		await redis.del(req.tokenData.id.toString());

		// Send the response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'User logged out successfully',
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
