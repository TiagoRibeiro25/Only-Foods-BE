import blockUser from './blockUser.middleware';
import editProfile from './editProfile.middleware';
import followUser from './followUser.middleware';
import forgotPassword from './forgotPassword.middleware';
import getFollowers from './getFollowers.middleware';
import getUser from './getUser.middleware';
import verifyLogin from './login.middleware';
import verifyRegister from './register.middleware';
import resetPassword from './resetPassword.middleware';
import searchUsers from './searchUsers.middleware';

export default {
	verifyLogin,
	verifyRegister,
	forgotPassword,
	resetPassword,
	followUser,
	editProfile,
	getFollowers,
	blockUser,
	getUser,
	searchUsers,
};
