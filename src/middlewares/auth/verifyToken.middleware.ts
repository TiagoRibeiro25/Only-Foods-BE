import { NextFunction, Response } from 'express';
import { Request } from '../../types';
import handleError from '../../utils/handleError';

/**
 * This middleware will check if the user is logged in by checking if there's a token in the request.
 * If there's no token, it will call the error handler middleware with the error "No token provided" and the status code 401.
 * If there's a token, it will call the next middleware.
 */
export default (req: Request, res: Response, next: NextFunction): void => {
	// Get token value
	const token: string | undefined = req.cookies['authorization'];

	try {
		// Check if there's a token
		if (!token) {
			throw new Error('No token provided');
		}

		// Call the next middleware
		next();
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
