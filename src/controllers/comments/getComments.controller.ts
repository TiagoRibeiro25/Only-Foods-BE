import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';
import handleTime from '../../utils/handleTime';

interface QueryParams {
	id: string;
	type: 'thought' | 'recipe';
}

interface GetCommentsProps extends QueryParams {
	page?: string;
	limit?: string;
}

interface Comment {
	id: number;
	content: string;
	author: {
		id: number;
		username: string;
		userImage: {
			cloudinaryImage: string;
		};
	};
	createdAt: Date;
}

interface CommentResult extends Comment {
	createdAgo: string;
}

function getComments(props: GetCommentsProps): Promise<Comment[]> {
	const whereOptions = {};
	const page = +props.page || 1;
	const limit: number = +props.limit || 10;
	const offset: number = (page - 1) * limit;
	whereOptions[props.type + 'Id'] = +props.id;

	return prisma.comment.findMany({
		where: whereOptions,
		take: limit,
		skip: offset,
		orderBy: {
			createdAt: 'desc',
		},
		select: {
			id: true,
			content: true,
			author: {
				select: {
					id: true,
					username: true,
					userImage: {
						select: {
							cloudinaryImage: true,
						},
					},
				},
			},
			createdAt: true,
		},
	});
}

export default async (req: Request, res: Response): Promise<void> => {
	const { id, type } = req.params as unknown as QueryParams;
	const page: string = req.query.page as string;
	const limit: string = req.query.limit as string;

	try {
		// Fetch the comments
		const comments: Comment[] = await getComments({ id, type, page, limit });

		// Calculate the time created ago (e.g. 2 hours ago)
		const commentsResult: CommentResult[] = comments.map(comment => {
			return {
				...comment,
				createdAgo: handleTime.calculateTimeAgo({ createdAt: comment.createdAt }),
			};
		});

		// Check if there are no comments
		if (commentsResult.length === 0) {
			throw new Error('No comments found');
		}

		// Fetch total count
		const totalCount: number = await prisma.comment.count({
			where: { [type + 'Id']: +id },
		});

		// Send the response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'Comments fetched successfully',
			data: {
				comments: commentsResult,
				totalCount,
			},
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
