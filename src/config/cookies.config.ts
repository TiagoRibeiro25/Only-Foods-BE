import { CookieOptions } from 'express';

export function getCookiesOptions(rememberMe = false): CookieOptions {
	return {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: process.env.NODE_ENV === 'lax',
		maxAge: parseInt(
			rememberMe ? process.env.JWT_EXPIRES_IN_REMEMBER_ME : process.env.JWT_EXPIRES_IN,
		),
		domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : undefined,
	};
}

export function getDeleteCookiesOptions(): CookieOptions {
	return {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: process.env.NODE_ENV === 'lax',
		domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : undefined,
	};
}
