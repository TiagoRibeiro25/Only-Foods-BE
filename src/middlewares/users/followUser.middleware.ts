import { NextFunction, Response } from 'express';
import prisma from '../../config/db.config';
import { Request } from '../../types';
import handleError from '../../utils/handleError';
import validateData from '../../utils/validateData';

export default async (req: Request, res: Response, next: NextFunction) => {
	// Get the id of the user to follow/unfollow
	const id = +req.params.id;

	try {
		// Check if the id is valid
		if (!validateData.id(id)) {
			throw new Error('Invalid id');
		}

		// Check if the user exists
		const user = await prisma.user.findUnique({ where: { id } });

		if (!user) {
			throw new Error('Account not found');
		}

		// Check if the user is trying to follow himself
		if (id === req.tokenData.id) {
			throw new Error('You cannot follow yourself');
		}

		// Call the next middleware
		next();
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
