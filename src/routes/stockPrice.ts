import { Router } from 'express';
import { 
  getStockPrices,
  getStockPriceByDate,
  getLatestStockPrice,
  createStockPrice,
  updateStockPrice,
  deleteStockPrice,
  bulkCreateStockPrices
} from '../controllers/stockPrice.controller';
import { verifyToken, isAdmin } from '../middlewares';
import { AsyncRequestHandler, AsyncAuthRequestHandler } from '../types/express';

const router = Router();

// Public routes
router.get('/:symbol', getStockPrices as AsyncRequestHandler);
router.get('/:symbol/date/:date', getStockPriceByDate as AsyncRequestHandler);
router.get('/:symbol/latest', getLatestStockPrice as AsyncRequestHandler);

// Protected routes - Admin only
router.post('/', verifyToken, isAdmin, createStockPrice as AsyncAuthRequestHandler);
router.post('/bulk', verifyToken, isAdmin, bulkCreateStockPrices as AsyncAuthRequestHandler);
router.put('/symbol/:symbol/date/:date', verifyToken, isAdmin, updateStockPrice as AsyncAuthRequestHandler);
router.delete('/symbol/:symbol/date/:date', verifyToken, isAdmin, deleteStockPrice as AsyncAuthRequestHandler);

export default router; 