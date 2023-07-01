import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import handleResponse from './utils/handleResponse';

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '15mb' }));

if (process.env.ENABLE_LOGGING === 'true') {
	app.use(require('morgan')('dev'));
}

app.use('/api', require('./routes/index.routes'));

app.use((_req: Request, res: Response) => {
	handleResponse({ res, status: 'error', statusCode: 404, message: 'Not Found' });
});

export default app;
