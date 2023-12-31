import { Router } from 'express';
import ThoughtsControllers from '../controllers/thoughts/index.thoughts.controllers';
import AuthMiddlewares from '../middlewares/auth/index.auth.middleware';
import ThoughtsMiddleware from '../middlewares/thoughts/index.thoughts.middleware';
import { AsyncRouter } from '../types';

const router: AsyncRouter = Router();

// Get Thoughts
router.get(
	'/',
	AuthMiddlewares.handleToken,
	ThoughtsMiddleware.getThoughts,
	ThoughtsControllers.getThoughts,
);

// Get Thought
router.get(
	'/:id',
	AuthMiddlewares.handleToken,
	ThoughtsMiddleware.getThought,
	ThoughtsControllers.getThought,
);

// Add Thought
router.post(
	'/',
	AuthMiddlewares.verifyToken,
	AuthMiddlewares.handleToken,
	AuthMiddlewares.verifyIfBlocked,
	ThoughtsMiddleware.addThought,
	ThoughtsControllers.addThought,
);

// Edit Thought
router.put(
	'/:id',
	AuthMiddlewares.verifyToken,
	AuthMiddlewares.handleToken,
	AuthMiddlewares.verifyIfBlocked,
	ThoughtsMiddleware.editThought,
	ThoughtsControllers.editThought,
);

// Delete Thought
router.delete(
	'/:id',
	AuthMiddlewares.verifyToken,
	AuthMiddlewares.handleToken,
	ThoughtsMiddleware.deleteThought,
	ThoughtsControllers.deleteThought,
);

export default router;
