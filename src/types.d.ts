import { Request as ExpressRequest, NextFunction, Response, Router } from 'express';

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

interface AsyncRouter extends Router {
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
