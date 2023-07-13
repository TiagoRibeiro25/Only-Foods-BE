import { NextFunction, Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import validateData from '../../utils/validateData';

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const content: string = req.body.content;
	const thoughtId: string = req.params.id;

	try {
		if (!validateData.thoughtContent(content)) {
			throw new Error('Invalid content');
		}

		// Find the thought
		const thought = await prisma.thought.findUnique({
			where: { id: thoughtId },
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
