import colors from 'colors';
import { Response } from 'express';
import ERRORS from '../data/errors.json';
import handleResponse from './handleResponse';

interface Props {
	res: Response;
	error: Error;
	fileName: string; // The file name where the error occurred (for debugging)
}

interface ApiError {
	message: string;
	status: number;
}

/**
 * Handle an error and send the response
 * @param props - The response and the error
 * @returns {void}
 */
const handleError = (props: Props): void => {
	// Find the error
	const errorFound: ApiError = ERRORS.find(err => err.message === props.error.message);

	// Send the response (if the error is not found, then send 500)
	handleResponse({
		res: props.res,
		status: 'error',
		statusCode: errorFound ? errorFound.status : 500,
		message: errorFound ? errorFound.message : 'Something went wrong!',
	});

	// If the status is a 500, then log the error
	if (!errorFound) {
		console.log(
			colors.yellow(`[${props.fileName}] `) +
				colors.red('Error: ') +
				colors.yellow(props.error.name),
		);
		console.log(
			colors.yellow(`[${props.fileName}] `) +
				colors.red('Message: ') +
				colors.yellow(props.error.message),
		);
	}
};

export default handleError;
