import { Response } from 'express';
import { Request } from 'types';
import prisma from '../../config/db.config';
import sendEmail from '../../services/sendEmail';
import resetPasswordEmail from '../../templates/resetPasswordEmail';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

export default async (req: Request, res: Response): Promise<void> => {
	try {
		// Check there's an account with the email provided
		const user = await prisma.user.findUnique({
			where: { email: req.body.email },
		});

		if (!user) {
			throw new Error('Account not found');
		}

		const token: string = user.resetPasswordToken;
		const email: string = resetPasswordEmail({
			username: user.username,
			resetPasswordUrl: `${process.env.FRONTEND_URL}/reset-password/${token}`,
		});

		await sendEmail({
			from: 'Only Foods Support Team',
			to: [{ email: user.email, name: user.username }],
			subject: 'Reset your password',
			content: email,
		});

		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'Email sent',
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
