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

// Global error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('❌ Error:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
);

export { app };
