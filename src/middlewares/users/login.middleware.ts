import { NextFunction, Response } from 'express';
import { Request } from 'types';
import handleError from '../../utils/handleError';
import validateData from '../../utils/validateData';

interface LoginData {
	email: string;
	password: string;
	rememberMe: boolean;
}

export default (req: Request, res: Response, next: NextFunction): void => {
	req.body.email = req.body.email?.toLowerCase().trim();
	const { email, password, rememberMe }: LoginData = req.body;

	try {
		if (!email || !password || rememberMe === undefined) {
			throw new Error('All fields are required');
		}

		if (typeof email !== 'string' || !validateData.email(email)) {
			throw new Error('Invalid email');
		}

		if (typeof password !== 'string') {
			throw new Error('Invalid password');
		}

		if (typeof rememberMe !== 'boolean') {
			throw new Error('Invalid remember me');
		}

		next();
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
