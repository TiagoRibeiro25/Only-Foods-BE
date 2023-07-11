import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

const getUser = (id: string) => {
	return prisma.user.findUnique({
		where: {
			id: id,
		},
		select: {
			id: true,
			username: true,
			email: true,
			description: true,
			blocked: true,
			isAdmin: true,
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
};

export default async (req: Request, res: Response): Promise<void> => {
	// Get id from url params
	const { id } = req.params;
	// Check if there's a token
	const isTokenProvided = req.tokenData !== undefined;

	try {
		// If the id is "me" and there's no token, return 401
		if (id === 'me' && !isTokenProvided) {
			throw new Error('No token provided');
		}

		// If the id is "me" and there's a token, return the user data
		if (id === 'me') {
			const user = await getUser(req.tokenData.id);

			return handleResponse({
				res,
				status: 'success',
				statusCode: 200,
				data: {
					...user,
					followers: user.followers.length,
					following: user.following.length,
					isLoggedUser: true,
				},
				message: 'User data retrieved successfully',
			});
		}

		// Check if the user exists
		const user = await getUser(id);
		if (!user) {
			throw new Error('Account not found');
		}

		// If there's a token,
		if (isTokenProvided) {
			// check if the user is the logged user
			const isLoggedUser = user.id === req.tokenData.id;

			// Check if the logged user is following the user
			const isFollowing = isLoggedUser
				? null
				: user.followers.some(follower => follower.followerId === req.tokenData.id);

			return handleResponse({
				res,
				status: 'success',
				statusCode: 200,
				data: {
					...user,
					followers: user.followers.length,
					following: user.following.length,
					isLoggedUser,
					isFollowing,
				},
				message: 'User data retrieved successfully',
			});
		}

		// If there's no token, return the user data
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			data: {
				...user,
				followers: user.followers.length,
				following: user.following.length,
			},
			message: 'User data retrieved successfully',
		});
	} catch (error) {
		handleError({ res, error });
	}
};
