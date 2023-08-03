import { Response } from 'express';
import prisma from '../../config/db.config';
import { Request } from '../../types';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

export default async (req: Request, res: Response): Promise<void> => {
	let content: string = req.body.content;
	const thoughtId: number = +req.params.id;

	try {
		// If there are multiple "\n" in a row, replace them with "\n\n" (only one)
		const regex = /\n{2,}/g;
		if (regex.test(content)) {
			content = content.replace(regex, '\n \n');
		}

		// Update thought
		await prisma.thought.update({
			where: { id: thoughtId },
			data: { content, edited: true },
		});

		// Send response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'Thought updated successfully',
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
