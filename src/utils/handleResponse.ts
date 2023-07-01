import colors from 'colors';
import { Response } from 'express';

interface Props {
	res: Response;
	status: 'success' | 'error';
	statusCode: number;
	message: string;
	data?: any;
	error?: any;
}

const handleResponse = (props: Props): void => {
	const { res, status, statusCode, message, data, error } = props;

	res.status(statusCode).json({
		success: status === 'success',
		message,
		...(data && { data }), // if the data is undefined, then don't send it
	});

	// if the status is a 500, then log the error
	if (statusCode === 500) {
		console.log(colors.red('Error: ') + colors.yellow(error));
	}
};

export default handleResponse;
