import colors from 'colors';

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

if (!require('./utils/checkEnvs')()) {
	process.exit(1);
}

import app from './app';
import prisma from './config/db.config';
const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.clear();
	console.log(colors.cyan('Starting the server...'));

	// connect to the database
	prisma
		.$connect()
		.then(() => {
			console.log(colors.cyan('Connected to the database'));
			console.log(colors.cyan('Server is running on port ' + colors.green(PORT)));
		})
		.catch(error => {
			console.log(colors.red('Failed to connect to the database'));
			console.log(colors.red('Error: ') + colors.yellow(error));
		});
});
