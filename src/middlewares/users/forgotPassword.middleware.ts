import { NextFunction, Response } from 'express';
import { Request } from 'types';
import handleError from '../../utils/handleError';
import validateData from '../../utils/validateData';

export default (req: Request, res: Response, next: NextFunction): void => {
	req.body.email = req.body.email?.toLowerCase().trim();
	const email: string = req.body.email;

	try {
		if (!email) {
			throw new Error('All fields are required');
		}

		if (typeof email !== 'string' || !validateData.email(email)) {
			throw new Error('Invalid email');
		}

		next();
	} catch (error) {
		handleError({ res, error });
	}
};