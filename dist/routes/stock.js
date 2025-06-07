"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stock_controller_1 = require("../controllers/stock.controller");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
// Public routes
router.get('/', stock_controller_1.getAllStocks);
router.get('/:symbol', stock_controller_1.getStockBySymbol);
// Protected routes - Admin only
router.post('/', middlewares_1.verifyToken, middlewares_1.isAdmin, stock_controller_1.createStock);
router.put('/:symbol', middlewares_1.verifyToken, middlewares_1.isAdmin, stock_controller_1.updateStock);
router.delete('/:symbol', middlewares_1.verifyToken, middlewares_1.isAdmin, stock_controller_1.deleteStock);
exports.default = router;
