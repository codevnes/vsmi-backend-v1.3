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
} from '../controllers';
import { verifyToken, isAdmin } from '../middlewares';

const router = Router();

// Public routes - for both authenticated and non-authenticated users
router.get('/', getFinancialMetrics);
router.get('/stock/:symbol', getFinancialMetricsBySymbol);
router.get('/stock/:symbol/year/:year/quarter/:quarter', getFinancialMetricsBySymbolYearQuarter);
router.get('/stock/:symbol/year/:year', getFinancialMetricsBySymbolYearQuarter);
router.get('/:id', getFinancialMetricsById);

// Protected routes - only for authenticated admin users
router.post('/bulk', verifyToken, isAdmin, bulkCreateFinancialMetrics);
router.post('/', verifyToken, isAdmin, createFinancialMetrics);
router.put('/:id', verifyToken, isAdmin, updateFinancialMetrics);
router.delete('/:id', verifyToken, isAdmin, deleteFinancialMetrics);

export default router; 