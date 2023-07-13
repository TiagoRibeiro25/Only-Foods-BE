import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

export default async (req: Request, res: Response): Promise<void> => {
	const thoughtId: string = req.params.id;

	try {
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
