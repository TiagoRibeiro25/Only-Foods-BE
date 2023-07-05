import followUser from './followUser.middleware';
import forgotPassword from './forgotPassword.middleware';
import verifyLogin from './login.middleware';
import verifyRegister from './register.middleware';
import resetPassword from './resetPassword.middleware';

export default { verifyLogin, verifyRegister, forgotPassword, resetPassword, followUser };
