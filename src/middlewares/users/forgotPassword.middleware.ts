import { NextFunction, Response } from 'express';
import { Request } from 'types';
import handleError from '../../utils/handleError';
import validateData from '../../utils/validateData';

export default (req: Request, res: Response, next: NextFunction): void => {
	req.body.email = req.body.email?.toLowerCase().trim();
	const email: string = req.body.email;

	try {
		// Check if the email is provided
		if (!email) {
			throw new Error('All fields are required');
		}

		// Check if the email is valid
		if (!validateData.email(email)) {
			throw new Error('Invalid email');
		}

		next();
	} catch (error) {
		const fileName =
			process.env.NODE_ENV !== 'production' ? __filename.split('\\').at(-1) : '';
		handleError({ res, error, fileName });
	}
};
