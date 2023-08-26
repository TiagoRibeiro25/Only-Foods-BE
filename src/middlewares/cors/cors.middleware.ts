import { CorsOptions } from 'cors';
import { NextFunction, Request, Response } from 'express';
import handleError from '../../utils/handleError';

/**
 * CORS Configuration Middleware
 *
 * This middleware wraps the CORS configuration and sends a custom response instead of crashing the server.
 */
export const corsMiddleware = (corsConfig: CorsOptions) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const { origin } = corsConfig;

			if (typeof origin === 'function') {
				origin(req.headers.origin, (error, allow) => {
					if (error || !allow) {
						throw new Error('Not allowed by CORS');
					} else {
						// If allowed by CORS, proceed with the next middleware
						next();
					}
				});
			} else if (typeof origin === 'string' && origin === req.headers.origin) {
				// If the origin is a string and matches the request origin, proceed with the next middleware
				next();
			} else {
				// If origin is not a function and doesn't match, send a custom response
				throw new Error('Not allowed by CORS');
			}
		} catch (error) {
			error.message = 'Not allowed by CORS';

			// Handle any unexpected errors here
			handleError({
				res,
				error,
				fileName: __filename.split('\\').at(-1),
			});
		}
	};
};
