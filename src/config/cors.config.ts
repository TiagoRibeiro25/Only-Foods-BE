import { CorsOptions } from 'cors';

/**
 * CORS Configuration
 *
 * This configuration will check if the origin of the request is the same as the frontend URL.
 * If it is, it will allow the request. If it's not, it will throw an error.
 * This is to prevent CSRF attacks.
 *
 * If the environment is not production, it will allow all requests (for development purposes).
 *
 * @see https://expressjs.com/en/resources/middleware/cors.html
 */
const corsConfig: CorsOptions = {
	origin: (origin, callback) => {
		if (process.env.NODE_ENV === 'production') {
			if (origin === process.env.FRONTEND_URL) {
				callback(null, true); // Allow the request
			} else {
				// For debugging purposes
				console.log('origin', origin);
				console.log('process.env.FRONTEND_URL', process.env.FRONTEND_URL);

				callback(new Error('Not allowed by CORS')); // Throw an error if origin doesn't match
			}
		} else {
			callback(null, true); // Allow all requests in development mode
		}
	},
	credentials: true, // Enable sending and receiving cookies from the client-side
};

export default corsConfig;
