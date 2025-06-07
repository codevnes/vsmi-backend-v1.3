"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stockPrice_controller_1 = require("../controllers/stockPrice.controller");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
// Public routes
router.get('/symbol/:symbol', stockPrice_controller_1.getStockPrices);
router.get('/symbol/:symbol/date/:date', stockPrice_controller_1.getStockPriceByDate);
router.get('/symbol/:symbol/latest', stockPrice_controller_1.getLatestStockPrice);
// Protected routes - Admin only
router.post('/', middlewares_1.verifyToken, middlewares_1.isAdmin, stockPrice_controller_1.createStockPrice);
router.post('/bulk', middlewares_1.verifyToken, middlewares_1.isAdmin, stockPrice_controller_1.bulkCreateStockPrices);
router.put('/symbol/:symbol/date/:date', middlewares_1.verifyToken, middlewares_1.isAdmin, stockPrice_controller_1.updateStockPrice);
router.delete('/symbol/:symbol/date/:date', middlewares_1.verifyToken, middlewares_1.isAdmin, stockPrice_controller_1.deleteStockPrice);
exports.default = router;
