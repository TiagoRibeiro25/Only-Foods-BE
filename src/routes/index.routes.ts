import express, { Request, Response } from 'express';
import handleResponse from '../utils/handleResponse';
const router = express.Router();

router.route('/').get((_req: Request, res: Response) => {
	handleResponse({ res, status: 'success', statusCode: 200, message: 'Hello World!' });
});

module.exports = router;
