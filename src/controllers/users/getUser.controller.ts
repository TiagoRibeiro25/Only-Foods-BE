import { Response } from 'express';
import prisma from '../../config/db.config';
import { Request } from '../../types';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

interface User {
	id: number;
	username: string;
	email: string;
	resetPasswordToken: string;
	description: string;
	blocked: boolean;
	isAdmin: boolean;
	userImage: {
		cloudinaryImage: string;
	};
	followers: {
		followerId: number;
	}[];
	following: {
		followingId: number;
	}[];
	createdAt: Date;
}

interface ResponseData extends Omit<User, 'followers' | 'following'> {
	followers: number;
	following: number;
	isLoggedUser: boolean;
	isFollowing?: boolean;
}

const getUser = (id: number): Promise<User> => {
	return prisma.user.findUnique({
		where: {
			id: id,
		},
		select: {
			id: true,
			username: true,
			email: true,
			resetPasswordToken: true,
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
			createdAt: true,
		},
	});
};

export default async (req: Request, res: Response): Promise<void> => {
	// Get id from url params
	const id: string = req.params.id;
	// Check if there's a token
	const isTokenProvided: boolean = req.tokenData !== undefined;
	// Declare response data variable
	let responseData: ResponseData;

	try {
		// If the id is "me" and there's a token, return the user data
		if (id === 'me' || +id === req.tokenData?.id) {
			const user: User = await getUser(req.tokenData.id);

			responseData = {
				...user,
				followers: user.followers.length,
				following: user.following.length,
				isLoggedUser: true,
			};
		} else {
			// Check if the user exists
			const user: User = await getUser(+id);
			if (!user) {
				throw new Error('Account not found');
			}

			responseData = {
				...user,
				followers: user.followers.length,
				following: user.following.length,
				isLoggedUser: false,
				email: undefined,
				resetPasswordToken: undefined,
			};

			// If there's a token,
			if (isTokenProvided) {
				// Check if the logged user is following the user
				const isFollowing: boolean = user.followers.some(
					follower => follower.followerId === req.tokenData.id,
				);

				responseData.isFollowing = isFollowing;
			}
		}

		// Send response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			data: responseData,
			message: 'User data retrieved successfully',
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
