import { Router } from 'express';
import { AsyncRouter } from 'types';
import CommentsController from '../controllers/comments/index.comments.controller';
import CommentsMiddleware from '../middlewares/comments/index.comments.middleware';

const router: AsyncRouter = Router();

// Get Comments
router.get('/:id/:type', CommentsMiddleware.getComments, CommentsController.getComments);

export default router;
