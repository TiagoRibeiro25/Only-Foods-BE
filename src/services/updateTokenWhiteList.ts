import jwt from 'jsonwebtoken';
import redis from '../config/redis.config';
import { DecodedToken } from '../types';

function verifyIfTokenExpired(token: string): boolean {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

		if (decoded.exp * 1000 < Date.now()) {
			return true;
		}

		return false;
	} catch (error) {
		return true;
	}
}

export default async (): Promise<string> => {
	// Get all keys from the Redis cache
	const users = await redis.keys('*');
	const tokensToDelete: string[] = [];

	// Check if any token is expired
	for (const userId of users) {
		const token = await redis.get(userId);
		if (verifyIfTokenExpired(token)) {
			// Add the token to the array of tokens to delete
			tokensToDelete.push(userId);
		}
	}

	// Remove the expired tokens from Redis
	if (tokensToDelete.length > 0) {
		await redis.del(tokensToDelete);
		return `Removed ${tokensToDelete.length} expired tokens from the database`;
	}

	return 'No expired tokens found';
};
