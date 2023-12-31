import { Response } from 'express';
import prisma from '../../config/db.config';
import { Request } from '../../types';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

interface Recipe {
	id: number;
	title: string;
	description: string;
	ingredients: string[];
	instructions: string[];
	notes: string;
	createdAt: Date;
	recipeImages: {
		id: number;
		cloudinaryImage: string;
	}[];
	author: {
		id: number;
		username: string;
		blocked: boolean;
		userImage: {
			cloudinaryImage: string;
		};
	};
	likes: {
		authorId: number;
	}[];
	comments: {
		id: number;
	}[];
	isAuthor?: boolean;
	isLiked?: boolean;
}

function getRecipe(id: number): Promise<Recipe> {
	return prisma.recipe.findUnique({
		where: { id: Number(id) },
		select: {
			id: true,
			title: true,
			description: true,
			ingredients: true,
			instructions: true,
			notes: true,
			createdAt: true,
			recipeImages: {
				select: {
					id: true,
					cloudinaryImage: true,
				},
			},
			author: {
				select: {
					id: true,
					username: true,
					blocked: true,
					userImage: {
						select: { cloudinaryImage: true },
					},
				},
			},
			likes: {
				select: {
					authorId: true,
				},
			},
			comments: {
				select: {
					id: true,
				},
			},
		},
	});
}

export default async (req: Request, res: Response): Promise<void> => {
	const id: string = req.params.id;

	try {
		// Fetch the recipe
		const recipe: Recipe = await getRecipe(+id);

		// Check if the recipe exists
		if (!recipe) {
			throw new Error('No recipes found');
		}

		// Check if the user is the author of the recipe
		if (recipe.author.id === req.tokenData?.id) {
			recipe.isAuthor = true;
		}

		// Check if the recipe is liked by the logged in user
		recipe.isLiked = recipe.likes.some(like => like.authorId === req.tokenData?.id);

		// Replace the likes array with the number of likes
		const result = {
			...recipe,
			likes: recipe.likes.length,
			comments: recipe.comments.length,
		};

		// Send the response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'Recipe fetched successfully',
			data: result,
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
