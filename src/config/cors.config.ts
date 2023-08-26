import { CorsOptions } from 'cors';

/**
 * CORS Configuration
 *
 * This configuration will check if the origin of the request is the same as the frontend URL or if it's undefined (for example, when the request is made from Postman)
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
			if (!origin || origin === process.env.FRONTEND_URL) {
				callback(null, true); // Allow the request
			} else {
				console.log('origin: ', origin);
				callback(new Error('Not allowed by CORS')); // Throw an error if origin doesn't match
			}
		} else {
			callback(null, true); // Allow all requests in development mode
		}
	},
	credentials: true, // Enable sending and receiving cookies from the client-side
	maxAge: 86400, // How long the results of a preflight request can be cached in a preflight result cache (in seconds)
};

export default corsConfig;
