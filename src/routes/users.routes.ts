import { Router } from 'express';
import { AsyncRouter } from 'types';
import UsersController from '../controllers/users/index';
import AuthMiddlewares from '../middlewares/auth/index';
import UsersMiddlewares from '../middlewares/users/index';

const router: AsyncRouter = Router();

router.route('/login').post(UsersMiddlewares.verifyLogin, UsersController.login);

router.route('/').post(UsersMiddlewares.verifyRegister, UsersController.register);

router.get('/:id', AuthMiddlewares.verifyToken, UsersController.getUser);

export default router;
