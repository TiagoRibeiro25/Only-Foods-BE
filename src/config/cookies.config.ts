import { CookieOptions } from 'express';
import jwtConfig from './jwt.config';

// const cookieOptions: CookieOptions = {
// 	httpOnly: true,
// 	secure: process.env.NODE_ENV === 'production',
// 	sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
// 	domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : undefined,
// };

const cookieOptions: CookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
	path: '/',
};

export function getCookiesOptions(rememberMe = false): CookieOptions {
	return {
		...cookieOptions,
		maxAge: rememberMe ? jwtConfig.expiresInRememberMe : jwtConfig.expiresIn,
	};
}

export function getDeleteCookiesOptions(): CookieOptions {
	return {
		...cookieOptions,
		maxAge: 0,
	};
}

