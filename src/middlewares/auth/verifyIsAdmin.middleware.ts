import { NextFunction, Response } from 'express';
import { Request } from 'types';

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	// Get logged user id
	const userId = req.tokenData.id;

	// try {
	// } catch (error) {}
};
