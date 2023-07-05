import { Request, Response, Router } from 'express';
import handleResponse from '../utils/handleResponse';
import usersRoutes from './users.routes';
const router = Router();

router.route('/').get((_req: Request, res: Response) => {
	handleResponse({ res, status: 'success', statusCode: 200, message: 'Hello World!' });
});

router.use('/users', usersRoutes);

router.use((_req: Request, res: Response) => {
	handleResponse({ res, status: 'error', statusCode: 404, message: 'Not Found' });
});

export default router;
