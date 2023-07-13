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
import prisma from './config/db.config';
const PORT: string = process.env.PORT;

app.listen(PORT, () => {
	console.clear();
	console.log(colors.yellow('[server.ts] ') + colors.cyan('Starting the server...'));

	// Connect to the database
	prisma
		.$connect()
		.then(() => {
			console.log(
				colors.yellow('[server.ts] ') + colors.cyan('Connected to the database'),
			);
			console.log(
				colors.yellow('[server.ts] ') +
					colors.cyan('Server is running on port ' + colors.green(PORT)),
			);
		})
		.catch(error => {
			console.log(
				colors.yellow('[server.ts] ') + colors.red('Failed to connect to the database'),
			);
			console.log(
				colors.yellow('[server.ts] ') + colors.red('Error: ') + colors.yellow(error),
			);
		});
});
