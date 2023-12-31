import { Router } from 'express';
import LikesController from '../controllers/likes/index.likes.controller';
import AuthMiddleware from '../middlewares/auth/index.auth.middleware';
import LikesMiddleware from '../middlewares/likes/index.likes.middleware';
import { AsyncRouter } from '../types';

const router: AsyncRouter = Router();

// Like/Unlike a Thought or Recipe
router.patch(
	'/:id/:type',
	AuthMiddleware.verifyToken,
	AuthMiddleware.handleToken,
	AuthMiddleware.verifyIfBlocked,
	LikesMiddleware.handleLike,
	LikesController.handleLike,
);

export default router;
