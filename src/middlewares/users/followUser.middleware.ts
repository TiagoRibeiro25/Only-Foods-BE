import { User } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';

export default async (req: Request, res: Response, next: NextFunction) => {
	// Get the id of the user to follow/unfollow
	const id: string = req.params.id;

	try {
		// Check if the user exists
		const user: User = await prisma.user.findUnique({ where: { id } });

		if (!user) {
			throw new Error('Account not found');
		}

		// Call the next middleware
		next();
	} catch (error) {
		handleError({ res, error });
	}
};
