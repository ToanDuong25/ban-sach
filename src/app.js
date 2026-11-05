import express from 'express';
import { createDatabase } from './database.js';
import { authRoutes } from './routes/auth.js';
import { productRoutes } from './routes/products.js';
import { fileRoutes } from './routes/files.js';
import { orderRoutes } from './routes/orders.js';

export function createApp({ jwtSecret, demoPassword }) {
  if (typeof jwtSecret !== 'string' || Buffer.byteLength(jwtSecret) < 32) {
    throw new Error('JWT_SECRET must contain at least 32 bytes');
  }
  if (typeof demoPassword !== 'string' || demoPassword.length < 12) {
    throw new Error('DEMO_PASSWORD must contain at least 12 characters');
  }
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '8kb' }));
  const store = createDatabase(demoPassword);
  app.use('/api/auth', authRoutes({ ...store, jwtSecret }));
  app.use(productRoutes());
  app.use('/api/files', fileRoutes());
  app.use('/api/orders', orderRoutes({ ...store, jwtSecret }));
  app.get('/health', (_req, res) => res.json({ status: 'ok', fixture: 'ban-sach' }));
  app.use((_error, _req, res, _next) => res.status(500).json({ error: 'Request failed' }));
  return app;
}
