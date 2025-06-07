import { Router } from 'express';
import { 
  getTechnicalAnalyses, 
  getTechnicalAnalysisBySymbol, 
  createTechnicalAnalysis, 
  updateTechnicalAnalysis,
  upsertTechnicalAnalysis, 
  deleteTechnicalAnalysis 
} from '../controllers';
import { verifyToken, isAdmin } from '../middlewares';

const router = Router();

// Public routes
router.get('/', getTechnicalAnalyses);
router.get('/:symbol', getTechnicalAnalysisBySymbol);

// Protected routes - Admin only
router.post('/', verifyToken, isAdmin, createTechnicalAnalysis);
router.put('/:symbol', verifyToken, isAdmin, updateTechnicalAnalysis);
router.patch('/:symbol', verifyToken, isAdmin, upsertTechnicalAnalysis);
router.delete('/:symbol', verifyToken, isAdmin, deleteTechnicalAnalysis);

export default router; 