import handleToken from './handleToken.middleware';
import updateTokenWhiteList from './updateTokenWhiteList.middleware';
import verifyIfBlocked from './verifyIfBlocked.middleware';
import verifyIsAdmin from './verifyIsAdmin.middleware';
import verifyToken from './verifyToken.middleware';

export default {
	handleToken,
	verifyToken,
	verifyIsAdmin,
	verifyIfBlocked,
	updateTokenWhiteList,
};
