import { NextFunction, Response } from 'express';
import { Request } from '../../types';
import handleError from '../../utils/handleError';
import validateData from '../../utils/validateData';

export default (req: Request, res: Response, next: NextFunction): void => {
	const comment: string = req.body.comment;

	try {
		// Check if the comment content is valid
		if (!comment || !validateData.commentContent(comment)) {
			throw new Error('Invalid content');
		}

		// Call the next middleware
		next();
	} catch (error) {
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
