import { NextFunction, Response } from 'express';
import { Request } from '../../types';
import handleError from '../../utils/handleError';

export default (req: Request, res: Response, next: NextFunction): void => {
	const isUserBlocked: boolean = req.tokenData.isBlocked;

	try {
		// Check if the user is blocked
		if (isUserBlocked) {
			throw new Error('You are blocked');
		}

		// Call the next middleware
		next();
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
