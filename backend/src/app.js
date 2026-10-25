import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { isDbConnected } from '../db.js';

const app = express();

// CORS and preflight handling
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
}));
app.options('*', cors());

app.use(express.json());

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Smart Bus Booking API',
    status: 'online',
    documentation: 'All API routes are prefixed under /api',
    endpoints: {
      health: '/api/health',
      routes: '/api/routes',
      bookings: '/api/bookings',
      auth: '/api/auth/login',
      users: '/api/users (Protected: Admin token required)',
      finance: '/api/finance (Protected: Admin token required)',
    },
  });
});

// Health check endpoint
app.get(['/health', '/api/health'], (req, res) => {
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
