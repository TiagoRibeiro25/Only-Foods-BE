import { NextFunction, Response } from 'express';
import prisma from '../../config/db.config';
import { Request } from '../../types';
import handleError from '../../utils/handleError';
import validateData from '../../utils/validateData';

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const recipeId = +req.params.id;

	try {
		if (!recipeId || !validateData.id(recipeId)) {
			throw new Error('Invalid id');
		}

		// Find the recipe
		const recipe = await prisma.recipe.findUnique({
			where: { id: recipeId },
			select: { id: true, authorId: true },
		});

		// Check if the recipe exists
		if (!recipe) {
			throw new Error('No recipes found');
		}

		// Check if the user is the author of the recipe or an admin
		if (recipe.authorId !== req.tokenData.id && !req.tokenData.isAdmin) {
			throw new Error('Insufficient permissions');
		}

		// Call the next middleware
		next();
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
