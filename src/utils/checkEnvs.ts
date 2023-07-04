import colors from 'colors';
import VALID_ENVS from '../data/envs.json';

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
