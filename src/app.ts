import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import compressionConfig from './config/compression.config';
import corsConfig from './config/cors.config';
import rateLimiter from './config/rateLimit.config';
import routes from './routes/index.routes';

const app: Application = express(); // Create Express Application

app.use(cors(corsConfig)); // Enable CORS
app.use(helmet()); // Enable Helmet
app.use(cookieParser()); // Enable Cookie Parser
app.use(rateLimiter); // Enable Rate Limiter
app.use(compression(compressionConfig)); // Enable Compression
app.use(express.json({ limit: '15mb' })); // Enable JSON Parser with 15mb limit

if (process.env.NODE_ENV !== 'production' && process.env.ENABLE_LOGGING === 'true') {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	app.use(require('morgan')('dev'));
}

app.use('/api/v1', routes); // Enable Routes

export default app;
