import colors from 'colors';
const VALID_ENVS = [
	'NODE_ENV',
	'PORT',
	'ENABLE_LOGGING',
	'JWT_SECRET',
	'JWT_EXPIRES_IN',
	'JWT_GENERATE_TOKEN_IN',
];

/**
 * Check if all the required environment variables are set
 * @returns {boolean} true if all the required environment variables are set, false otherwise
 */
const checkEnvs = (): boolean => {
	const missingEnvs = VALID_ENVS.filter(env => !process.env[env]);
	if (missingEnvs.length) {
		console.log(
			colors.red('\nMissing environment variables: ') +
				colors.yellow(missingEnvs.join(', ')),
		);
		return false;
	}
	return true;
};

export default checkEnvs;
