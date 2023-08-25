import { Response } from 'express';
import prisma from '../../config/db.config';
import { Request } from '../../types';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

interface Query {
	keyword: string;
	page: number;
	limit: number;
}

interface Recipe {
	id: number;
	title: string;
	description: string;
	author: {
		id: number;
		username: string;
		blocked: boolean;
		userImage: {
			cloudinaryImage: string;
		};
	};
	recipeImages: { cloudinaryImage: string }[];
	likes: {
		authorId: number;
	}[];
	comments: {
		authorId: number;
	}[];
	createdAt: Date;
	isAuthor?: boolean;
	isLiked?: boolean;
}

function getRecipes(keyword: string, page: number, limit: number): Promise<Recipe[]> {
	const offset: number = (page - 1) * limit;

	// Fetch recipes
	return prisma.recipe.findMany({
		where: {
			title: {
				contains: keyword,
				mode: 'insensitive',
			},
		},
		take: Number(limit),
		skip: offset,
		orderBy: {
			likes: { _count: 'desc' },
		},
		select: {
			id: true,
			title: true,
			description: true,
			createdAt: true,
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
			recipeImages: {
				select: { cloudinaryImage: true },
				take: 1,
			},
			likes: {
				select: { authorId: true },
			},
			comments: {
				select: { authorId: true },
			},
		},
	});
}

export default async (req: Request, res: Response): Promise<void> => {
	const { keyword, page = 1, limit = 10 } = req.query as unknown as Query;
	const isUserLogged: boolean = req.tokenData !== undefined;

	try {
		// Fetch recipes
		let recipes: Recipe[] = await getRecipes(keyword, Number(page), Number(limit));

		// Check if the user is logged in
		if (isUserLogged) {
			// Check if the user created and/or liked any recipe
			recipes = recipes.map(recipe => {
				// Check if the user is the author of the recipe
				const isAuthor: boolean = recipe.author.id === req.tokenData.id;

				// Check if the user liked the recipe
				const isLiked: boolean = recipe.likes.some(
					like => like.authorId === req.tokenData.id,
				);

				// return the recipe with the new properties
				return { ...recipe, isAuthor, isLiked };
			});
		}

		// Calculate the total number of recipes
		const totalRecipes: number = await prisma.recipe.count({
			where: {
				title: {
					contains: keyword,
					mode: 'insensitive',
				},
			},
		});

		const result = recipes.map(recipe => {
			return {
				...recipe,
				likes: recipe.likes.length,
				comments: recipe.comments.length,
			};
		});

		// Check if there are any recipes
		if (result.length === 0) {
			throw new Error('No recipes found');
		}

		// Send the response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'Recipes fetched successfully',
			data: {
				recipes: result,
				totalCount: totalRecipes,
			},
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
