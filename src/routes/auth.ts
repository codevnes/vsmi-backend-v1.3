import { Router } from 'express';
import { login, register, refreshToken, getProfile } from '../controllers';
import { verifyToken } from '../middlewares';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/profile', verifyToken, getProfile);

export default router; 