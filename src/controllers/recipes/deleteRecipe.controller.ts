import { Response } from 'express';
import cloudinary from '../../config/cloudinary.config';
import prisma from '../../config/db.config';
import { Request } from '../../types';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

export default async (req: Request, res: Response): Promise<void> => {
	const recipeId: number = +req.params.id;

	try {
		// Get the images ids
		const imagesIds = await prisma.recipeImage.findMany({
			where: { recipeId },
			select: { cloudinaryId: true },
		});

		// Delete the recipe, its comments and likes from the database
		await prisma.$transaction([
			prisma.comment.deleteMany({ where: { recipeId } }),
			prisma.like.deleteMany({ where: { recipeId } }),
			prisma.recipeImage.deleteMany({ where: { recipeId } }),
			prisma.recipe.delete({ where: { id: recipeId } }),
		]);

		// Delete the images from cloudinary
		for (const imageId of imagesIds) {
			await cloudinary.uploader.destroy(imageId.cloudinaryId);
		}

		// Send response
		handleResponse({
			res,
			status: 'success',
			statusCode: 204,
			message: 'Recipe deleted successfully',
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
