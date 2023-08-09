import { Response } from 'express';
import prisma from '../../config/db.config';
import { Request } from '../../types';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

interface Thought {
	id: number;
	content: string;
	edited: boolean;
	createdAt: Date;
	author: {
		id: number;
		username: string;
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

function getThought(id: number): Promise<Thought> {
	return prisma.thought.findUnique({
		where: { id: Number(id) },
		select: {
			id: true,
			content: true,
			edited: true,
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
		// Fetch the thought
		const thought: Thought = await getThought(+id);

		// Check if the thought exists
		if (!thought) {
			throw new Error('No thoughts found');
		}

		// Check if the thought is from the current user
		if (thought.author.id === req.tokenData?.id) {
			thought.isAuthor = true;
		}

		// Check if the thought is liked by the current user
		if (thought.likes.some(like => like.authorId === req.tokenData?.id)) {
			thought.isLiked = true;
		}

		// Remove the likes array and add the likes count
		const result = {
			...thought,
			likes: thought.likes.length,
			comments: thought.comments.length,
		};

		// Send the response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'Thought fetched successfully',
			data: result,
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
