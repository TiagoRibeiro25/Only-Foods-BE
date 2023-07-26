import { NextFunction, Response } from 'express';
import { Base64Img, Request } from '../../types';
import handleError from '../../utils/handleError';
import validateData from '../../utils/validateData';

interface AddRecipeRequestData {
	title: string;
	recipeImages: Base64Img[];
	ingredients: string[];
	instructions: string[];
	notes?: string;
}

export default (req: Request, res: Response, next: NextFunction): void => {
	const { title, recipeImages, ingredients, instructions, notes }: AddRecipeRequestData =
		req.body;

	try {
		// Check if all mandatory fields are present
		if (!title || !recipeImages || !ingredients || !instructions) {
			throw new Error('All fields are required');
		}

		// Check if title is a string with at least 3 characters and no more than 50
		if (typeof title !== 'string' || title.length < 3 || title.length > 50) {
			throw new Error('Invalid title');
		}

		// Check if recipeImages is an array with at least 1 image and each image is valid
		if (
			!Array.isArray(recipeImages) ||
			recipeImages.length < 1 ||
			!recipeImages.every(image => validateData.base64Image(image))
		) {
			throw new Error('Invalid image');
		}

		// Check if ingredients and instructions are arrays with at least 1 element
		if (
			!Array.isArray(ingredients) ||
			ingredients.length < 1 ||
			!Array.isArray(instructions) ||
			instructions.length < 1
		) {
			throw new Error('Invalid ingredients or instructions');
		}

		// If notes is present, check if it's a string with no more than 500 characters and no less than 7
		if (notes && (typeof notes !== 'string' || notes.length < 7 || notes.length > 500)) {
			throw new Error('Invalid notes');
		}

		// Call the next middleware
		next();
	} catch (error) {
		const fileName =
			process.env.NODE_ENV !== 'production' ? __filename.split('/').at(-1) : '';
		handleError({ res, error, fileName });
	}
};
