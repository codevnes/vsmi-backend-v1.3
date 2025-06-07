import { Router } from 'express';
import { 
  getChatGptAnalyses, 
  getChatGptAnalysisBySymbolAndDate,
  getLatestChatGptAnalysisBySymbol,
  processChatGptAnalysis, 
  batchProcessChatGptAnalyses,
  deleteChatGptAnalysis 
} from '../controllers';
import { verifyToken, isAdmin } from '../middlewares';

const router = Router();

// Public routes
router.get('/', getChatGptAnalyses);
router.get('/:symbol/latest', getLatestChatGptAnalysisBySymbol);
router.get('/:symbol/:date', getChatGptAnalysisBySymbolAndDate);

// Protected routes - Admin only
router.post('/', verifyToken, isAdmin, processChatGptAnalysis);
router.post('/batch', verifyToken, isAdmin, batchProcessChatGptAnalyses);
router.delete('/:symbol/:date', verifyToken, isAdmin, deleteChatGptAnalysis);

export default router; 