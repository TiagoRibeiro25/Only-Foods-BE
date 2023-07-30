import colors from 'colors';
import checkEnvs from '../../src/utils/checkEnvs';

describe('checkEnvs', () => {
	const originalEnv = { ...process.env };
	const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

	afterEach(() => {
		process.env = { ...originalEnv };
		mockConsoleLog.mockClear();
	});

	it('should return true when all required environment variables are set', () => {
		process.env = {
			NODE_ENV: 'development',
			PORT: '3000',
			ENABLE_LOGGING: 'true',
			JWT_SECRET: 'secret',
			JWT_EXPIRES_IN: '3600',
			JWT_EXPIRES_IN_REMEMBER_ME: '86400',
			JWT_GENERATE_TOKEN_IN: '1800',
			MAILJET_URL: 'https://api.mailjet.com/v3',
			MAILJET_PUBLIC_KEY: 'public-key',
			MAILJET_SECRET_KEY: 'secret-key',
			MAILJET_FROM_EMAIL: 'noreply@example.com',
			CLOUDINARY_CLOUD_NAME: 'cloud-name',
			CLOUDINARY_API_KEY: 'api-key',
			CLOUDINARY_API_SECRET: 'api-secret',
			DATABASE_URL: 'postgresql://localhost:5432/my_db',
			MONGO_DB_URL: 'mongodb://localhost:27017/',
			MONGO_DB_NAME: 'my_db',
			REDIS_URL: 'redis://localhost:6379',
			FRONTEND_URL: 'http://localhost:3000',
			DOMAIN: 'localhost',
		};

		const result = checkEnvs();

		expect(result).toBe(true);
		expect(mockConsoleLog).not.toHaveBeenCalled();
	});

	it('should return false and log missing environment variables when some are not set', () => {
		process.env = {
			NODE_ENV: 'development',
			PORT: '3000',
			ENABLE_LOGGING: 'true',
			JWT_SECRET: 'secret',
			JWT_EXPIRES_IN: '3600',
			JWT_EXPIRES_IN_REMEMBER_ME: '86400',
			JWT_GENERATE_TOKEN_IN: '1800',
			MAILJET_URL: 'https://api.mailjet.com/v3',
			MAILJET_PUBLIC_KEY: 'public-key',
			MAILJET_SECRET_KEY: 'secret-key',
			MAILJET_FROM_EMAIL: 'noreply@example.com',
			DATABASE_URL: 'mongodb://localhost:27017/my_db',
			MONGO_DB_URL: 'mongodb://localhost:27017/',
			MONGO_DB_NAME: 'my_db',
			REDIS_URL: 'redis://localhost:6379',
			FRONTEND_URL: 'http://localhost:3000',
			DOMAIN: 'localhost',
		};

		const result = checkEnvs();

		expect(result).toBe(false);
		expect(mockConsoleLog).toHaveBeenCalledTimes(1);
		expect(mockConsoleLog).toHaveBeenCalledWith(
			colors.yellow('\n[checkEnvs.ts] ') +
				colors.red('Missing environment variables: ') +
				colors.yellow('CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET'),
		);
	});
});
