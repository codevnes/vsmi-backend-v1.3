import { Router } from 'express';
import { getAllStocks, getStockBySymbol, createStock, updateStock, deleteStock } from '../controllers';
import { verifyToken, isAdmin } from '../middlewares';

const router = Router();

// Public routes
router.get('/', getAllStocks);
router.get('/:symbol', getStockBySymbol);

// Protected routes - Admin only
router.post('/', verifyToken, isAdmin, createStock);
router.put('/:symbol', verifyToken, isAdmin, updateStock);
router.delete('/:symbol', verifyToken, isAdmin, deleteStock);

export default router; 