import { Router } from 'express';
import {
  getAllSubscriptionPlans,
  getSubscriptionPlanById,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from '../controllers/subscriptionPlan.controller';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware';
import { AsyncRequestHandler, AsyncAuthRequestHandler } from '../types/express';

const router = Router();

// Public routes
router.get('/', getAllSubscriptionPlans as AsyncRequestHandler);
router.get('/:id', getSubscriptionPlanById as AsyncRequestHandler);

// Admin only routes
router.post('/', authenticateToken, isAdmin, createSubscriptionPlan as AsyncAuthRequestHandler);
router.put('/:id', authenticateToken, isAdmin, updateSubscriptionPlan as AsyncAuthRequestHandler);
router.delete('/:id', authenticateToken, isAdmin, deleteSubscriptionPlan as AsyncAuthRequestHandler);

export default router; 