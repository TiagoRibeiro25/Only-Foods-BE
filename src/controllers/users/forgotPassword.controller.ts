import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

export default async (req: Request, res: Response): Promise<void> => {
	try {
		const email: string = req.body.email;

		// Check there's an account with the email provided
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			throw new Error('Account not found');
		}

		const token = user.resetPasswordToken;

		// TODO: Send email with token
		console.log('Send email with token:', token);

		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'Email sent',
		});
	} catch (error) {
		handleError({ error, res });
	}
};
