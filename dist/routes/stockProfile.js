"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stockProfile_controller_1 = require("../controllers/stockProfile.controller");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
// Public routes
router.get('/', stockProfile_controller_1.getAllStockProfiles);
router.get('/:symbol', stockProfile_controller_1.getStockProfileBySymbol);
// Protected routes - Admin only
router.post('/', middlewares_1.verifyToken, middlewares_1.isAdmin, stockProfile_controller_1.createStockProfile);
router.put('/:symbol', middlewares_1.verifyToken, middlewares_1.isAdmin, stockProfile_controller_1.updateStockProfile);
router.delete('/:symbol', middlewares_1.verifyToken, middlewares_1.isAdmin, stockProfile_controller_1.deleteStockProfile);
router.post('/upsert', middlewares_1.verifyToken, middlewares_1.isAdmin, stockProfile_controller_1.upsertStockProfile);
exports.default = router;
