import { NextFunction, Response } from 'express';
import { Request } from 'types';
import handleError from '../../utils/handleError';
import validateData from '../../utils/validateData';

export default (req: Request, res: Response, next: NextFunction): void => {
	const page = req.query.page as string;
	const limit = req.query.limit as string;

	try {
		// Check if the page and limit are valid numbers
		if (!validateData.pagination({ page, limit })) {
			throw new Error('Invalid query value');
		}

		// Call the next middleware
		next();
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
