import { Router } from 'express';
import {
  getAllSelectedStocks,
  getSelectedStocksBySymbol,
  getSelectedStocksByDate,
  getTopSelectedStocksByQIndex,
  getSelectedStockById,
  createSelectedStock,
  updateSelectedStock,
  deleteSelectedStock,
  deleteMultipleSelectedStocks
} from '../controllers/selectedStocks.controller';
import { verifyToken, isAdmin } from '../middlewares';

const router = Router();

// Public routes
// GET /api/selected-stocks - Get all selected stocks with pagination
router.get('/', getAllSelectedStocks);

// GET /api/selected-stocks/top - Get top selected stocks by Q-Index
router.get('/top', getTopSelectedStocksByQIndex);

// GET /api/selected-stocks/date/:date - Get selected stocks by date
router.get('/date/:date', getSelectedStocksByDate);

// GET /api/selected-stocks/symbol/:symbol - Get selected stocks by symbol with pagination
router.get('/symbol/:symbol', getSelectedStocksBySymbol);

// GET /api/selected-stocks/:id - Get a selected stock by ID
router.get('/:id', getSelectedStockById);

// Protected routes - Admin only
// POST /api/selected-stocks - Create a new selected stock
router.post('/', verifyToken, isAdmin, createSelectedStock);

// PUT /api/selected-stocks/:id - Update a selected stock
router.put('/:id', verifyToken, isAdmin, updateSelectedStock);

// DELETE /api/selected-stocks/:id - Delete a selected stock
router.delete('/:id', verifyToken, isAdmin, deleteSelectedStock);

// DELETE /api/selected-stocks - Delete multiple selected stocks
router.post('/delete-many', verifyToken, isAdmin, deleteMultipleSelectedStocks);

export default router; 