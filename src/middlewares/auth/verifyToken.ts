import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedToken, Request } from 'types';
import generateToken from '../../utils/generateToken';
import handleResponse from '../../utils/handleResponse';

// Possible errors
const ERRORS = [
	{ message: 'No token provided!', status: 401 },
	{ message: 'invalid token', status: 403 },
	{ message: 'jwt expired', status: 403 },
	{ message: 'jwt malformed', status: 403 },
	{ message: 'jwt not active', status: 403 },
];

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
		// Find the error
		const errorFound = ERRORS.find(err => err.message === error.message);

		// Send the response (if the error is not found, then send 500)
		handleResponse({
			res,
			status: 'error',
			statusCode: errorFound ? errorFound.status : 500,
			message: errorFound ? errorFound.message : 'Something went wrong!',
			error: errorFound ? undefined : error,
		});
	}
};
