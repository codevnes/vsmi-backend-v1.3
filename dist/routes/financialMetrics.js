"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const financialMetrics_controller_1 = require("../controllers/financialMetrics.controller");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
// Public routes - for both authenticated and non-authenticated users
router.get('/', financialMetrics_controller_1.getFinancialMetrics);
router.get('/:symbol', financialMetrics_controller_1.getFinancialMetricsBySymbol);
router.get('/:symbol/year/:year/quarter/:quarter', financialMetrics_controller_1.getFinancialMetricsBySymbolYearQuarter);
router.get('/:symbol/year/:year', financialMetrics_controller_1.getFinancialMetricsBySymbolYearQuarter);
router.get('/:id', financialMetrics_controller_1.getFinancialMetricsById);
// Protected routes - only for authenticated admin users
router.post('/bulk', middlewares_1.verifyToken, middlewares_1.isAdmin, financialMetrics_controller_1.bulkCreateFinancialMetrics);
router.post('/', middlewares_1.verifyToken, middlewares_1.isAdmin, financialMetrics_controller_1.createFinancialMetrics);
router.put('/:id', middlewares_1.verifyToken, middlewares_1.isAdmin, financialMetrics_controller_1.updateFinancialMetrics);
router.delete('/:id', middlewares_1.verifyToken, middlewares_1.isAdmin, financialMetrics_controller_1.deleteFinancialMetrics);
exports.default = router;
