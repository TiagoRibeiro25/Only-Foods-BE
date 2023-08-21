import { Response } from 'express';
import prisma from '../../config/db.config';
import { FollowType, Request } from '../../types';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

interface FollowData {
	id: number;
	username: string;
	description: string;
	blocked: boolean;
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

interface Relation {
	followingId: number;
}

interface ResultItem {
	id: number;
	username: string;
	description: string;
	userImage?: {
		cloudinaryImage: string;
	};
	isAdmin: boolean;
	isFollowing: boolean | null;
}

function getUser(userId: number) {
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
							blocked: true,
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
							blocked: true,
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
	const userId: number = req.params.id === 'me' ? req.tokenData.id : +req.params.id;

	try {
		// Fetch the user
		const user = await getUser(userId);

		// Check if user exists
		if (!user) {
			throw new Error('Account not found');
		}

		// Check if user has followers or is following users
		if (user[type].length === 0) {
			throw new Error('No users found');
		}

		const result: ResultItem[] = user[type].map((item: UserFollower | UserFollowing) => {
			const isFollower = 'follower' in item;

			const userData = isFollower ? item.follower : item.following;

			return {
				id: userData.id,
				username: userData.username,
				description: userData.description,
				blocked: userData.blocked,
				userImage: userData.userImage,
				isAdmin: userData.isAdmin,
				isFollowing: null,
			};
		});

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

			const followingSet: Set<number> = new Set(
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
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
