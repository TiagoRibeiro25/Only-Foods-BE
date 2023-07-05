import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import handleResponse from './utils/handleResponse';

const app: Application = express();
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '15mb' }));

if (process.env.NODE_ENV !== 'production' && process.env.ENABLE_LOGGING === 'true') {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	app.use(require('morgan')('dev'));
}

import routes from './routes/index.routes';

app.use('/api', routes); // Enable Routes

export default app;
