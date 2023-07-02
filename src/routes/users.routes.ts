import { Router } from 'express';
import { AsyncRouter } from 'types';
import UsersController from '../controllers/users/index.users.controllers';
import AuthMiddlewares from '../middlewares/auth/index.auth.middleware';
import UsersMiddlewares from '../middlewares/users/index.users.middleware';

const router: AsyncRouter = Router();

router.route('/login').post(UsersMiddlewares.verifyLogin, UsersController.login);

router.route('/').post(UsersMiddlewares.verifyRegister, UsersController.register);

router.get('/:id', AuthMiddlewares.verifyToken, UsersController.getUser);

export default router;
