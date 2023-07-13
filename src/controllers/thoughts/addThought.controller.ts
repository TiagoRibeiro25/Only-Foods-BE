import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

export default async (req: Request, res: Response): Promise<void> => {
	const content: string = req.body.content;

	try {
		// Create new thought in the database
		const thought = await prisma.thought.create({
			data: {
				authorId: req.tokenData.id,
				content,
			},
		});

		// Send response
		handleResponse({
			res,
			status: 'success',
			statusCode: 201,
			message: 'Thought created successfully',
			data: thought,
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
