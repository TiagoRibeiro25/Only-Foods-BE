import { NextFunction, Response } from 'express';
import { Request } from '../../types';
import handleError from '../../utils/handleError';

export default (req: Request, res: Response, next: NextFunction): void => {
	try {
		// If the user is not an admin, throw an error
		if (req.tokenData.isAdmin) {
			throw new Error('Insufficient permissions');
		}

		// If the user is an admin, call the next middleware
		next();
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
