import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedToken, Request } from 'types';
import generateToken from '../../utils/generateToken';
import handleError from '../../utils/handleError';

export default (req: Request, res: Response, next: NextFunction): void => {
	// Get auth header value
	const token = req.cookies['authorization'];

	try {
		//TODO: Do this in the route that needs it
		// (if req.tokenData is undefined, then throw an error)
		// Check if the token is undefined
		// throw new Error('No token provided');

		if (token) {
			// Verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

			// If the token was generated "JWT_GENERATE_TOKEN_IN" milliseconds ago, then generate a new one
			const tokenExpiration = parseInt(process.env.JWT_GENERATE_TOKEN_IN);
			const shouldGenerateNewToken = Date.now() - decoded.iat * 1000 > tokenExpiration;
			if (shouldGenerateNewToken) {
				const newToken = generateToken.authToken({
					id: decoded.id,
					email: decoded.email,
					username: decoded.username,
					rememberMe: decoded.rememberMe,
				});

				// Update the cookie
				const cookieOptions = {
					httpOnly: true,
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
