import ThoughtsControllers from 'controllers/thoughts/index.thoughts.controllers';
import { Router } from 'express';
import AuthMiddlewares from 'middlewares/auth/index.auth.middleware';
import ThoughtsMiddleware from 'middlewares/thoughts/index.thoughts.middleware';
import { AsyncRouter } from 'types';

const router: AsyncRouter = Router();

// Get Thoughts
router.get(
	'/',
	AuthMiddlewares.handleToken,
	ThoughtsMiddleware.getThoughts,
	ThoughtsControllers.getThoughts,
);

export default router;
