import { Router } from 'express';
import { AsyncRouter } from 'types';
import RecipesController from '../controllers/recipes/index.recipes.controller';
import AuthMiddleware from '../middlewares/auth/index.auth.middleware';
import RecipesMiddleware from '../middlewares/recipes/index.recipes.middleware';

const router: AsyncRouter = Router();

// Add a Recipe
router.post(
	'/',
	AuthMiddleware.verifyToken,
	AuthMiddleware.handleToken,
	AuthMiddleware.verifyIfBlocked,
	RecipesMiddleware.addRecipe,
	RecipesController.addRecipe,
);

export default router;
