import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedToken, Request } from 'types';
import handleError from 'utils/handleError';
import generateToken from '../../utils/generateToken';

module.exports = (req: Request, res: Response, next: NextFunction) => {
	// Get auth header value
	let token = req.headers['authorization'];

	try {
		// Check if the token is undefined
		if (!token) {
			throw new Error('No token provided!');
		}

		// Remove Bearer from string
		if (token.startsWith('Bearer ')) {
			token = token.slice(7, token.length);
		}

		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

		// If the token was generated "JWT_GENERATE_TOKEN_IN" seconds ago, then generate a new one
		if (Date.now() / 1000 - decoded.iat > parseInt(process.env.JWT_GENERATE_TOKEN_IN)) {
			const newToken = generateToken({
				id: decoded.id,
				email: decoded.email,
				username: decoded.username,
			});

			// Set the new token in the header
			res.setHeader('authorization', `Bearer ${newToken}`);
		}

		// Set the decoded token in the request
		req.tokenData = decoded;

		// Call the next middleware
		next();
	} catch (error: any) {
		handleError({ res, error });
	}
};
