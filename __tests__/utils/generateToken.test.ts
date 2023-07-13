import jwt from 'jsonwebtoken';
import generateToken from '../../src/utils/generateToken';

jest.mock('jsonwebtoken');

describe('resetPasswordToken', () => {
	it('should generate a reset password token', () => {
		const props = { id: 123 };
		const mockedToken = 'mockedTokenValue';
		(jwt.sign as jest.Mock).mockReturnValueOnce(mockedToken);

		const result = generateToken.resetPasswordToken(props);

		expect(result).toBe(mockedToken);
		expect(jwt.sign).toHaveBeenCalledWith(
			{ uniqueNumber: expect.any(Number), ...props },
			process.env.JWT_SECRET,
		);
	});
});

describe('authToken', () => {
	it('should generate an authentication token', () => {
		const props = {
			id: 123,
			rememberMe: false,
			isAdmin: false,
		};
		const expiresIn = 'mockedExpiresIn';
		const mockedToken = 'mockedTokenValue';
		(jwt.sign as jest.Mock).mockReturnValueOnce(mockedToken);
		process.env.JWT_EXPIRES_IN = expiresIn;

		const result = generateToken.authToken(props);

		expect(result).toBe(mockedToken);
		expect(jwt.sign).toHaveBeenCalledWith(props, process.env.JWT_SECRET, { expiresIn });
	});

	it('should generate an authentication token with remember me', () => {
		const props = {
			id: 123,
			rememberMe: true,
			isAdmin: false,
		};
		const expiresInRememberMe = 'mockedExpiresInRememberMe';
		const mockedToken = 'mockedTokenValue';
		(jwt.sign as jest.Mock).mockReturnValueOnce(mockedToken);
		process.env.JWT_EXPIRES_IN_REMEMBER_ME = expiresInRememberMe;

		const result = generateToken.authToken(props);

		expect(result).toBe(mockedToken);
		expect(jwt.sign).toHaveBeenCalledWith(props, process.env.JWT_SECRET, {
			expiresIn: expiresInRememberMe,
		});
	});
});
