import { NextFunction, Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';

interface User {
	blocked: boolean;
}

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const userId: number = req.tokenData.id;

	try {
		// Fetch the user
		const user: User = await prisma.user.findUnique({
			where: { id: userId },
			select: { blocked: true },
		});

		// Check if the user is blocked
		if (user.blocked) {
			throw new Error('You are blocked');
		}

		// Call the next middleware
		next();
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
