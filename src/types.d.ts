import { Request as ExpressRequest } from 'express';

interface DecodedToken {
	id: string;
	email: string;
	username: string;
	rememberMe: boolean;
	iat: number; // Issued at
	exp: number; // Expires
}

interface Request extends ExpressRequest {
	tokenData?: DecodedToken;
}
