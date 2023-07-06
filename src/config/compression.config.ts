import compression from 'compression';
import { Response } from 'express';
import { Request } from 'types';

const shouldCompress = (req: Request, res: Response) => {
	// don't compress responses with this request header
	if (req.headers['x-no-compression']) {
		return false;
	}

	// fallback to standard filter function
	return compression.filter(req, res);
};

export default shouldCompress;
