import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Initialize express app
const app: Application = express();

// Middleware setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// import routes
import userRoutes from './routes/user';
import codeRoutes from './routes/code';

// Use routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/codes', codeRoutes);

// Global error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('❌ Error:', err.message);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
);

export { app };
