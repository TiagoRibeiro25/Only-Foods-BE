import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getCookiesOptions, getDeleteCookiesOptions } from '../../config/cookies.config';
import redis from '../../config/redis.config';
import { DecodedToken, Request } from '../../types';
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
	const token: string | undefined = req.cookies['onlyfoods_jwt'];

	try {
		if (token) {
			// Verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

			// Find the token in Redis
			const userToken = await redis.get(decoded.id.toString());

			// Check if the token is whitelisted (not revoked)
			if (userToken !== token) {
				throw new Error('Token revoked');
			}

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
				const cookieOptions = getCookiesOptions(decoded.rememberMe);
				res.cookie('onlyfoods_jwt', newToken, cookieOptions);

				// Replace the value in redis with the new token
				await redis.set(decoded.id.toString(), newToken);
				await redis.expire(decoded.id.toString(), cookieOptions.maxAge / 1000);
			}

			// Set the decoded token in the request plus the user data
			req.tokenData = decoded;
		}

		// Call the next middleware
		next();
	} catch (error) {
		// Delete the token from the user cookies
		const deleteCookiesOptions = getDeleteCookiesOptions();
		res.clearCookie('onlyfoods_jwt', deleteCookiesOptions);

		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
