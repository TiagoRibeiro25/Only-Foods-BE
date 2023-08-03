import jwt from 'jsonwebtoken';
import mongodb from '../config/mongo.config';
import redis from '../config/redis.config';
import { DecodedToken } from '../types';

export default async (): Promise<string> => {
	const now = Date.now();

	// Go fetch all the tokens from the MongoDB collection
	const tokens = await mongodb.db.collection('tokens').find().toArray();
	const tokensToDelete = [];

	// Check if any token expired and create a new object with tokens to cache
	for (const tokenDocument of tokens) {
		const token = tokenDocument.token;
		const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

		if (decoded.exp * 1000 < now) {
			// Add the token to the array of tokens to delete
			tokensToDelete.push(token);
		}
	}

	// Remove the expired tokens from the MongoDB collection
	if (tokensToDelete.length > 0) {
		await mongodb.db.collection('tokens').deleteMany({
			token: {
				$in: tokensToDelete,
			},
		});

		// Remove the expired tokens from the Redis cache
		await redis.del(tokensToDelete);

		return `Removed ${tokensToDelete.length} expired tokens from the database`;
	}

	return 'No expired tokens found';
};
