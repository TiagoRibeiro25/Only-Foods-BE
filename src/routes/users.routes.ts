import { Router } from 'express';
import UsersController from '../controllers/users/index.users.controllers';
import AuthMiddlewares from '../middlewares/auth/index.auth.middleware';
import UsersMiddlewares from '../middlewares/users/index.users.middleware';
import { AsyncRouter } from '../types';

const router: AsyncRouter = Router();

// Login
router.post('/login', UsersMiddlewares.verifyLogin, UsersController.login);

// Logout
router.post('/logout', AuthMiddlewares.verifyToken, UsersController.logout);

// Forgot password
router.post(
	'/forgot-password',
	UsersMiddlewares.forgotPassword,
	UsersController.forgotPassword,
);

// Reset password
router.patch(
	'/reset-password/:token',
	UsersMiddlewares.resetPassword,
	UsersController.resetPassword,
);

// Register
router.post('/', UsersMiddlewares.verifyRegister, UsersController.register);

// Search users
router.get(
	'/search',
	AuthMiddlewares.handleToken,
	UsersMiddlewares.searchUsers,
	UsersController.searchUsers,
);

// Get followers/following
router.get(
	'/:id/followers',
	AuthMiddlewares.handleToken,
	UsersMiddlewares.getFollowers,
	UsersController.getFollowers,
);

// Get user by id
router.get(
	'/:id',
	AuthMiddlewares.handleToken,
	UsersMiddlewares.getUser,
	UsersController.getUser,
);

// Follow / Unfollow someone
router.patch(
	'/:id/follow',
	AuthMiddlewares.verifyToken,
	AuthMiddlewares.handleToken,
	UsersMiddlewares.followUser,
	UsersController.followUser,
);

// Block / Unblock User (Admin only)
router.patch(
	'/:id/block',
	AuthMiddlewares.verifyToken,
	AuthMiddlewares.handleToken,
	AuthMiddlewares.verifyIsAdmin,
	UsersMiddlewares.blockUser,
	UsersController.blockUser,
);

// Edit profile
router.patch(
	'/',
	AuthMiddlewares.verifyToken,
	AuthMiddlewares.handleToken,
	UsersMiddlewares.editProfile,
	UsersController.editProfile,
);

export default router;
