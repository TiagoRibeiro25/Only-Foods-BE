import { CookieOptions } from 'express';

const cookieOptions: CookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
	domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : undefined,
};

export function getCookiesOptions(rememberMe = false): CookieOptions {
	return {
		...cookieOptions,
		maxAge: parseInt(
			rememberMe ? process.env.JWT_EXPIRES_IN_REMEMBER_ME : process.env.JWT_EXPIRES_IN,
		),
	};
}

export function getDeleteCookiesOptions(): CookieOptions {
	return cookieOptions;
}
