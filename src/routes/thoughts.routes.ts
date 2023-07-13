import { Router } from 'express';
import { AsyncRouter } from 'types';
import ThoughtsControllers from '../controllers/thoughts/index.thoughts.controllers';
import AuthMiddlewares from '../middlewares/auth/index.auth.middleware';
import ThoughtsMiddleware from '../middlewares/thoughts/index.thoughts.middleware';

const router: AsyncRouter = Router();

// Get Thoughts
//TODO: filter by authorId
router.get(
	'/',
	AuthMiddlewares.handleToken,
	ThoughtsMiddleware.getThoughts,
	ThoughtsControllers.getThoughts,
);

// Add Thought
router.post(
	'/',
	AuthMiddlewares.verifyToken,
	AuthMiddlewares.handleToken,
	ThoughtsMiddleware.addThought,
	ThoughtsControllers.addThought,
);

export default router;
