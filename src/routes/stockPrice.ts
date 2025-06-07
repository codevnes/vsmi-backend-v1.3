import { Router } from 'express';
import { 
  getStockPrices,
  getStockPriceByDate,
  getLatestStockPrice,
  createStockPrice,
  updateStockPrice,
  deleteStockPrice,
  bulkCreateStockPrices
} from '../controllers';
import { verifyToken, isAdmin } from '../middlewares';

const router = Router();

// Public routes
router.get('/symbol/:symbol', getStockPrices);
router.get('/symbol/:symbol/date/:date', getStockPriceByDate);
router.get('/symbol/:symbol/latest', getLatestStockPrice);

// Protected routes - Admin only
router.post('/', verifyToken, isAdmin, createStockPrice);
router.post('/bulk', verifyToken, isAdmin, bulkCreateStockPrices);
router.put('/symbol/:symbol/date/:date', verifyToken, isAdmin, updateStockPrice);
router.delete('/symbol/:symbol/date/:date', verifyToken, isAdmin, deleteStockPrice);

export default router; 