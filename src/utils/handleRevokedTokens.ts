import colors from 'colors';
import jwt from 'jsonwebtoken';
import { DecodedToken } from 'types';
import mongodb from '../config/mongo.config';
import redis from '../config/redis.config';

// Function to remove expired tokens from the Redis cache
async function updateTokenWhiteList(): Promise<void> {
	console.log(
		colors.yellow('[handleToken.middleware.ts] ') +
			colors.cyan('Removing expired tokens from Redis cache'),
	);

	const now = Date.now();

	// Go fetch all the tokens from the MongoDB collection
	const tokens = await mongodb.db.collection('tokens').find().toArray();
	const tokensToDelete: string[] = [];
	const tokensToCache: { [key: string]: string } = {};

	// Check if any token expired and create a new object with tokens to cache
	for (const token of tokens) {
		const decoded = jwt.decode(token.token) as DecodedToken;
		if (decoded.exp && decoded.exp * 1000 < now) {
			// Add the token to the array of tokens to delete
			tokensToDelete.push(token.token);
		} else {
			// Add the token to the object of tokens to cache
			tokensToCache[token.token] = 'whiteListed';
		}
	}

	// Remove the expired tokens from the MongoDB collection
	await mongodb.db.collection('tokens').deleteMany({ token: { $in: tokensToDelete } });

	// Clear the Redis cache
	await redis.flushall();

	// Cache all the non-expired tokens in Redis using mset
	if (Object.keys(tokensToCache).length > 0) {
		await redis.mset(tokensToCache);
	}
}

export default updateTokenWhiteList;
