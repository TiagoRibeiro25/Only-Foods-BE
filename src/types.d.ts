import { Request as ExpressRequest, NextFunction, Response, Router } from 'express';

export type ImgMimeType = 'png' | 'jpg' | 'jpeg' | 'bmp' | 'webp';
export type Base64Img = `data:image/${ImgMimeType};base64${string}`;

export type FollowType = 'followers' | 'following';

export interface DecodedToken {
	id: number;
	rememberMe: boolean;
	isAdmin: boolean;
	isBlocked: boolean;
	iat: number; // Issued at
	exp: number; // Expires
}

export interface Request extends ExpressRequest {
	tokenData?: DecodedToken;
}

export interface AsyncRouter extends Router {
	get(
		path: string,
		...handlers: Array<(req: Request, res: Response, next: NextFunction) => void>
	): this;
	get(
		path: string,
		...handlers: Array<(req: Request, res: Response, next: NextFunction) => Promise<void>>
	): this;

	post(
		path: string,
		...handlers: Array<(req: Request, res: Response, next: NextFunction) => void>
	): this;
	post(
		path: string,
		...handlers: Array<(req: Request, res: Response, next: NextFunction) => Promise<void>>
	): this;

	put(
		path: string,
		...handlers: Array<(req: Request, res: Response, next: NextFunction) => void>
	): this;
	put(
		path: string,
		...handlers: Array<(req: Request, res: Response, next: NextFunction) => Promise<void>>
	): this;

	delete(
		path: string,
		...handlers: Array<(req: Request, res: Response, next: NextFunction) => void>
	): this;
	delete(
		path: string,
		...handlers: Array<(req: Request, res: Response, next: NextFunction) => Promise<void>>
	): this;

	patch(
		path: string,
		...handlers: Array<(req: Request, res: Response, next: NextFunction) => void>
	): this;
	patch(
		path: string,
		...handlers: Array<(req: Request, res: Response, next: NextFunction) => Promise<void>>
	): this;
}
