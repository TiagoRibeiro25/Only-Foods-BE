import base64url from 'base64url';
import jwt from 'jsonwebtoken';
import jwtConfig from '../../src/config/jwt.config';
import generateToken from '../../src/utils/generateToken';

jest.mock('jsonwebtoken');

describe('resetPasswordToken', () => {
	it('should generate a reset password token', () => {
		const props = { id: 123 };
		const mockedToken = 'mockedTokenValue';
		(jwt.sign as jest.Mock).mockReturnValueOnce(mockedToken);

		const result = generateToken.resetPasswordToken(props);

		// Encode the expected token using base64url.encode
		const expectedToken = base64url.encode(mockedToken);

		expect(result).toBe(expectedToken);
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
			isBlocked: false,
		};
		const mockedToken = 'mockedTokenValue';
		(jwt.sign as jest.Mock).mockReturnValueOnce(mockedToken);

		const result = generateToken.authToken(props);

		expect(result).toBe(mockedToken);
		expect(jwt.sign).toHaveBeenCalledWith(props, process.env.JWT_SECRET, {
			expiresIn: jwtConfig.expiresIn,
		});
	});

	it('should generate an authentication token with remember me', () => {
		const props = {
			id: 123,
			rememberMe: true,
			isAdmin: false,
			isBlocked: false,
		};
		const mockedToken = 'mockedTokenValue';
		(jwt.sign as jest.Mock).mockReturnValueOnce(mockedToken);

		const result = generateToken.authToken(props);

		expect(result).toBe(mockedToken);
		expect(jwt.sign).toHaveBeenCalledWith(props, process.env.JWT_SECRET, {
			expiresIn: jwtConfig.expiresInRememberMe,
		});
	});
});
