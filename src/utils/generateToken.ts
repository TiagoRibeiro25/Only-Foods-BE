import jwt from 'jsonwebtoken';

interface GenerateResetPasswordTokenProps {
	id: string;
}

interface GenerateAuthTokenProps extends GenerateResetPasswordTokenProps {
	email: string;
	username: string;
	rememberMe: boolean;
}

const resetPasswordToken = (props: GenerateResetPasswordTokenProps): string => {
	const token = jwt.sign({ uniqueNumber: Date.now(), ...props }, process.env.JWT_SECRET);
	return token;
};

const authToken = (props: GenerateAuthTokenProps): string => {
	const expiresIn = props.rememberMe
		? process.env.JWT_EXPIRES_IN_REMEMBER_ME
		: process.env.JWT_EXPIRES_IN;

	const token = jwt.sign(props, process.env.JWT_SECRET, { expiresIn });
	return token;
};

export default { resetPasswordToken, authToken };
