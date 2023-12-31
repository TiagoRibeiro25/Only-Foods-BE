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
		const images = [];
		const folderName = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
		// Upload the recipe images to Cloudinary
		await Promise.all(
			recipeImages.map(async image => {
				const result: UploadApiResponse = await cloudinary.uploader.upload(image, {
					folder: `only_foods/${folderName}/recipes`,
					crop: 'scale',
					transformation: { width: 750, height: 300, crop: 'limit' },
				});

				images.push({
					cloudinaryId: result.public_id,
					cloudinaryImage: result.secure_url,
				});
			}),
		);

		// After the images were uploaded to cloudinary, create the recipe in the database
		const recipe = await prisma.recipe.create({
			data: {
				title: title.trim(),
				authorId: req.tokenData.id,
				ingredients,
				instructions,
				...(description && { description: description.trim() }),
				...(notes && { notes: notes.trim() }),
			},
		});

		// Create the recipe images in the database and return them
		const imagesCreated = await prisma.$transaction([
			prisma.recipeImage.createMany({
				data: images.map(image => ({
					...image,
					recipeId: recipe.id,
				})),
			}),
			prisma.recipeImage.findMany({
				where: { recipeId: recipe.id },
				select: { id: true, cloudinaryImage: true, cloudinaryId: true, recipeId: true },
			}),
		]);

		// Send the response
		handleResponse({
			res,
			status: 'success',
			statusCode: 201,
			message: 'Recipe created successfully',
			data: { recipe, images: imagesCreated[1] },
		});
	} catch (error) {
		const fileName =
			process.env.NODE_ENV !== 'production' ? __filename.split('/').at(-1) : '';
		handleError({ res, error, fileName });
	}
};
