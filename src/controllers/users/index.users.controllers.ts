import blockUser from './blockUser.controller';
import editProfile from './editProfile.controller';
import followUser from './followUser.controller';
import forgotPassword from './forgotPassword.controller';
import getFollowers from './getFollowers.controller';
import getUser from './getUser.controller';
import login from './login.controller';
import logout from './logout.controller';
import register from './register.controller';
import resetPassword from './resetPassword.controller';
import searchUsers from './searchUsers.controller';

export default {
	login,
	logout,
	register,
	getUser,
	forgotPassword,
	resetPassword,
	followUser,
	editProfile,
	searchUsers,
	getFollowers,
	blockUser,
};
