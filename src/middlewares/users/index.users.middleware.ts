import blockUser from './blockUser.middleware';
import editProfile from './editProfile.middleware';
import followUser from './followUser.middleware';
import forgotPassword from './forgotPassword.middleware';
import getFollowers from './getFollowers.middleware';
import verifyLogin from './login.middleware';
import verifyRegister from './register.middleware';
import resetPassword from './resetPassword.middleware';

export default {
	verifyLogin,
	verifyRegister,
	forgotPassword,
	resetPassword,
	followUser,
	editProfile,
	getFollowers,
	blockUser,
};
