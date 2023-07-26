import compression, { CompressionOptions } from 'compression';
import { Response } from 'express';
import { Request } from '../types';

const shouldCompress = (req: Request, res: Response): boolean => {
	// don't compress responses with this request header
	if (req.headers['x-no-compression']) {
		return false;
	}

	// fallback to standard filter function
	return compression.filter(req, res);
};

const compressionConfig: CompressionOptions = {
	filter: shouldCompress,
	level: 9,
	memLevel: 8,
	chunkSize: 16 * 1024,
	strategy: 0,
	threshold: 0,
	flush: 2,
	windowBits: 15,
};

export default compressionConfig;
