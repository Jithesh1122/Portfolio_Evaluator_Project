import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

const allowedOrigins = [
  ...new Set(
    [
      ...(process.env.CLIENT_URL || '').split(','),
      ...(process.env.NODE_ENV !== 'production'
        ? ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:4173']
        : []),
    ]
      .map((origin) => origin.trim())
      .filter(Boolean)
  ),
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS origin not allowed'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthRoutes);
app.use('/api', profileRoutes);

app.use(errorHandler);

export default app;
