import forgotPasswordMiddleware from './forgotPassword.middleware';
import verifyLogin from './login.middleware';
import verifyRegister from './register.middleware';

export default { verifyLogin, verifyRegister, forgotPasswordMiddleware };
