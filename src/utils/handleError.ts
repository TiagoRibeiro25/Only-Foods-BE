import { Response } from 'express';
import ERRORS from '../data/errors.json';
import handleResponse from './handleResponse';

interface Props {
	res: Response;
	error: Error;
}

const handleError = (props: Props): void => {
	// Find the error
	const errorFound = ERRORS.find(err => err.message === props.error.message);

	// Send the response (if the error is not found, then send 500)
	handleResponse({
		res: props.res,
		status: 'error',
		statusCode: errorFound ? errorFound.status : 500,
		message: errorFound ? errorFound.message : 'Something went wrong!',
	});
};

export default handleError;
