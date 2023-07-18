import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

interface FollowingData {
	id: number;
	followerId: number;
	followingId: number;
	createdAt: Date;
	updatedAt: Date;
}

export default async (req: Request, res: Response) => {
	// The id of the user to follow/unfollow
	const followingId: number = +req.params.id;
	// The id of the user who wants to follow/unfollow
	const followerId: number = req.tokenData.id;

	try {
		// Check if the user is already following the other user
		const existingFollowing: FollowingData = await prisma.following.findFirst({
			where: {
				followerId: followerId,
				followingId: followingId,
			},
		});

		if (existingFollowing) {
			// User is already following the other user, unfollow him
			await prisma.following.delete({
				where: {
					id: existingFollowing.id,
				},
			});
		} else {
			// User is not following the other user, follow him
			await prisma.following.create({
				data: {
					follower: { connect: { id: followerId } },
					following: { connect: { id: followingId } },
				},
			});
		}

		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'User followed successfully',
		});
	} catch (error) {
		const fileName =
			process.env.NODE_ENV !== 'production' ? __filename.split('\\').at(-1) : '';
		handleError({ res, error, fileName });
	}
};
