import Redis from 'ioredis';

// Connection URL
const url: string = process.env.REDIS_URL;

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
const redis = new Redis(url, connectionOptions);

export default redis;
