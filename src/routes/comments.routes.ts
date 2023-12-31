import { Router } from 'express';
import CommentsController from '../controllers/comments/index.comments.controller';
import AuthMiddleware from '../middlewares/auth/index.auth.middleware';
import CommentsMiddleware from '../middlewares/comments/index.comments.middleware';
import { AsyncRouter } from '../types';

const router: AsyncRouter = Router();

// Get Comments
router.get(
	'/:id/:type',
	CommentsMiddleware.verifyRequest,
	CommentsController.getComments,
);

// Add Comment
router.post(
	'/:id/:type',
	AuthMiddleware.verifyToken,
	AuthMiddleware.handleToken,
	AuthMiddleware.verifyIfBlocked,
	CommentsMiddleware.verifyRequest,
	CommentsMiddleware.addComment,
	CommentsController.addComment,
);

export default router;
