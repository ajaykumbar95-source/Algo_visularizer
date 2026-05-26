import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { pinoHttp } from 'pino-http';
import traceRoutes from './routes/traceRoutes.js';
import authRoutes from './routes/authRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import logger from './utils/logger.js';
import { connectRedis } from './utils/redis.js';
import prisma from './db.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Connect Redis (Disabled for now as it causes hangs/errors in this environment)
// connectRedis().catch(err => logger.error({ err }, 'Failed to connect to Redis during startup'));

// Structured Logging
app.use(pinoHttp({ 
  logger,
  customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode} - ${res.getHeader('content-length')} bytes`,
  customErrorMessage: (req, res, err) => `${req.method} ${req.url} ${res.statusCode} - Error: ${err.message}`
}));

// Global Rate Limiting: 100 req/min per IP
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://0.0.0.0:5173'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', traceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);


// 6. Enhanced Health Endpoint
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'ok' });
  } catch (error) {
    logger.error({ error }, 'Health check failed');
    res.status(503).json({ status: 'error', db: 'down' });
  }
});

const HOST = '0.0.0.0';

app.listen(Number(PORT), HOST, () => {
  logger.info(`Server is running on http://${HOST}:${PORT}`);
});
