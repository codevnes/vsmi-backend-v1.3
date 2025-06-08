import express, { Request, Response, NextFunction } from 'express';
import routes from './routes';
import './config/env.config';
import { PrismaClient } from '@prisma/client';
import { AUTH_MESSAGES } from './utils';
import path from 'path';

// Initialize Express app
const app = express();
export const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files - Đơn giản hóa cấu hình để tránh xung đột đường dẫn
app.use('/images', express.static(path.join(process.cwd(), 'public/images')));
app.use('/processed', express.static(path.join(process.cwd(), 'public/images/processed')));

// CORS setup
app.use((req: Request, res: Response, next: NextFunction) => {
  // Cho phép cả localhost:5173 và localhost:3000
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Routes
app.use('/api', routes);

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: AUTH_MESSAGES.SYSTEM_ERROR,
    error: err.message 
  });
});

export default app;
