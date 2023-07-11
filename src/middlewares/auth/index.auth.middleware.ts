import handleToken from './handleToken.middleware';
import verifyIsAdmin from './verifyIsAdmin.middleware';
import verifyToken from './verifyToken.middleware';

export default { handleToken, verifyToken, verifyIsAdmin };
