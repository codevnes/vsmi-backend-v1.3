import { Router } from 'express';
import {
  getFinancialMetrics,
  getFinancialMetricsById,
  getFinancialMetricsBySymbol,
  getFinancialMetricsBySymbolYearQuarter,
  createFinancialMetrics,
  updateFinancialMetrics,
  deleteFinancialMetrics,
  bulkCreateFinancialMetrics
} from '../controllers/financialMetrics.controller';
import { verifyToken, isAdmin } from '../middlewares';
import { AsyncRequestHandler, AsyncAuthRequestHandler } from '../types/express';

const router = Router();

// Public routes - for both authenticated and non-authenticated users
router.get('/', getFinancialMetrics as AsyncRequestHandler);
router.get('/stock/:symbol', getFinancialMetricsBySymbol as AsyncRequestHandler);
router.get('/stock/:symbol/year/:year/quarter/:quarter', getFinancialMetricsBySymbolYearQuarter as AsyncRequestHandler);
router.get('/stock/:symbol/year/:year', getFinancialMetricsBySymbolYearQuarter as AsyncRequestHandler);
router.get('/:id', getFinancialMetricsById as AsyncRequestHandler);

// Protected routes - only for authenticated admin users
router.post('/bulk', verifyToken, isAdmin, bulkCreateFinancialMetrics as AsyncAuthRequestHandler);
router.post('/', verifyToken, isAdmin, createFinancialMetrics as AsyncAuthRequestHandler);
router.put('/:id', verifyToken, isAdmin, updateFinancialMetrics as AsyncAuthRequestHandler);
router.delete('/:id', verifyToken, isAdmin, deleteFinancialMetrics as AsyncAuthRequestHandler);

export default router; 