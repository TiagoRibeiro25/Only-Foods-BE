import { NextFunction, Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';

interface User {
	isAdmin: boolean;
}

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	// Get logged user id
	const userId: number = req.tokenData.id;

	try {
		// Get the user from the database
		const user: User = await prisma.user.findUnique({
			where: { id: userId },
			select: { isAdmin: true },
		});

		// If the user is not an admin, throw an error
		if (!user.isAdmin) {
			throw new Error('Insufficient permissions');
		}

		// If the user is an admin, call the next middleware
		next();
	} catch (error) {
		const fileName =
			process.env.NODE_ENV !== 'production' ? __filename.split('\\').at(-1) : '';
		handleError({ res, error, fileName });
	}
};
