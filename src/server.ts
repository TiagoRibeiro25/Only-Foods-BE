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
import connectToDatabases from './services/connectToDatabases';
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
