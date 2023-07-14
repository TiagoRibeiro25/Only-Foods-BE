import { NextFunction, Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
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

		// Call the next middleware
		next();
	} catch (error) {
		const fileName =
			process.env.NODE_ENV !== 'production' ? __filename.split('\\').at(-1) : '';
		handleError({ res, error, fileName });
	}
};
