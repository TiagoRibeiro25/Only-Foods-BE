import { User } from '@prisma/client';
import { CookieOptions, NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedToken, Request } from 'types';
import prisma from '../../config/db.config';
import generateToken from '../../utils/generateToken';
import handleError from '../../utils/handleError';

/**
 * Middleware that handles the token
 * This middleware will check if the token is valid and if it is, it will set the decoded token in the request
 * If the token is not valid, it will call the error handler middleware
 ** Important: This middleware doesn't check if the token is mandatory or not
 */
export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	// Get token value
	const token: string | undefined = req.cookies['authorization'];

	try {
		if (token) {
			// Verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

			// Check if the user exists
			const user: User = await prisma.user.findUnique({
				where: { id: decoded.id },
			});

			if (!user) {
				throw new Error('invalid token');
			}

			// Set the user data in the decoded token
			decoded.isAdmin = user.isAdmin;

			// Check if the token should be regenerated
			const tokenExpiration: number = parseInt(process.env.JWT_GENERATE_TOKEN_IN);
			const shouldGenerateNewToken: boolean =
				Date.now() - decoded.iat * 1000 > tokenExpiration;

			// If the token was generated "JWT_GENERATE_TOKEN_IN" milliseconds ago, then generate a new one
			if (shouldGenerateNewToken) {
				const newToken: string = generateToken.authToken({
					id: decoded.id,
					rememberMe: decoded.rememberMe,
					isAdmin: decoded.isAdmin,
				});

				// Update the cookie
				const cookieOptions: CookieOptions = {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					maxAge: parseInt(
						decoded.rememberMe
							? process.env.JWT_EXPIRES_IN_REMEMBER_ME
							: process.env.JWT_EXPIRES_IN,
					),
				};

				res.cookie('authorization', newToken, cookieOptions);
			}

			// Set the decoded token in the request
			req.tokenData = decoded;
		}

		// Call the next middleware
		next();
	} catch (error) {
		handleError({ res, error });
	}
};
