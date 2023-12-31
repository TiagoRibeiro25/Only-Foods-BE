import { NextFunction, Response } from 'express';
import prisma from '../../config/db.config';
import { Request } from '../../types';
import handleError from '../../utils/handleError';

export default async (req: Request, res: Response, next: NextFunction) => {
	const { password } = req.body;
	const { token } = req.params;

	try {
		// Check if the password is valid
		if (!password || password.length < 4 || password.length > 32) {
			throw new Error('Invalid password');
		}

		// Check if the token is the same as the one in the database
		const user = await prisma.user.findUnique({
			where: {
				resetPasswordToken: token,
			},
		});

		if (!user) {
			throw new Error('Account not found');
		}

		// Set the user in the request
		req.tokenData = {
			id: user.id,
			rememberMe: false,
			isAdmin: user.isAdmin,
			isBlocked: user.blocked,
			iat: 0,
			exp: 0,
		};

		// Call the next middleware
		next();
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
