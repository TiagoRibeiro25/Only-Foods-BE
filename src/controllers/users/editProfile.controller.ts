import { Response } from 'express';
import { Base64Img, Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';

interface EditProfileData {
	username?: string;
	email?: string;
	description?: string;
	picture?: Base64Img;
}

export default async (req: Request, res: Response): Promise<void> => {
	// Get the data from the request body
	const updates: EditProfileData = req.body;

	try {
		// Get the user id from the request
		const userId = req.tokenData.id;

		// Update the user
		//TODO: Update the user picture (cloudinary)
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				...updates,
			},
		});
	} catch (error) {
		handleError({ res, error });
	}
};
