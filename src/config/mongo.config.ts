import colors from 'colors';
import { MongoClient, MongoClientOptions } from 'mongodb';

// Connection Options
const options: MongoClientOptions = {
	connectTimeoutMS: 10000,
};

// Connection URL
const url: string = process.env.MONGO_DB_URL;
const client = new MongoClient(url, options);

// Database Name
const dbName: string = process.env.MONGO_DB_NAME;

// Connect to the database
async function connect() {
	try {
		// Use connect method to connect to the Server
		await client.connect();
		const db = client.db(dbName);
		return db;
	} catch (error) {
		console.log(
			colors.yellow('[mongo.config.ts] ') +
				colors.red('Error: ') +
				colors.yellow(error.name),
		);
		console.log(
			colors.yellow('[mongo.config.ts] ') +
				colors.red('Message: ') +
				colors.yellow(error.message),
		);
		process.exit(1);
	}
}

const db = client.db(dbName);

export default { connect, db };
