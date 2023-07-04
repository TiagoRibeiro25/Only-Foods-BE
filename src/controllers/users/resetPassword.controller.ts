import bcrypt from 'bcryptjs';
import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import generateToken from '../../utils/generateToken';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

export default async (req: Request, res: Response) => {
	const { password } = req.body;
	const userId = req.tokenData.id;
	const newToken = generateToken.resetPasswordToken({ id: userId });

	// Encrypt new password
	const passwordEncrypted = await bcrypt.hash(password, 10);

	// Update the user's password
	try {
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				password: passwordEncrypted,
				resetPasswordToken: newToken,
			},
		});

		// Send the response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'Password updated successfully',
		});
	} catch (error) {
		handleError({ res, error });
	}
};
