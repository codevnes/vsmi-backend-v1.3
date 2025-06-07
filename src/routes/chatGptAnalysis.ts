import { Router } from 'express';
import { 
  getChatGptAnalyses, 
  getChatGptAnalysisBySymbolAndDate,
  getLatestChatGptAnalysisBySymbol,
  processChatGptAnalysis, 
  batchProcessChatGptAnalyses,
  deleteChatGptAnalysis 
} from '../controllers/chatGptAnalysis.controller';
import { verifyToken, isAdmin } from '../middlewares';
import { AsyncRequestHandler, AsyncAuthRequestHandler } from '../types/express';

const router = Router();

// Public routes
router.get('/', getChatGptAnalyses as AsyncRequestHandler);
router.get('/:symbol/latest', getLatestChatGptAnalysisBySymbol as AsyncRequestHandler);
router.get('/:symbol/:date', getChatGptAnalysisBySymbolAndDate as AsyncRequestHandler);

// Protected routes - Admin only
router.post('/', verifyToken, isAdmin, processChatGptAnalysis as AsyncAuthRequestHandler);
router.post('/batch', verifyToken, isAdmin, batchProcessChatGptAnalyses as AsyncAuthRequestHandler);
router.delete('/:symbol/:date', verifyToken, isAdmin, deleteChatGptAnalysis as AsyncAuthRequestHandler);

export default router; 