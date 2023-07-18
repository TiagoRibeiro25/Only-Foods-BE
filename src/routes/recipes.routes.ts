import { Router } from 'express';
import { AsyncRouter } from 'types';
import RecipesController from '../controllers/recipes/index.recipes.controller';
import AuthMiddleware from '../middlewares/auth/index.auth.middleware';
import RecipesMiddleware from '../middlewares/recipes/index.recipes.middleware';

const router: AsyncRouter = Router();

// Get Recipes
router.get(
	'/',
	AuthMiddleware.handleToken,
	RecipesMiddleware.getRecipes,
	RecipesController.getRecipes,
);

// Get a Recipe
router.get(
	'/:id',
	AuthMiddleware.handleToken,
	RecipesMiddleware.getRecipe,
	RecipesController.getRecipe,
);

// Add a Recipe
router.post(
	'/',
	AuthMiddleware.verifyToken,
	AuthMiddleware.handleToken,
	AuthMiddleware.verifyIfBlocked,
	RecipesMiddleware.addRecipe,
	RecipesController.addRecipe,
);

// Delete a Recipe
router.delete(
	'/:id',
	AuthMiddleware.verifyToken,
	AuthMiddleware.handleToken,
	RecipesMiddleware.deleteRecipe,
	RecipesController.deleteRecipe,
);

export default router;
