import colors from 'colors';
import checkEnvs from './utils/checkEnvs';

if (process.env.NODE_ENV !== 'production') {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	require('dotenv').config();
}

if (!checkEnvs()) {
	process.exit(1);
}

import app from './app';
import connectToDatabases from './utils/connectToDatabases';
import updateTokenWhiteList from './utils/handleRevokedTokens';
const PORT: string = process.env.PORT;

app.listen(PORT, () => {
	console.clear();
	console.log(colors.yellow('[server.ts] ') + colors.cyan('Starting the server...'));

	// Connect to the databases
	connectToDatabases()
		.then(() => {
			console.log(
				colors.yellow('[server.ts] ') +
					colors.cyan('Server is running on port: ') +
					colors.yellow(PORT),
			);

			// Every 1 hour, reset Redis Cache and update the list of white listed tokens
			setInterval(() => {
				updateTokenWhiteList();
			}, 1000 * 60 * 60);
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
