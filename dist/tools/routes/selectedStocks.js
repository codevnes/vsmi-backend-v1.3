"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var selectedStocks_controller_1 = require("../controllers/selectedStocks.controller");
var middlewares_1 = require("../middlewares");
var router = (0, express_1.Router)();
// Public routes
// GET /api/selected-stocks - Get all selected stocks with pagination
router.get('/', selectedStocks_controller_1.getAllSelectedStocks);
// GET /api/selected-stocks/top - Get top selected stocks by Q-Index
router.get('/top', selectedStocks_controller_1.getTopSelectedStocksByQIndex);
// GET /api/selected-stocks/date/:date - Get selected stocks by date
router.get('/date/:date', selectedStocks_controller_1.getSelectedStocksByDate);
// GET /api/selected-stocks/symbol/:symbol - Get selected stocks by symbol with pagination
router.get('/symbol/:symbol', selectedStocks_controller_1.getSelectedStocksBySymbol);
// GET /api/selected-stocks/:id - Get a selected stock by ID
router.get('/:id', selectedStocks_controller_1.getSelectedStockById);
// Protected routes - Admin only
// POST /api/selected-stocks - Create a new selected stock
router.post('/', middlewares_1.verifyToken, middlewares_1.isAdmin, selectedStocks_controller_1.createSelectedStock);
// PUT /api/selected-stocks/:id - Update a selected stock
router.put('/:id', middlewares_1.verifyToken, middlewares_1.isAdmin, selectedStocks_controller_1.updateSelectedStock);
// DELETE /api/selected-stocks/:id - Delete a selected stock
router.delete('/:id', middlewares_1.verifyToken, middlewares_1.isAdmin, selectedStocks_controller_1.deleteSelectedStock);
// DELETE /api/selected-stocks - Delete multiple selected stocks
router.post('/delete-many', middlewares_1.verifyToken, middlewares_1.isAdmin, selectedStocks_controller_1.deleteMultipleSelectedStocks);
exports.default = router;
