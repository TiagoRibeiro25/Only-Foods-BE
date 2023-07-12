import { User } from '@prisma/client';
import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import sendEmail from '../../services/sendEmail';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

export default async (req: Request, res: Response): Promise<void> => {
	try {
		const email: string = req.body.email;

		// Check there's an account with the email provided
		const user: User = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			throw new Error('Account not found');
		}

		const token: string = user.resetPasswordToken;

		// TODO: Update the email content with the email template and correct link
		await sendEmail({
			from: 'Only Foods Support Team',
			to: [{ email: user.email, name: user.username }],
			subject: 'Reset your password',
			content: `Reset password token: ${token}`,
		});

		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'Email sent',
		});
	} catch (error) {
		handleError({ error, res, fileName: __filename.split('\\').at(-1) });
	}
};
