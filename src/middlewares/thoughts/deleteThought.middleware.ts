import { NextFunction, Response } from 'express';
import prisma from '../../config/db.config';
import { Request } from '../../types';
import handleError from '../../utils/handleError';
import validateData from '../../utils/validateData';

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const thoughtId = +req.params.id;

	try {
		if (!thoughtId || !validateData.id(thoughtId)) {
			throw new Error('Invalid id');
		}

		// Find the thought
		const thought = await prisma.thought.findUnique({
			where: { id: thoughtId },
			select: { id: true, authorId: true },
		});

		// Check if the thought exists
		if (!thought) {
			throw new Error('No thoughts found');
		}

		// Check if the user is the author of the thought or an admin
		if (thought.authorId !== req.tokenData.id && !req.tokenData.isAdmin) {
			throw new Error('Insufficient permissions');
		}

		// Call the next middleware
		next();
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
