import { NextFunction, Response } from 'express';
import { Request } from 'types';
import handleError from '../../utils/handleError';
import validateEmail from '../../utils/validateEmail';

interface LoginData {
	email: string;
	password: string;
	rememberMe: boolean;
}

export default (req: Request, res: Response, next: NextFunction) => {
	req.body.email = req.body.email.toLowerCase().trim();
	const { email, password, rememberMe }: LoginData = req.body;

	try {
		if (!email || !password || !rememberMe) {
			throw new Error('All fields are required');
		}

		if (typeof email !== 'string' || typeof password !== 'string') {
			throw new Error('Invalid email or password');
		}

		if (typeof rememberMe !== 'boolean') {
			throw new Error('Invalid remember me');
		}

		if (!validateEmail(email)) {
			throw new Error('Invalid email');
		}

		next();
	} catch (error) {
		handleError({ res, error });
	}
};