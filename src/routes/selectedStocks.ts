import { Router } from 'express';
import {
  getAllSelectedStocks,
  getSelectedStocksBySymbol,
  getTopSelectedStocksByReturn,
  getSelectedStockById,
  createSelectedStock,
  updateSelectedStock,
  deleteSelectedStock,
  deleteMultipleSelectedStocks
} from '../controllers/selectedStocks.controller';
import { verifyToken, isAdmin } from '../middlewares';
import { AsyncRequestHandler } from '../types/express';

const router = Router();

// Public routes
// GET /api/selected-stocks - Get all selected stocks with pagination
router.get('/', getAllSelectedStocks as AsyncRequestHandler);

// GET /api/selected-stocks/top - Get top selected stocks by Return
router.get('/top', getTopSelectedStocksByReturn as AsyncRequestHandler);

// GET /api/selected-stocks/symbol/:symbol - Get selected stock by symbol
router.get('/symbol/:symbol', getSelectedStocksBySymbol as AsyncRequestHandler);

// GET /api/selected-stocks/:id - Get a selected stock by ID
router.get('/:id', getSelectedStockById as AsyncRequestHandler);

// Protected routes - Admin only
// POST /api/selected-stocks - Create a new selected stock
router.post('/', verifyToken, isAdmin, createSelectedStock as AsyncRequestHandler);

// PUT /api/selected-stocks/:id - Update a selected stock
router.put('/:id', verifyToken, isAdmin, updateSelectedStock as AsyncRequestHandler);

// DELETE /api/selected-stocks/:id - Delete a selected stock
router.delete('/:id', verifyToken, isAdmin, deleteSelectedStock as AsyncRequestHandler);

// DELETE /api/selected-stocks - Delete multiple selected stocks
router.post('/delete-many', verifyToken, isAdmin, deleteMultipleSelectedStocks as AsyncRequestHandler);

export default router; 