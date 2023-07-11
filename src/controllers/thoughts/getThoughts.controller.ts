import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

interface Query {
	filter: 'recent' | 'popular' | 'following';
	page: number;
	limit: number;
}

interface Thought {
	id: string;
	content: string;
	author: {
		id: string;
		username: string;
		userImage: { cloudinaryImage: string };
	};
	likes: { authorId: string }[];
	comments: { authorId: string }[];
	createdAt: Date;
	updatedAt: Date;
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

interface FetchThoughtsProps {
	page: number;
	limit: number;
	type: string;
	userId?: string;
}

/**
 * Fetches thoughts based on the specified criteria.
 * @param {FetchThoughtsProps} props - The properties for fetching thoughts.
 * @returns {Promise<Thought[]>} A promise that resolves to an array of thoughts.
 */
function fetchThoughts(props: FetchThoughtsProps): Promise<Thought[]> {
	const { page, limit, type, userId } = props;

	// Calculate the offset
	const offset = (page - 1) * limit;

	// Set the order by depending on the filter
	const orderBy: OrderByType =
		type === 'popular'
			? { likes: { _count: 'desc' }, comments: { _count: 'desc' } }
			: { createdAt: 'desc' };

	// Set the where depending on the filter
	const where =
		type === 'following' && userId
			? { author: { followers: { some: { followerId: userId } } } }
			: {};

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
			updatedAt: true,
		},
	});
}

export default async (req: Request, res: Response): Promise<void> => {
	const { filter, page = 1, limit = 10 } = req.query as unknown as Query;
	const isUserLogged = req.tokenData !== null;

	try {
		// Fetch thoughts
		let thoughts: Thought[] = await fetchThoughts({
			page: Number(page), // Page number
			limit: Number(limit), // Number of thoughts per page
			type: filter, // 'recent' | 'popular' | 'following'
			userId: req.tokenData.id, // User ID (required for filter 'following')
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

		// Check if there are any thoughts
		if (thoughts.length === 0) {
			throw new Error('No thoughts found');
		}

		// Send response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'Thoughts fetched successfully',
			data: thoughts,
		});
	} catch (error) {
		handleError({ error, res });
	}
};
