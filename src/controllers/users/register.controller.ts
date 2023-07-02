import bcrypt from 'bcryptjs';
import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import generateToken from '../../utils/generateToken';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

interface RegisterData {
	username: string;
	email: string;
	password: string;
}

export default async (req: Request, res: Response): Promise<void> => {
	const { username, email, password }: RegisterData = req.body;

	try {
		// encrypt the password
		const passwordEncrypted = await bcrypt.hash(password, 10);

		// create the user and generate reset password token in one database transaction
		await prisma.$transaction(async prisma => {
			const createdUser = await prisma.user.create({
				data: {
					username,
					email,
					password: passwordEncrypted,
					resetPasswordToken: '',
				},
			});

			const resetPwToken = generateToken.resetPasswordToken({
				id: createdUser.id,
				email: createdUser.email,
			});

			await prisma.user.update({
				where: { id: createdUser.id },
				data: { resetPasswordToken: resetPwToken },
			});

			return createdUser;
		});

		handleResponse({
			res,
			status: 'success',
			statusCode: 201,
			message: 'User created successfully',
		});
	} catch (error) {
		handleError({ res, error });
	}
};
