"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
// Public routes
router.get('/', controllers_1.getAllStocks);
router.get('/:symbol', controllers_1.getStockBySymbol);
// Protected routes - Admin only
router.post('/', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.createStock);
router.put('/:symbol', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.updateStock);
router.delete('/:symbol', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.deleteStock);
exports.default = router;
