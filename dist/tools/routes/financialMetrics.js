"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var controllers_1 = require("../controllers");
var middlewares_1 = require("../middlewares");
var router = (0, express_1.Router)();
// Public routes - for both authenticated and non-authenticated users
router.get('/', controllers_1.getFinancialMetrics);
router.get('/stock/:symbol/year/:year/quarter/:quarter', controllers_1.getFinancialMetricsBySymbolYearQuarter);
router.get('/stock/:symbol/year/:year', controllers_1.getFinancialMetricsBySymbolYearQuarter);
router.get('/:id', controllers_1.getFinancialMetricsById);
// Protected routes - only for authenticated admin users
router.post('/bulk', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.bulkCreateFinancialMetrics);
router.post('/', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.createFinancialMetrics);
router.put('/:id', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.updateFinancialMetrics);
router.delete('/:id', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.deleteFinancialMetrics);
exports.default = router;
