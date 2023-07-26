import { NextFunction, Response } from 'express';
import { Request } from '../../types';
import handleError from '../../utils/handleError';
import validateData from '../../utils/validateData';

type Filter = 'recent' | 'popular' | 'following';

const VALID_FILTERS: Filter[] = ['recent', 'popular', 'following'];

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const filter = req.query.filter as Filter;
	const authorId = req.query.authorId as string;
	const page = req.query.page as string;
	const limit = req.query.limit as string;

	try {
		// If there's an authorId, check if it's a valid id
		if (authorId && !validateData.id(authorId)) {
			throw new Error('Invalid id');
		}

		// Check if the page and limit are valid numbers
		if (!validateData.pagination({ page, limit })) {
			throw new Error('Invalid query value');
		}

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
		handleError({ res, error, fileName: __filename.split('\\').at(-1) });
	}
};
