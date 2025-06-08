import { Router } from 'express';
import { 
  getTechnicalRecommendations,
  getLatestTechnicalRecommendationBySymbol,
  getTechnicalRecommendationBySymbolAndDate,
  createTechnicalRecommendation,
  updateTechnicalRecommendation,
  upsertTechnicalRecommendation,
  deleteTechnicalRecommendation
} from '../controllers/technicalRecommendation.controller';
import { verifyToken, isAdmin } from '../middlewares';
import { AsyncRequestHandler, AsyncAuthRequestHandler } from '../types/express';

const router = Router();

// Public routes
router.get('/', getTechnicalRecommendations as AsyncRequestHandler);
router.get('/:symbol', getLatestTechnicalRecommendationBySymbol as AsyncRequestHandler);
router.get('/:symbol/:date', getTechnicalRecommendationBySymbolAndDate as AsyncRequestHandler);

// Protected routes - Admin only
router.post('/', verifyToken, isAdmin, createTechnicalRecommendation as AsyncAuthRequestHandler);
router.put('/:symbol/:date', verifyToken, isAdmin, updateTechnicalRecommendation as AsyncAuthRequestHandler);
router.patch('/:symbol/:date', verifyToken, isAdmin, upsertTechnicalRecommendation as AsyncAuthRequestHandler);
router.delete('/:symbol/:date', verifyToken, isAdmin, deleteTechnicalRecommendation as AsyncAuthRequestHandler);

export default router; 