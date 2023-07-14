import { NextFunction, Response } from 'express';
import { Request } from 'types';
import handleError from '../../utils/handleError';
import validateData from '../../utils/validateData';

export default (req: Request, res: Response, next: NextFunction): void => {
	// Get id from url params
	const id: string = req.params.id;
	// Check if there's a token
	const isTokenProvided: boolean = req.tokenData !== undefined;

	try {
		// Validate the id
		if (!validateData.id(id)) {
			throw new Error('Invalid id');
		}

		// If the id is "me" and there's no token, return 401
		if (id === 'me' && !isTokenProvided) {
			throw new Error('No token provided');
		}

		// Call next middleware
		next();
	} catch (error) {
		const fileName =
			process.env.NODE_ENV !== 'production' ? __filename.split('\\').at(-1) : '';
		handleError({ res, error, fileName });
	}
};
