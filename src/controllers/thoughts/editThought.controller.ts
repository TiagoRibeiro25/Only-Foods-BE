import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

export default async (req: Request, res: Response): Promise<void> => {
	const content: string = req.body.content;
	const thoughtId: number = +req.params.id;

	try {
		// Update thought
		await prisma.thought.update({
			where: { id: thoughtId },
			data: { content },
		});

		// Send response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'Thought updated successfully',
		});
	} catch (error) {
		const fileName =
			process.env.NODE_ENV !== 'production' ? __filename.split('\\').at(-1) : '';
		handleError({ res, error, fileName });
	}
};
