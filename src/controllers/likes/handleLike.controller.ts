import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

interface QueryParams {
	id: string;
	type: 'thought' | 'recipe';
}

export default async (req: Request, res: Response): Promise<void> => {
	const { id, type } = req.params as unknown as QueryParams;

	try {
		const itemIdText = type === 'thought' ? 'thoughtId' : 'recipeId';

		// Check if the item is already liked by the user
		const isLiked = await prisma.like.findFirst({
			where: {
				authorId: req.tokenData.id,
				[itemIdText]: +id,
			},
		});

		// If the item is already liked, unlike it
		if (isLiked) {
			await prisma.like.delete({
				where: { id: isLiked.id },
			});
		}
		// If the item is not liked, like it
		else {
			await prisma.like.create({
				data: {
					authorId: req.tokenData.id,
					[itemIdText]: +id,
				},
			});
		}

		// Send the response
		const responseMessage = `${type.charAt(0).toUpperCase() + type.slice(1)} ${
			isLiked ? 'unliked' : 'liked'
		} successfully`;

		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: responseMessage,
		});
	} catch (error) {
		const fileName =
			process.env.NODE_ENV !== 'production' ? __filename.split('\\').at(-1) : '';
		handleError({ res, error, fileName });
	}
};
