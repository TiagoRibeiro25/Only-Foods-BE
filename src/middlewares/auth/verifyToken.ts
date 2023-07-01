import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedToken, Request } from 'types';
import handleError from 'utils/handleError';
import generateToken from '../../utils/generateToken';

export default (req: Request, res: Response, next: NextFunction) => {
	// Get auth header value
	const token = req.cookies['authorization'];

	try {
		// Check if the token is undefined
		if (!token) {
			throw new Error('No token provided');
		}

		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

		// If the token was generated "JWT_GENERATE_TOKEN_IN" seconds ago, then generate a new one
		if (Date.now() / 1000 - decoded.iat > parseInt(process.env.JWT_GENERATE_TOKEN_IN)) {
			const newToken = generateToken.authToken({
				id: decoded.id,
				email: decoded.email,
				username: decoded.username,
			});

			// Update the cookie
			res.cookie('authorization', newToken, {
				httpOnly: true,
				maxAge: parseInt(process.env.JWT_EXPIRES_IN),
			});
		}

		// Set the decoded token in the request
		req.tokenData = decoded;

		// Call the next middleware
		next();
	} catch (error) {
		handleError({ res, error });
	}
};
