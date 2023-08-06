import colors from 'colors';
import prisma from '../config/db.config';

export default async function connectToDatabases(): Promise<void> {
	try {
		// Connect to the postgresql database
		await prisma.$connect();
		console.log(
			colors.yellow('[connectToDatabases.ts] ') +
				colors.cyan('Connected successfully to postgresql database'),
		);

		// Connect to the redis database
		require('../config/redis.config');
		console.log(
			colors.yellow('[connectToDatabases.ts] ') +
				colors.cyan('Connected successfully to redis database'),
		);
	} catch (error) {
		console.log(
			colors.yellow('[connectToDatabases.ts] ') +
				colors.red('Error: ') +
				colors.yellow(error.name),
		);
		console.log(
			colors.yellow('[connectToDatabases.ts] ') +
				colors.red('Message: ') +
				colors.yellow(error.message),
		);

		process.exit(1);
	}
}
