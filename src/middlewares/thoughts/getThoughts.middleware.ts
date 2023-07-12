import { NextFunction, Response } from 'express';
import { Request } from 'types';
import handleError from '../../utils/handleError';

type Filter = 'recent' | 'popular' | 'following';

const VALID_FILTERS: Filter[] = ['recent', 'popular', 'following'];

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const filter = req.query.filter as Filter;

	try {
		// If the filter is not valid, set it to 'recent' (default)
		if (!filter || !VALID_FILTERS.includes(filter)) {
			req.query.filter = 'recent';
		}

		// If the filter is following, check if the user is authenticated
		if (filter === 'following' && !req.tokenData) {
			throw new Error('No token provided');
		}

		// Call the next middleware
		next();
	} catch (error) {
		handleError({ error, res, fileName: __filename.split('\\').at(-1) });
	}
};
