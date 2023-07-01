import { Request, Response, Router } from 'express';
import handleResponse from '../utils/handleResponse';
import usersRoutes from './users.routes';
const router = Router();

router.route('/').get((_req: Request, res: Response) => {
	handleResponse({ res, status: 'success', statusCode: 200, message: 'Hello World!' });
});

router.use('/users', usersRoutes);

export default router;
