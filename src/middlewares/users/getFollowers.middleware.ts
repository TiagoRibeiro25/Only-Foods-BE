import { NextFunction, Response } from 'express';
import { FollowType, Request } from 'types';
import handleError from '../../utils/handleError';

export default (req: Request, res: Response, next: NextFunction): void => {
	const type = req.query.type as FollowType;
	const userId: string = req.params.id;

	try {
		// Check if type is valid
		if (!type || (type !== 'followers' && type !== 'following')) {
			throw new Error('Invalid users type');
		}

		// If the user id is "me", check if the user is logged in
		if (userId === 'me' && !req.tokenData) {
			throw new Error('No token provided');
		}

		// Call the next middleware
		next();
	} catch (error) {
		handleError({ error, res, fileName: __filename.split('\\').at(-1) });
	}
};
