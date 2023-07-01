import jwt from 'jsonwebtoken';

interface Props {
	id: string;
	email: string;
	username: string;
}

const generateToken = (props: Props): string => {
	const token = jwt.sign(props, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

	return token;
};

export default generateToken;
