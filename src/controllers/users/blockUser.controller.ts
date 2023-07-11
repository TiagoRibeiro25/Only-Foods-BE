import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

export default async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;

	try {
		// Get the user to block
		const user = await prisma.user.findUnique({
			where: { id },
			select: { id: true, blocked: true, isAdmin: true },
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
		const blockStatus = user.blocked;

		// Update the user
		await prisma.user.update({
			where: { id },
			data: { blocked: !blockStatus },
		});

		// Send the response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: `User ${blockStatus ? 'unblocked' : 'blocked'} successfully`,
		});
	} catch (error) {
		handleError({ res, error });
	}
};
