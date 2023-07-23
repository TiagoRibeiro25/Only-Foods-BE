import { Request, Response, Router } from 'express';
import { AsyncRouter } from 'types';
import AuthMiddleware from '../middlewares/auth/index.auth.middleware';
import handleResponse from '../utils/handleResponse';
import commentsRoutes from './comments.routes';
import likesRoutes from './likes.routes';
import recipesRoutes from './recipes.routes';
import thoughtsRoutes from './thoughts.routes';
import usersRoutes from './users.routes';

const router: AsyncRouter = Router();

router.route('/').get((_req: Request, res: Response) => {
	handleResponse({ res, status: 'success', statusCode: 200, message: 'Hello World!' });
});

router.use('/users', usersRoutes);
router.use('/thoughts', thoughtsRoutes);
router.use('/comments', commentsRoutes);
router.use('/likes', likesRoutes);
router.use('/recipes', recipesRoutes);

router.put('/update-token-white-list', AuthMiddleware.updateTokenWhiteList);

router.use((_req: Request, res: Response) => {
	handleResponse({ res, status: 'error', statusCode: 404, message: 'Not Found' });
});

export default router;
