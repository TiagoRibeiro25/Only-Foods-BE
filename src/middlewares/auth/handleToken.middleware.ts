import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getCookiesOptions, getDeleteCookiesOptions } from '../../config/cookies.config';
import jwtConfig from '../../config/jwt.config';
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
			const userData = JSON.parse(await redis.get(decoded.id.toString()));

			// Check if the token is whitelisted (not revoked)
			if (token !== userData.tokens[0] && token !== userData.tokens[1]) {
				throw new Error('Token revoked');
			}

			decoded.isAdmin = userData.userData.isAdmin;
			decoded.isBlocked = userData.userData.isBlocked;

			// If the token was generated 30 minutes ago, generate a new one
			if (Date.now() - decoded.iat * 1000 > jwtConfig.generateNewTokenInterval) {
				const newToken: string = generateToken.authToken({
					id: decoded.id,
					rememberMe: decoded.rememberMe,
					isAdmin: decoded.isAdmin,
					isBlocked: decoded.isBlocked,
				});

				// Update the cookie
				const cookieOptions = getCookiesOptions(decoded.rememberMe);
				res.cookie('onlyfoods_jwt', newToken, cookieOptions);

				// Update the data in Redis
				await redis.set(
					decoded.id.toString(),
					JSON.stringify({
						userData: { ...userData.userData },
						tokens: [token, newToken],
					}),
				);
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
