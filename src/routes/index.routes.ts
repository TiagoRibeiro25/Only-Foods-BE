import { Request, Response, Router } from 'express';
import handleResponse from '../utils/handleResponse';
import commentsRoutes from './comments.routes';
import thoughtsRoutes from './thoughts.routes';
import usersRoutes from './users.routes';
const router = Router();

router.route('/').get((_req: Request, res: Response) => {
	handleResponse({ res, status: 'success', statusCode: 200, message: 'Hello World!' });
});

router.use('/users', usersRoutes);
router.use('/thoughts', thoughtsRoutes);
router.use('/comments', commentsRoutes);

router.use((_req: Request, res: Response) => {
	handleResponse({ res, status: 'error', statusCode: 404, message: 'Not Found' });
});

export default router;
