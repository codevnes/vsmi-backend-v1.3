import { Router } from 'express';
import { 
  getFScoreAnalysis,
  batchProcessFScoreAnalyses,
  getAllFScoreAnalyses
} from '../controllers/fscore-analysis.controller';
import { verifyToken, isAdmin } from '../middlewares';
import { AsyncRequestHandler, AsyncAuthRequestHandler } from '../types/express';

const router = Router();

// Public routes
router.get('/', getAllFScoreAnalyses as AsyncRequestHandler);
router.get('/:symbol', getFScoreAnalysis as AsyncRequestHandler);

// Protected routes - Admin only
router.post('/batch', verifyToken, isAdmin, batchProcessFScoreAnalyses as AsyncAuthRequestHandler);

export default router; 