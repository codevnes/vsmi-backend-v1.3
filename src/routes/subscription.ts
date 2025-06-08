import { Router } from 'express';
import {
  getAllSubscriptions,
  getSubscriptionById,
  getSubscriptionsByUserId,
  createSubscription,
  updateSubscription,
  cancelSubscription,
} from '../controllers/subscription.controller';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware';
import { AsyncRequestHandler, AsyncAuthRequestHandler } from '../types/express';

const router = Router();

// Admin routes
router.get('/', authenticateToken, isAdmin, getAllSubscriptions as AsyncAuthRequestHandler);

// Authenticated user routes
router.get('/:id', authenticateToken, getSubscriptionById as AsyncAuthRequestHandler);
router.get('/user/:userId', authenticateToken, getSubscriptionsByUserId as AsyncAuthRequestHandler);
router.post('/', authenticateToken, createSubscription as AsyncAuthRequestHandler);
router.put('/:id', authenticateToken, updateSubscription as AsyncAuthRequestHandler);
router.patch('/:id/cancel', authenticateToken, cancelSubscription as AsyncAuthRequestHandler);

export default router; 