import bcrypt from 'bcryptjs';
import { Response } from 'express';
import prisma from '../../config/db.config';
import redis from '../../config/redis.config';
import { Request } from '../../types';
import generateToken from '../../utils/generateToken';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

export default async (req: Request, res: Response) => {
	const password: string = req.body.password;
	const userId: number = req.tokenData.id;
	const newToken: string = generateToken.resetPasswordToken({ id: userId });

	// Encrypt new password
	const passwordEncrypted: string = await bcrypt.hash(password, 10);

	// Update the user's password
	try {
		await prisma.user.update({
			where: { id: userId },
			data: {
				password: passwordEncrypted,
				resetPasswordToken: newToken,
			},
		});

		// Update the user in Redis (if he's logged in)
		const redisUser = await redis.get(userId.toString());
		if (redisUser) {
			await redis.set(
				userId.toString(),
				JSON.stringify({
					userData: {
						username: JSON.parse(redisUser).userData.username,
						password: passwordEncrypted,
						isAdmin: JSON.parse(redisUser).userData.isAdmin,
						isBlocked: JSON.parse(redisUser).userData.isBlocked,
					},
					tokens: JSON.parse(redisUser).tokens,
				}),
			);
		}

		// Send the response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'Password updated successfully',
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
