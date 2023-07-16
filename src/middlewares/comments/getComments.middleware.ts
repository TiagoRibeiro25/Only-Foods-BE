import { NextFunction, Response } from 'express';
import { Request } from 'types';
import handleError from '../../utils/handleError';
import validateData from '../../utils/validateData';

interface QueryParams {
	id: string;
	type: 'thought' | 'recipe';
}

const VALID_TYPES = ['thought', 'recipe'];

export default (req: Request, res: Response, next: NextFunction): void => {
	const { id, type } = req.params as unknown as QueryParams;

	try {
		// Check if the id is valid
		if (!id || !validateData.id(id)) {
			throw new Error('Invalid id');
		}

		// Check if the type is valid
		if (!type || !VALID_TYPES.includes(type)) {
			throw new Error('Invalid type');
		}

		// Call the next middleware
		next();
	} catch (error) {
		const fileName =
			process.env.NODE_ENV !== 'production' ? __filename.split('\\').at(-1) : '';
		handleError({ res, error, fileName });
	}
};
