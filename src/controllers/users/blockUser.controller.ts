import { Response } from 'express';
import prisma from '../../config/db.config';
import redis from '../../config/redis.config';
import { Request } from '../../types';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

interface User {
	id: number;
	username: string;
	password: string;
	blocked: boolean;
	isAdmin: boolean;
}

export default async (req: Request, res: Response): Promise<void> => {
	const id: number = +req.params.id;

	try {
		// Get the user to block
		const user: User = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				username: true,
				password: true,
				blocked: true,
				isAdmin: true,
			},
		});

		// Check if the user exists
		if (!user) {
			throw new Error('Account not found');
		}

		// Check if the user is an admin
		if (user.isAdmin) {
			throw new Error('You cannot block an admin');
		}

		// If the user is blocked, unblock it and vice versa
		const blockStatus: boolean = user.blocked;

		// Update the user
		await prisma.user.update({
			where: { id },
			data: { blocked: !blockStatus },
		});

		// Update the user in Redis (if he's logged in)
		const redisUser = await redis.get(id.toString());
		if (redisUser) {
			await redis.set(
				id.toString(),
				JSON.stringify({
					status: {
						username: user.username,
						password: user.password,
						isAdmin: user.isAdmin,
						isBlocked: !blockStatus,
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
			message: `User ${blockStatus ? 'unblocked' : 'blocked'} successfully`,
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
