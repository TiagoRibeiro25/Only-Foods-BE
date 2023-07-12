import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { CookieOptions, Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import generateToken from '../../utils/generateToken';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

interface LoginData {
	email: string;
	password: string;
	rememberMe: boolean;
}

export default async (req: Request, res: Response): Promise<void> => {
	const { email, password, rememberMe }: LoginData = req.body;

	try {
		// Search if there's a user with the email provided
		const user: User = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			throw new Error('Account not found');
		}

		// Compare the password provided with the one in the database
		const passwordMath: boolean = bcrypt.compareSync(password, user.password);
		if (!passwordMath) {
			throw new Error('Password does not match');
		}

		// Create a token for the user
		const token: string = generateToken.authToken({
			id: user.id,
			rememberMe,
			isAdmin: user.isAdmin,
		});

		// Set the cookie
		const cookieOptions: CookieOptions = {
			httpOnly: true,
			maxAge: parseInt(
				rememberMe ? process.env.JWT_EXPIRES_IN_REMEMBER_ME : process.env.JWT_EXPIRES_IN,
			),
		};

		res.cookie('authorization', token, cookieOptions);

		// Send the response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'Logged in successfully',
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
