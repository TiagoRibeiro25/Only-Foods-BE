import { User as PrismaUser } from '@prisma/client';
import { Response } from 'express';
import { FollowType, Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

interface FollowData {
	id: string;
	username: string;
	description: string;
	userImage?: {
		cloudinaryImage: string;
	};
	isAdmin: boolean;
}

interface UserFollower {
	follower: FollowData;
}

interface UserFollowing {
	following: FollowData;
}

interface User extends PrismaUser {
	followers: UserFollower[];
	following: UserFollowing[];
}

interface Relation {
	followingId: string;
}

interface ResultItem {
	id: string;
	username: string;
	description: string;
	userImage?: {
		cloudinaryImage: string;
	};
	isAdmin: boolean;
	isFollowing: boolean | null;
}

function getUser(userId: string): Promise<User> {
	return prisma.user.findUnique({
		where: { id: userId },
		include: {
			followers: {
				include: {
					follower: {
						select: {
							id: true,
							username: true,
							description: true,
							isAdmin: true,
							userImage: {
								select: {
									cloudinaryImage: true,
								},
							},
						},
					},
				},
			},
			following: {
				include: {
					following: {
						select: {
							id: true,
							username: true,
							description: true,
							isAdmin: true,
							userImage: {
								select: {
									cloudinaryImage: true,
								},
							},
						},
					},
				},
			},
		},
	});
}

export default async (req: Request, res: Response): Promise<void> => {
	const type = req.query.type as FollowType;
	const userId: string = req.params.id === 'me' ? req.tokenData.id : req.params.id;

	try {
		// Fetch the user
		const user: User = await getUser(userId);

		// Check if user exists
		if (!user) {
			throw new Error('Account not found');
		}

		// Check if user has followers or is following users
		if (user[type].length === 0) {
			throw new Error('No users found');
		}

		const result: ResultItem[] = user[type].map((item: UserFollower | UserFollowing) => ({
			id: item[type].id,
			username: item[type].username,
			description: item[type].description,
			userImage: item[type].userImage,
			isAdmin: item[type].isAdmin,
			isFollowing: null,
		}));

		const tokenDataId = req.tokenData?.id;
		const followingIds = result.map(item => item.id);

		// Check if logged user is following any of the users
		if (tokenDataId && followingIds.includes(tokenDataId)) {
			const relations: Relation[] = await prisma.following.findMany({
				where: {
					followerId: tokenDataId,
					followingId: { in: followingIds },
				},
				select: {
					followingId: true,
				},
			});

			const followingSet: Set<string> = new Set(
				relations.map(relation => relation.followingId),
			);

			for (const item of result) {
				// Check if logged user is the same as the current user
				if (item.id === tokenDataId) {
					item.isFollowing = null;
				} else {
					// Check if the current user is being followed by the logged user
					item.isFollowing = followingSet.has(item.id);
				}
			}
		}

		// Send the response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: `Successfully fetched ${type}`,
			data: result,
		});
	} catch (error) {
		handleError({ error, res });
	}
};
