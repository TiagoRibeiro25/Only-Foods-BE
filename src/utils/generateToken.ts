import jwt from 'jsonwebtoken';

interface GenerateResetPasswordTokenProps {
	id: string;
	email: string;
}

interface GenerateAuthTokenProps extends GenerateResetPasswordTokenProps {
	username: string;
}

const resetPasswordToken = (props: GenerateResetPasswordTokenProps): string => {
	const token = jwt.sign(props, process.env.JWT_SECRET);
	return token;
};

const authToken = (props: GenerateAuthTokenProps): string => {
	const token = jwt.sign(props, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

	return token;
};

export default { resetPasswordToken, authToken };
