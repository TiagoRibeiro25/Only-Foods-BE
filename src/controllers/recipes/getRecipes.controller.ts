import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';
import handleTime from '../../utils/handleTime';

interface Query {
	filter: 'recent' | 'popular' | 'following';
	page: number;
	limit: number;
	authorId?: number;
}

interface Recipe {
	id: number;
	title: string;
	author: {
		id: number;
		username: string;
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

interface FetchRecipesProps {
	page: number;
	limit: number;
	type: string;
	userId?: number;
	authorId?: number;
}

interface OrderByType {
	createdAt?: 'asc' | 'desc';
	likes?: {
		_count: 'asc' | 'desc';
	};
	comments?: {
		_count: 'asc' | 'desc';
	};
}

interface WhereType {
	author?: {
		followers: {
			some: {
				followerId: number;
			};
		};
	};
	authorId?: number;
}

function fetchRecipes(props: FetchRecipesProps): Promise<Recipe[]> {
	const { page, limit, type, userId, authorId } = props;

	// Calculate the offset
	const offset: number = (page - 1) * limit;

	// Set the order by depending on the filter (type)
	const orderBy: OrderByType =
		type === 'popular' ? { likes: { _count: 'desc' } } : { createdAt: 'desc' };

	// Set the where depending on the filter (type)
	let where = {} as WhereType;

	if (type === 'following' && userId) {
		where = {
			author: {
				followers: {
					some: {
						followerId: userId,
					},
				},
			},
		};
	} else if (authorId) {
		where = { authorId };
	}

	return prisma.recipe.findMany({
		take: Number(limit),
		skip: offset,
		where,
		orderBy,
		select: {
			id: true,
			title: true,
			createdAt: true,
			author: {
				select: {
					id: true,
					username: true,
				},
			},
			recipeImages: {
				select: {
					cloudinaryImage: true,
				},
				take: 1,
			},
			likes: {
				select: {
					authorId: true,
				},
			},
			comments: {
				select: {
					authorId: true,
				},
			},
		},
	});
}

export default async (req: Request, res: Response): Promise<void> => {
	const { filter, page = 1, limit = 10, authorId } = req.query as unknown as Query;
	const isUserLogged: boolean = req.tokenData !== undefined;

	try {
		// Fetch recipes
		let recipes: Recipe[] = await fetchRecipes({
			page: Number(page), // Page number
			limit: Number(limit), // Number of recipes per page
			type: filter, // 'recent' | 'popular' | 'following'
			userId: req.tokenData?.id, // User ID (required for filter 'following')
			authorId: Number(authorId), // Author ID (required for filter 'author')
		});

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

				// Return the recipe with the new properties
				return { ...recipe, isAuthor, isLiked };
			});
		}

		// Calculate the time created ago (e.g. 2 hours ago)
		const result = recipes.map(recipe => {
			return {
				...recipe,
				likes: recipe.likes.length,
				comments: recipe.comments.length,
				createdAgo: handleTime.calculateTimeAgo({ createdAt: recipe.createdAt }),
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
			data: result,
		});
	} catch (error) {
		const fileName =
			process.env.NODE_ENV !== 'production' ? __filename.split('\\').at(-1) : '';
		handleError({ res, error, fileName });
	}
};