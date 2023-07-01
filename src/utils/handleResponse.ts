import { Response } from 'express';

interface Props {
	res: Response;
	status: 'success' | 'error';
	statusCode: number;
	message: string;
	data?: unknown;
}

const handleResponse = (props: Props): void => {
	const { res, status, statusCode, message, data } = props;

	res.status(statusCode).json({
		success: status === 'success',
		message,
		...(data && { data }), // if the data is undefined, then don't send it
	});
};

export default handleResponse;
