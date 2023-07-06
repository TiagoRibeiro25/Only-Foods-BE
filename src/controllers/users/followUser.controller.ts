import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

export default async (req: Request, res: Response) => {
	const followingId = req.params.id; // The id of the user to follow/unfollow
	const followerId = req.tokenData.id; // The id of the user who wants to follow/unfollow

	try {
		// Check if the user is already following the other user
		const existingFollowing = await prisma.following.findFirst({
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

			return handleResponse({
				res,
				status: 'success',
				statusCode: 200,
				message: 'User unfollowed successfully',
			});
		}

		// User is not following the other user, follow him
		await prisma.following.create({
			data: {
				follower: { connect: { id: followerId } },
				following: { connect: { id: followingId } },
			},
		});

		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'User followed successfully',
		});
	} catch (error) {
		handleError({ res, error });
	}
};