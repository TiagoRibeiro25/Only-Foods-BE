import { Response } from 'express';
import mongodb from '../../config/mongo.config';
import redis from '../../config/redis.config';
import { Request } from '../../types';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

export default async (req: Request, res: Response): Promise<void> => {
	try {
		// Get the cookie authorization (req.cookies['authorization'])
		const cookie = req.cookies['authorization'];

		// Delete the cookie authorization
		res.clearCookie('authorization');

		// Delete the token from the Redis cache and MongoDB collection
		await redis.del(cookie);
		await mongodb.db.collection('tokens').deleteOne({ token: cookie });

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
