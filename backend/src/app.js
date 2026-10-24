import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { isDbConnected } from '../db.js';

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    orm: 'Prisma ORM',
    database: isDbConnected ? 'PostgreSQL Connected via Prisma' : 'Connecting...',
  });
});

// Mount modular API router
app.use('/api', apiRouter);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: `Not Found - Cannot ${req.method} ${req.originalUrl}` });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
});

export default app;
