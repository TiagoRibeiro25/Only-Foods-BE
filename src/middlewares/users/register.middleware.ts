import { NextFunction, Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import validateData from '../../utils/validateData';

interface RegisterData {
	username: string;
	email: string;
	password: string;
}

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	req.body.email = req.body.email?.toLowerCase().trim();
	req.body.username = req.body.username?.trim();
	const { username, email, password }: RegisterData = req.body;

	try {
		if (!username || !email || !password) {
			throw new Error('All fields are required');
		}

		if (typeof username !== 'string' || !validateData.username(username)) {
			throw new Error('Invalid username');
		}

		if (typeof email !== 'string' || !validateData.email(email)) {
			throw new Error('Invalid email');
		}

		if (typeof password !== 'string') {
			throw new Error('Invalid password');
		}

		// Verify if the email is already in use
		const user = await prisma.user.findUnique({ where: { email } });

		if (user) {
			throw new Error('Email already in use');
		}

		next();
	} catch (error) {
		const fileName =
			process.env.NODE_ENV !== 'production' ? __filename.split('\\').at(-1) : '';
		handleError({ res, error, fileName });
	}
};
