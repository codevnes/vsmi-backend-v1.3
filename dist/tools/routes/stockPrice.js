"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var controllers_1 = require("../controllers");
var middlewares_1 = require("../middlewares");
var router = (0, express_1.Router)();
// Public routes
router.get('/symbol/:symbol', controllers_1.getStockPrices);
router.get('/symbol/:symbol/date/:date', controllers_1.getStockPriceByDate);
router.get('/symbol/:symbol/latest', controllers_1.getLatestStockPrice);
// Protected routes - Admin only
router.post('/', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.createStockPrice);
router.post('/bulk', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.bulkCreateStockPrices);
router.put('/symbol/:symbol/date/:date', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.updateStockPrice);
router.delete('/symbol/:symbol/date/:date', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.deleteStockPrice);
exports.default = router;
