import Redis from 'ioredis';

// Configure connection options with a timeout
const connectionOptions = {
	retryStrategy: (times: number) => {
		// Retry for a maximum of 5 times
		if (times >= 5) {
			// Throw an error after the maximum retries
			throw new Error('Failed to connect to Redis after multiple attempts');
		}
		// Retry after 1 second
		return 1000;
	},
};

// Connect to Redis with the specified options
const redis = new Redis({
	host: process.env.REDIS_HOST,
	port: parseInt(process.env.REDIS_PORT),
	db: parseInt(process.env.REDIS_DB),
	...connectionOptions,
});

export default redis;
