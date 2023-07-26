import { CookieOptions } from 'express';

function getCookiesOptions(rememberMe = false): CookieOptions {
	return {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
		maxAge: parseInt(
			rememberMe ? process.env.JWT_EXPIRES_IN_REMEMBER_ME : process.env.JWT_EXPIRES_IN,
		),
	};
}

export default getCookiesOptions;
