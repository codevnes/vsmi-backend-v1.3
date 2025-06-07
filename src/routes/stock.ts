import { Router } from 'express';
import { getAllStocks, getStockBySymbol, createStock, updateStock, deleteStock } from '../controllers/stock.controller';
import { verifyToken, isAdmin } from '../middlewares';
import { AsyncRequestHandler, AsyncAuthRequestHandler } from '../types/express';

const router = Router();

// Public routes
router.get('/', getAllStocks as AsyncRequestHandler);
router.get('/:symbol', getStockBySymbol as AsyncRequestHandler);

// Protected routes - Admin only
router.post('/', verifyToken, isAdmin, createStock as AsyncAuthRequestHandler);
router.put('/:symbol', verifyToken, isAdmin, updateStock as AsyncAuthRequestHandler);
router.delete('/:symbol', verifyToken, isAdmin, deleteStock as AsyncAuthRequestHandler);

export default router; 