import { Router } from 'express';
import { 
  getTechnicalAnalyses, 
  getTechnicalAnalysisBySymbol, 
  createTechnicalAnalysis, 
  updateTechnicalAnalysis,
  upsertTechnicalAnalysis, 
  deleteTechnicalAnalysis 
} from '../controllers/technicalAnalysis.controller';
import { verifyToken, isAdmin } from '../middlewares';
import { AsyncRequestHandler, AsyncAuthRequestHandler } from '../types/express';

const router = Router();

// Public routes
router.get('/', getTechnicalAnalyses as AsyncRequestHandler);
router.get('/:symbol', getTechnicalAnalysisBySymbol as AsyncRequestHandler);

// Protected routes - Admin only
router.post('/', verifyToken, isAdmin, createTechnicalAnalysis as AsyncAuthRequestHandler);
router.put('/:symbol', verifyToken, isAdmin, updateTechnicalAnalysis as AsyncAuthRequestHandler);
router.patch('/:symbol', verifyToken, isAdmin, upsertTechnicalAnalysis as AsyncAuthRequestHandler);
router.delete('/:symbol', verifyToken, isAdmin, deleteTechnicalAnalysis as AsyncAuthRequestHandler);

export default router; 