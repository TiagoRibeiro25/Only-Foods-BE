import { UploadApiResponse } from 'cloudinary';
import { Response } from 'express';
import cloudinary from '../../config/cloudinary.config';
import prisma from '../../config/db.config';
import { Base64Img, Request } from '../../types';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

interface AddRecipeRequestData {
	title: string;
	description?: string;
	recipeImages: Base64Img[];
	ingredients: string[];
	instructions: string[];
	notes?: string;
}

export default async (req: Request, res: Response): Promise<void> => {
	const {
		title,
		description,
		recipeImages,
		ingredients,
		instructions,
		notes,
	}: AddRecipeRequestData = req.body;

	try {
		// Create the recipe
		const recipe = await prisma.recipe.create({
			data: {
				title: title.trim(),
				description: description?.trim(),
				authorId: req.tokenData.id,
				ingredients,
				instructions,
				...(notes && { notes }),
			},
		});

		// Create the recipe images
		const recipeImagesData = recipeImages.map(image => ({
			recipeId: recipe.id,
			image,
		}));

		const images = [];
		// Upload the recipe images to Cloudinary
		await Promise.all(
			recipeImagesData.map(async image => {
				const result: UploadApiResponse = await cloudinary.uploader.upload(image.image, {
					folder: 'only_foods/recipes',
					crop: 'scale',
				});

				images.push({
					cloudinaryId: result.public_id,
					cloudinaryImage: result.secure_url,
					recipeId: image.recipeId,
				});
			}),
		);

		// Create the recipe images in the database
		await prisma.recipeImage.createMany({
			data: images,
		});

		// Send the response
		handleResponse({
			res,
			status: 'success',
			statusCode: 201,
			message: 'Recipe created successfully',
			data: { recipe, images },
		});
	} catch (error) {
		const fileName =
			process.env.NODE_ENV !== 'production' ? __filename.split('/').at(-1) : '';
		handleError({ res, error, fileName });
	}
};
