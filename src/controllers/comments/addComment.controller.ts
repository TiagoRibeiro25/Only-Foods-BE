import { Response } from 'express';
import prisma from '../../config/db.config';
import { Request } from '../../types';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

interface QueryParams {
	id: string;
	type: 'thought' | 'recipe';
}

export default async (req: Request, res: Response): Promise<void> => {
	const { id, type } = req.params as unknown as QueryParams;
	const comment: string = req.body.comment;

	try {
		const commentData = {
			authorId: +req.tokenData.id,
			content: comment,
		};
		commentData[type + 'Id'] = +id;

		// Add the comment
		const result = await prisma.comment.create({
			data: commentData,
		});

		// Send the response
		handleResponse({
			res,
			status: 'success',
			statusCode: 201,
			message: 'Comment added successfully',
			data: result,
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
