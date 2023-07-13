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

interface Thought {
	id: number;
	content: string;
	author: {
		id: number;
		username: string;
		userImage: { cloudinaryImage: string };
	};
	likes: { authorId: number }[];
	comments: { authorId: number }[];
	createdAt: Date;
	createdAgo?: string;
	isAuthor?: boolean;
	isLiked?: boolean;
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

interface FetchThoughtsProps {
	page: number;
	limit: number;
	type: string;
	userId?: number;
	authorId?: number;
}

/**
 * Fetches thoughts based on the specified criteria.
 * @param {FetchThoughtsProps} props - The properties for fetching thoughts.
 * @returns {Promise<Thought[]>} A promise that resolves to an array of thoughts.
 */
function fetchThoughts(props: FetchThoughtsProps): Promise<Thought[]> {
	const { page, limit, type, userId, authorId } = props;

	// Calculate the offset
	const offset: number = (page - 1) * limit;

	// Set the order by depending on the filter
	const orderBy: OrderByType =
		type === 'popular' ? { likes: { _count: 'desc' } } : { createdAt: 'desc' };

	// Set the where depending on the filter
	let where = {} as WhereType;

	if (type === 'following' && userId) {
		where = { author: { followers: { some: { followerId: userId } } } };
	} else if (authorId) {
		where = { authorId };
	}

	return prisma.thought.findMany({
		take: Number(limit),
		skip: offset,
		where,
		orderBy,
		select: {
			id: true,
			content: true,
			author: {
				select: {
					id: true,
					username: true,
					userImage: {
						select: { cloudinaryImage: true },
					},
				},
			},
			likes: {
				select: { authorId: true },
			},
			comments: {
				select: { authorId: true },
			},
			createdAt: true,
		},
	});
}

export default async (req: Request, res: Response): Promise<void> => {
	const { filter, page = 1, limit = 10, authorId } = req.query as unknown as Query;
	const isUserLogged: boolean = req.tokenData !== undefined;

	try {
		// If the filter is following, and the user is not logged in, throw an error
		if (filter === 'following' && !isUserLogged) {
			throw new Error('No token provided');
		}

		// Fetch thoughts
		let thoughts: Thought[] = await fetchThoughts({
			page: Number(page), // Page number
			limit: Number(limit), // Number of thoughts per page
			type: filter, // 'recent' | 'popular' | 'following'
			userId: req.tokenData?.id, // User ID (required for filter 'following')
			authorId: +authorId, // Author ID (only for "recent" and "popular" filters)
		});

		// Check if the user is logged in
		if (isUserLogged) {
			// Check if the user created and liked any thought
			thoughts = thoughts.map(thought => {
				// Check if the user is the author of the thought
				const isAuthor = thought.author.id === req.tokenData.id;

				// Check if the user liked the thought
				const isLiked = thought.likes.some(like => like.authorId === req.tokenData.id);

				// Return the thought with the new properties
				return { ...thought, isAuthor, isLiked };
			});
		}

		// Calculate the time created ago (e.g. 2 hours ago)
		const result = thoughts.map(thought => {
			return {
				...thought,
				likes: thought.likes.length,
				comments: thought.comments.length,
				createdAgo: handleTime.calculateTimeAgo({ createdAt: thought.createdAt }),
			};
		});

		// Check if there are any thoughts
		if (result.length === 0) {
			throw new Error('No thoughts found');
		}

		// Send response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'Thoughts fetched successfully',
			data: result,
		});
	} catch (error) {
		handleError({ error, res, fileName: __filename.split('\\').at(-1) });
	}
};
