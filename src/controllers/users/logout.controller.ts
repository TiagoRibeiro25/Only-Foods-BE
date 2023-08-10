import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { getDeleteCookiesOptions } from '../../config/cookies.config';
import redis from '../../config/redis.config';
import { DecodedToken, Request } from '../../types';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

export default async (req: Request, res: Response): Promise<void> => {
	try {
		const token: string | undefined = req.cookies['onlyfoods_jwt'];

		// Delete the cookie authorization
		const deleteCookiesOptions = getDeleteCookiesOptions();
		res.clearCookie('onlyfoods_jwt', deleteCookiesOptions);

		// Validate the token and get the user id from it
		const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

		// Delete the token from Redis
		await redis.del(decoded.id.toString());

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
