import colors from 'colors';
import jwt from 'jsonwebtoken';
import { DecodedToken } from 'types';
import mongodb from '../config/mongo.config';
import redis from '../config/redis.config';

// Function to remove expired tokens from the Redis cache
async function updateRevokedTokens() {
	console.log(
		colors.yellow('[handleToken.middleware.ts] ') +
			colors.cyan('Removing expired tokens from Redis cache'),
	);

	const now = Date.now();

	// Clear the Redis cache
	await redis.flushall();

	// Go fetch all the tokens from the MongoDB collection
	const allRevokedTokens = await mongodb.db.collection('revokedTokens').find().toArray();

	// Check if any token expired
	for (const revokedToken of allRevokedTokens) {
		const decoded = jwt.decode(revokedToken.token) as DecodedToken;
		if (decoded.exp && decoded.exp * 1000 < now) {
			// Remove the token from the MongoDB collection
			await mongodb.db
				.collection('revokedTokens')
				.deleteOne({ token: revokedToken.token });

			// Remove the token from the array
			allRevokedTokens.splice(allRevokedTokens.indexOf(revokedToken), 1);
		}
	}

	// Cache all the tokens from the MongoDB collection
	for (const revokedToken of allRevokedTokens) {
		await redis.set(revokedToken.token, 'revoked');
	}
}

export default updateRevokedTokens;
