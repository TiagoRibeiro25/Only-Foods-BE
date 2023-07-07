import { Response } from 'express';
import { Base64Img, Request } from 'types';
import cloudinary from '../../config/cloudinary.config';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

interface EditProfileData {
	username?: string;
	email?: string;
	description?: string;
	picture?: Base64Img;
}

interface HandleUserPictureProps {
	userId: string;
	picture: Base64Img;
}

async function handleUserPicture(props: HandleUserPictureProps): Promise<void> {
	const { userId, picture } = props;

	// Check if the user already has a picture
	const userPicture = await prisma.userImage.findFirst({
		where: {
			userId,
		},
	});

	// If the user already has a picture, update the cloudinary image with the id userPicture.cloudinaryId
	if (userPicture) {
		const result = await cloudinary.uploader.upload(picture, {
			public_id: userPicture.cloudinaryId,
			overwrite: true,
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
		// Create a new user image in Cloudinary
		const result = await cloudinary.uploader.upload(picture, {
			folder: 'only_foods/users',
			crop: 'scale',
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
		const userId = req.tokenData.id;

		// Check if the user already has an image
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

		// Send the response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'User updated successfully',
		});
	} catch (error) {
		handleError({ res, error });
	}
};
