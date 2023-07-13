import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

interface Query {
	keyword: string;
	page: number;
	limit: number;
}

interface User {
	id: number;
	username: string;
	description: string;
	isAdmin: boolean;
	blocked: boolean;
	userImage: {
		cloudinaryImage: string;
	};
	followers: {
		followerId: number;
	}[];
	following: {
		followingId: number;
	}[];
}

interface ResponseData extends Omit<User, 'followers' | 'following'> {
	followers: number;
	following: number;
	isFollowing?: boolean;
}

function getUsers(keyword: string, page: number, limit: number): Promise<User[]> {
	const offset: number = (page - 1) * limit;

	// Fetch users
	return prisma.user.findMany({
		where: {
			username: {
				contains: keyword,
				mode: 'insensitive',
			},
		},
		take: Number(limit),
		skip: offset,
		orderBy: {
			followers: { _count: 'desc' },
		},
		select: {
			id: true,
			username: true,
			description: true,
			isAdmin: true,
			blocked: true,
			userImage: {
				select: { cloudinaryImage: true },
			},
			followers: {
				select: { followerId: true },
			},
			following: {
				select: { followingId: true },
			},
		},
	});
}

export default async (req: Request, res: Response): Promise<void> => {
	const { keyword, page = 1, limit = 10 } = req.query as unknown as Query;

	try {
		// Fetch users
		const users: User[] = await getUsers(keyword, Number(page), Number(limit));

		const tokenDataId: number = req.tokenData?.id;

		const searchResult: ResponseData[] = users.map(user => {
			let isFollowing: boolean = null;

			if (tokenDataId && user.id !== tokenDataId) {
				isFollowing = user.followers.some(
					follower => follower.followerId === tokenDataId,
				);
			}

			return {
				...user,
				followers: user.followers.length,
				following: user.following.length,
				isFollowing,
			};
		});

		// If no users found
		if (!users.length) {
			throw new Error('Account not found');
		}

		// Fetch total count
		const totalCount: number = await prisma.user.count({
			where: {
				username: {
					contains: keyword,
					mode: 'insensitive',
				},
			},
		});

		// Send response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'Users fetched successfully',
			data: {
				users: searchResult,
				totalCount,
			},
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
