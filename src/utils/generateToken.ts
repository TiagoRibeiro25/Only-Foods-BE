import base64url from 'base64url';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.config';

interface GenerateResetPasswordTokenProps {
	id: number;
}

interface GenerateAuthTokenProps extends GenerateResetPasswordTokenProps {
	rememberMe: boolean;
	isAdmin: boolean;
	isBlocked: boolean;
}

/**
 * Generate a token to reset the password
 * @param props - The data to generate the token
 * @returns The generated token
 */
const resetPasswordToken = (props: GenerateResetPasswordTokenProps): string => {
	const token = jwt.sign({ uniqueNumber: Date.now(), ...props }, process.env.JWT_SECRET);
	return base64url.encode(token);
};

/**
 * Generate a token to authenticate the user
 * @param props - The data to generate the token
 * @returns The generated token
 */
const authToken = (props: GenerateAuthTokenProps): string => {
	const expiresIn = props.rememberMe
		? jwtConfig.expiresInRememberMe
		: jwtConfig.expiresIn;

	const token = jwt.sign(props, process.env.JWT_SECRET, { expiresIn });
	return token;
};

export default { resetPasswordToken, authToken };
