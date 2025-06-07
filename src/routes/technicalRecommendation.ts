import { Router } from 'express';
import { 
  getTechnicalRecommendations, 
  getTechnicalRecommendationBySymbolAndDate,
  getLatestTechnicalRecommendationBySymbol,
  createTechnicalRecommendation, 
  updateTechnicalRecommendation,
  upsertTechnicalRecommendation, 
  deleteTechnicalRecommendation 
} from '../controllers';
import { verifyToken, isAdmin } from '../middlewares';

const router = Router();

// Public routes
router.get('/', getTechnicalRecommendations);
router.get('/:symbol/latest', getLatestTechnicalRecommendationBySymbol);
router.get('/:symbol/:date', getTechnicalRecommendationBySymbolAndDate);

// Protected routes - Admin only
router.post('/', verifyToken, isAdmin, createTechnicalRecommendation);
router.put('/:symbol/:date', verifyToken, isAdmin, updateTechnicalRecommendation);
router.patch('/:symbol/:date', verifyToken, isAdmin, upsertTechnicalRecommendation);
router.delete('/:symbol/:date', verifyToken, isAdmin, deleteTechnicalRecommendation);

export default router; 