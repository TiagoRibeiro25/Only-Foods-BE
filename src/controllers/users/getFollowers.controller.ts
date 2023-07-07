import { Response } from 'express';
import { FollowType, Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

const getUser = (userId: string) => {
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
};

export default async (req: Request, res: Response): Promise<void> => {
	const type = req.query.type as FollowType;
	const userId = req.params.id === 'me' ? req.tokenData.id : req.params.id;

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

		const result = user[type].map(item => ({
			id: item[type].id,
			username: item[type].username,
			description: item[type].description,
			userImage: item[type].userImage,
			isFollowing: null,
		}));

		const tokenDataId = req.tokenData?.id;
		const followingIds = result.map(item => item.id);

		// Check if logged user is following any of the users
		if (tokenDataId && followingIds.includes(tokenDataId)) {
			const relations = await prisma.following.findMany({
				where: {
					followerId: tokenDataId,
					followingId: { in: followingIds },
				},
				select: {
					followingId: true,
				},
			});

			const followingSet = new Set(relations.map(relation => relation.followingId));

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