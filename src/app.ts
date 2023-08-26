import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import compressionConfig from './config/compression.config';
import corsConfig from './config/cors.config';
import rateLimiter from './config/rateLimit.config';
import { corsMiddleware } from './middlewares/cors/cors.middleware';
import routes from './routes/index.routes';

const app: Application = express(); // Create Express Application

app.use(cors()); // Enable CORS
app.use(helmet()); // Enable Helmet
app.use(cookieParser()); // Enable Cookie Parser
app.use(rateLimiter); // Enable Rate Limiter
app.use(compression(compressionConfig)); // Enable Compression
app.use(express.json({ limit: '15mb' })); // Enable JSON Parser with 15mb limit

if (process.env.NODE_ENV !== 'production') {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	app.use(require('morgan')('dev'));
}

// Enable CORS Configuration Middleware
app.use(corsMiddleware(corsConfig));

app.use('/api/v1', routes); // Enable Routes

export default app;
