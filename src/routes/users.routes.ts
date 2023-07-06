import { Router } from 'express';
import { AsyncRouter } from 'types';
import UsersController from '../controllers/users/index.users.controllers';
import AuthMiddlewares from '../middlewares/auth/index.auth.middleware';
import UsersMiddlewares from '../middlewares/users/index.users.middleware';

const router: AsyncRouter = Router();

// Login
router.route('/login').post(UsersMiddlewares.verifyLogin, UsersController.login);

// Forgot password
router
	.route('/forgot-password')
	.post(UsersMiddlewares.forgotPassword, UsersController.forgotPassword);

// Reset password
router
	.route('/reset-password/:token')
	.patch(UsersMiddlewares.resetPassword, UsersController.resetPassword);

// Register
router.route('/').post(UsersMiddlewares.verifyRegister, UsersController.register);

// Get specific user by id
router.get('/:id', AuthMiddlewares.handleToken, UsersController.getUser);

// Follow / Unfollow someone
router.patch(
	'/:id/follow',
	AuthMiddlewares.verifyToken,
	AuthMiddlewares.handleToken,
	UsersMiddlewares.followUser,
	UsersController.followUser,
);

router.patch(
	'/',
	AuthMiddlewares.verifyToken,
	AuthMiddlewares.handleToken,
	UsersMiddlewares.editProfile,
	UsersController.editProfile,
);

export default router;
