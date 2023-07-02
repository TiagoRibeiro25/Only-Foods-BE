import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

const getUser = async (id: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id: id,
		},
		select: {
			id: true,
			username: true,
			email: true,
			createdAt: true,
			updatedAt: true,
			userImage: {
				select: { cloudinaryImage: true, cloudinaryId: true },
			},
			followers: {
				select: { id: true },
			},
			following: {
				select: { id: true },
			},
			groups: {
				select: {
					group: {
						select: {
							id: true,
							name: true,
							members: { select: { id: true } },
						},
					},
				},
			},
			thoughts: {
				where: { groupId: null },
				select: {
					id: true,
					content: true,
					likes: { select: { id: true } },
					comments: { select: { id: true } },
				},
			},
			recipes: {
				where: { groupId: null },
				select: {
					id: true,
					title: true,
					recipeImages: { select: { cloudinaryImage: true, cloudinaryId: true } },
					likes: { select: { id: true } },
					comments: { select: { id: true } },
				},
			},
		},
	});

	return user;
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
				data: { ...user, isLoggedUser: true },
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
				: user.followers.some(follower => follower.id === req.tokenData.id);

			return handleResponse({
				res,
				status: 'success',
				statusCode: 200,
				data: { ...user, isLoggedUser, isFollowing },
				message: 'User data retrieved successfully',
			});
		}

		// if there's no token, return the user data
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			data: user,
			message: 'User data retrieved successfully',
		});
	} catch (error) {
		handleError({ res, error });
	}
};
