import { UploadApiResponse } from 'cloudinary';
import { Response } from 'express';
import cloudinary from '../../config/cloudinary.config';
import prisma from '../../config/db.config';
import redis from '../../config/redis.config';
import { Base64Img, Request } from '../../types';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

interface EditProfileData {
	username?: string;
	email?: string;
	description?: string;
	picture?: Base64Img;
}

interface HandleUserPictureProps {
	userId: number;
	picture: Base64Img;
}

async function handleUserPicture(props: HandleUserPictureProps): Promise<void> {
	const { userId, picture } = props;

	// Check if the user already has a picture
	const userPicture = await prisma.userImage.findFirst({
		where: { userId: +userId },
	});

	// If the user already has a picture, update the cloudinary image with the id userPicture.cloudinaryId
	if (userPicture) {
		const result: UploadApiResponse = await cloudinary.uploader.upload(picture, {
			public_id: userPicture.cloudinaryId,
			overwrite: true,
			transformation: { width: 150, height: 150, crop: 'limit' },
		});

		// Update the user image in the database
		await prisma.userImage.update({
			where: {
				id: userPicture.id,
			},
			data: {
				cloudinaryId: result.public_id,
				cloudinaryImage: result.secure_url,
			},
		});
	} else {
		const folderName = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

		// Create a new user image in Cloudinary
		const result: UploadApiResponse = await cloudinary.uploader.upload(picture, {
			folder: `only_foods/${folderName}/users`,
			crop: 'scale',
			transformation: { width: 150, height: 150, crop: 'limit' },
		});

		// Create a new user image in the database
		await prisma.userImage.create({
			data: {
				cloudinaryId: result.public_id,
				cloudinaryImage: result.secure_url,
				userId: userId,
			},
		});
	}
}

export default async (req: Request, res: Response): Promise<void> => {
	// Get the data from the request body
	const updates: EditProfileData = req.body;

	try {
		// Get the user id from the request
		const userId: number = req.tokenData.id;

		// Check if the user wants to update the picture
		if (updates.picture) {
			// Handle the user picture
			await handleUserPicture({ userId, picture: updates.picture });

			// Remove the picture from the updates object
			delete updates.picture;
		}

		// Update the user
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				...updates,
			},
		});

		if (updates.username) {
			// Update the user in Redis (if he's logged in)
			const redisUser = await redis.get(userId.toString());
			if (redisUser) {
				await redis.set(
					userId.toString(),
					JSON.stringify({
						userData: {
							username: updates.username,
							password: JSON.parse(redisUser).userData.password,
							isAdmin: JSON.parse(redisUser).userData.isAdmin,
							isBlocked: JSON.parse(redisUser).userData.isBlocked,
						},
						tokens: JSON.parse(redisUser).tokens,
					}),
				);
			}
		}

		// Send the response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'User updated successfully',
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
