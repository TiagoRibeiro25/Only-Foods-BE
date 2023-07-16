import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';
import handleTime from '../../utils/handleTime';

interface Thought {
	id: number;
	content: string;
	createdAt: Date;
	author: {
		id: number;
		username: string;
		userImage: {
			cloudinaryImage: string;
		};
	};
	likes: {
		id: number;
		authorId: number;
	}[];
	isAuthor?: boolean;
	isLiked?: boolean;
	createdAgo?: string;
}

function getThought(id: number): Promise<Thought> {
	return prisma.thought.findUnique({
		where: { id: Number(id) },
		select: {
			id: true,
			content: true,
			createdAt: true,
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
				select: {
					id: true,
					authorId: true,
				},
			},
		},
	});
}

export default async (req: Request, res: Response): Promise<void> => {
	const id: string = req.params.id;

	try {
		// Fetch the thought
		const thought: Thought = await getThought(+id);

		// Check if the thought exists
		if (!thought) {
			throw new Error('No thoughts found');
		}

		// Calculate the time created ago (e.g. 2 hours ago)
		thought.createdAgo = handleTime.calculateTimeAgo({ createdAt: thought.createdAt });

		// Check if the thought is from the current user
		if (thought.author.id === req.tokenData?.id) {
			thought.isAuthor = true;
		}

		// Check if the thought is liked by the current user
		if (thought.likes.some(like => like.authorId === req.tokenData?.id)) {
			thought.isLiked = true;
		}

		// Remove the likes array and add the likes count
		const result = { ...thought, likes: thought.likes.length };

		// Send the response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'Thought fetched successfully',
			data: result,
		});
	} catch (error) {
		const fileName =
			process.env.NODE_ENV !== 'production' ? __filename.split('\\').at(-1) : '';
		handleError({ res, error, fileName });
	}
};
