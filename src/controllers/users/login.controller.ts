import bcrypt from 'bcryptjs';
import { Response } from 'express';
import { getCookiesOptions } from '../../config/cookies.config';
import prisma from '../../config/db.config';
import redis from '../../config/redis.config';
import { Request } from '../../types';
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
		const user = await prisma.user.findUnique({
			where: { email },
			include: { userImage: true },
		});

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
			isBlocked: user.blocked,
		});

		// Set the cookie
		const cookieOptions = getCookiesOptions(rememberMe);
		res.cookie('onlyfoods_jwt', token, cookieOptions);

		// Add the token to Redis
		await redis.set(user.id.toString(), JSON.stringify([token]));
		await redis.expire(user.id.toString(), cookieOptions.maxAge / 1000);

		// Prepare the user data to send it back
		const userData = {
			id: user.id,
			username: user.username,
			email: user.email,
			isAdmin: user.isAdmin,
			isBlocked: user.blocked,
			picture: user.userImage?.cloudinaryImage,
		};

		// Send the response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'Logged in successfully',
			data: { user: userData },
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
