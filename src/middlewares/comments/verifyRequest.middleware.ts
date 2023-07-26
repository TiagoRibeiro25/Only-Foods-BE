import { NextFunction, Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import validateData from '../../utils/validateData';

interface QueryParams {
	id: string;
	type: 'thought' | 'recipe';
}

const VALID_TYPES = ['thought', 'recipe'];

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { id, type } = req.params as unknown as QueryParams;

	try {
		// Check if the id is valid
		if (!id || !validateData.id(id)) {
			throw new Error('Invalid id');
		}

		// Check if the type is valid
		if (!type || !VALID_TYPES.includes(type)) {
			throw new Error('Invalid type');
		}

		// Check if the type is thought or recipe and check if it exists
		if (type === 'thought') {
			const thought = await prisma.thought.findUnique({
				where: { id: +id },
				select: { id: true },
			});

			if (!thought) {
				throw new Error('No thoughts found');
			}
		} else {
			const recipe = await prisma.recipe.findUnique({
				where: { id: +id },
				select: { id: true },
			});

			if (!recipe) {
				throw new Error('No recipes found');
			}
		}

		// Call the next middleware
		next();
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
