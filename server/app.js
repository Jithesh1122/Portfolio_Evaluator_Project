import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthRoutes);
app.use('/api', profileRoutes);

app.use(errorHandler);

export default app;
