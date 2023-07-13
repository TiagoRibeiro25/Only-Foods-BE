import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

export default async (req: Request, res: Response): Promise<void> => {
	const thoughtId: string = req.params.id;

	try {
		// Check if thought exists
		const thought = await prisma.thought.findUnique({
			where: { id: thoughtId },
			select: { id: true, authorId: true },
		});

		if (!thought) {
			throw new Error('No thoughts found');
		}

		// Check if the user is the author of the thought
		if (thought.authorId !== req.tokenData.id && !req.tokenData.isAdmin) {
			throw new Error('Insufficient permissions');
		}

		// Delete the thought, its comments and likes from the database
		await prisma.$transaction([
			prisma.comment.deleteMany({ where: { thoughtId } }),
			prisma.like.deleteMany({ where: { thoughtId } }),
			prisma.thought.delete({ where: { id: thoughtId } }),
		]);

		// Send response
		handleResponse({
			res,
			status: 'success',
			statusCode: 204,
			message: 'Thought deleted successfully',
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
