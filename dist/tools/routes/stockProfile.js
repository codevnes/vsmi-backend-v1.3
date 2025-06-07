"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var controllers_1 = require("../controllers");
var middlewares_1 = require("../middlewares");
var router = (0, express_1.Router)();
// Public routes
router.get('/', controllers_1.getAllStockProfiles);
router.get('/:symbol', controllers_1.getStockProfileBySymbol);
// Protected routes - Admin only
router.post('/', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.createStockProfile);
router.put('/:symbol', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.updateStockProfile);
router.delete('/:symbol', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.deleteStockProfile);
router.post('/upsert', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.upsertStockProfile);
exports.default = router;
