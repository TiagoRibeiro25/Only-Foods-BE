import colors from 'colors';
import checkEnvs from './utils/checkEnvs';

// Clear the console
console.clear();

// Log the environment
console.log(
	colors.yellow('[server.ts] ') +
		colors.cyan('Environment: ') +
		colors.yellow(process.env.NODE_ENV),
);

// Load the environment variables from the .env file (development only)
if (process.env.NODE_ENV !== 'production') {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	require('dotenv').config();
}

// Check if all the environment variables are set
console.log(
	colors.yellow('[server.ts] ') + colors.cyan('Checking the environment variables...'),
);

if (!checkEnvs()) {
	process.exit(1);
}

import app from './app';
import connectToDatabases from './services/connectToDatabases';
const PORT: string = process.env.PORT;

app.listen(PORT, () => {
	console.log(colors.yellow('[server.ts] ') + colors.cyan('Starting the server...'));
	console.log(
		colors.yellow('[server.ts] ') + colors.cyan('Connecting to the databases...'),
	);

	// Connect to the databases
	connectToDatabases()
		.then(() => {
			console.log(
				colors.yellow('[server.ts] ') +
					colors.cyan('Server is running on port: ') +
					colors.yellow(PORT + '\n'),
			);
		})
		.catch(error => {
			console.log(
				colors.yellow('[server.ts] ') + colors.red('Error: ') + colors.yellow(error.name),
			);
			console.log(
				colors.yellow('[server.ts] ') +
					colors.red('Message: ') +
					colors.yellow(error.message),
			);

			process.exit(1);
		});
});
