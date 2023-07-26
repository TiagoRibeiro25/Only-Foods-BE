import { Response } from 'express';
import { Request } from '../../types';
import handleError from '../../utils/handleError';
import handleResponse from '../../utils/handleResponse';

export default (req: Request, res: Response): void => {
	try {
		// Delete the cookie authorization (req.cookies['authorization'])
		res.clearCookie('authorization');

		// Send the response
		handleResponse({
			res,
			status: 'success',
			statusCode: 200,
			message: 'User logged out successfully',
		});
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
