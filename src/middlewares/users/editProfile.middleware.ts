import { NextFunction, Response } from 'express';
import prisma from '../../config/db.config';
import { Base64Img, Request } from '../../types';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';
import validateData from '../../utils/validateData';

interface EditProfileData {
	username?: string;
	email?: string;
	description?: string;
	picture?: Base64Img;
}

interface ValidateEmailProps {
	email: string;
	userId: number;
}

async function validateEmail(props: ValidateEmailProps): Promise<void> {
	const { email, userId } = props;

	if (!email) {
		return;
	}

	if (email && !validateData.email(email)) {
		throw new Error('Invalid email');
	}

	// Check if there's an account with the same email
	const isEmailInUse = await prisma.user.findFirst({
		where: { email },
		select: { id: true },
	});

	if (isEmailInUse && isEmailInUse.id !== userId) {
		throw new Error('Email already in use');
	}
}

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		// Get the data from the request body
		const { username, email, description, picture }: EditProfileData = req.body;

		if (!username && !email && !description && !picture) {
			return handleResponse({
				res,
				status: 'success',
				statusCode: 204,
				message: 'No data to edit',
			});
		}

		// Check if the user wants to edit his X parameter and validate it

		// Check username
		if (username && !validateData.username(username)) {
			throw new Error('Invalid username');
		}

		// Check email
		await validateEmail({ email, userId: req.tokenData.id });

		// Check description
		if (description && !validateData.description(description)) {
			throw new Error('Invalid description');
		}

		// Check picture
		if (picture && !validateData.base64Image(picture)) {
			throw new Error('Invalid image');
		}

		// Remove all the data from the request body that isn't needed
		req.body = {
			...(username && { username }),
			...(email && { email }),
			...(description && { description }),
			...(picture && { picture }),
		};

		// Call the next middleware
		next();
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
