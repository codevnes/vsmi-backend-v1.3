"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStock = exports.updateStock = exports.createStock = exports.getStockBySymbol = exports.getAllStocks = void 0;
const services_1 = require("../services");
const stock_constants_1 = require("../utils/stock.constants");
/**
 * Get all stocks with pagination
 */
const getAllStocks = async (req, res) => {
    try {
        const { page = '1', limit = '10', search, exchange, industry } = req.query;
        const result = await services_1.stockService.getAllStocks({
            page: parseInt(page),
            limit: parseInt(limit),
            search: search,
            exchange: exchange,
            industry: industry,
        });
        return res.status(200).json({
            message: stock_constants_1.STOCK_MESSAGES.GET_STOCKS_SUCCESS,
            ...result
        });
    }
    catch (error) {
        console.error('Error fetching stocks:', error);
        return res.status(500).json({ message: stock_constants_1.STOCK_MESSAGES.GET_STOCKS_ERROR });
    }
};
exports.getAllStocks = getAllStocks;
/**
 * Get stock by symbol
 */
const getStockBySymbol = async (req, res) => {
    try {
        const { symbol } = req.params;
        const stock = await services_1.stockService.getStockBySymbol(symbol);
        if (!stock) {
            return res.status(404).json({ message: stock_constants_1.STOCK_MESSAGES.STOCK_NOT_FOUND });
        }
        return res.status(200).json({
            message: stock_constants_1.STOCK_MESSAGES.GET_STOCK_SUCCESS,
            stock
        });
    }
    catch (error) {
        console.error('Error fetching stock:', error);
        return res.status(500).json({ message: stock_constants_1.STOCK_MESSAGES.GET_STOCK_ERROR });
    }
};
exports.getStockBySymbol = getStockBySymbol;
/**
 * Create a new stock
 */
const createStock = async (req, res) => {
    try {
        const { symbol, name } = req.body;
        if (!symbol || !name) {
            return res.status(400).json({ message: stock_constants_1.STOCK_MESSAGES.REQUIRED_FIELDS });
        }
        const stock = await services_1.stockService.createStock(req.body);
        return res.status(201).json({
            message: stock_constants_1.STOCK_MESSAGES.CREATE_STOCK_SUCCESS,
            stock
        });
    }
    catch (error) {
        console.error('Error creating stock:', error);
        if (error instanceof Error && error.message === 'STOCK_ALREADY_EXISTS') {
            return res.status(409).json({ message: stock_constants_1.STOCK_MESSAGES.STOCK_ALREADY_EXISTS });
        }
        return res.status(500).json({ message: stock_constants_1.STOCK_MESSAGES.CREATE_STOCK_ERROR });
    }
};
exports.createStock = createStock;
/**
 * Update an existing stock
 */
const updateStock = async (req, res) => {
    try {
        const { symbol } = req.params;
        const stock = await services_1.stockService.updateStock(symbol, req.body);
        if (!stock) {
            return res.status(404).json({ message: stock_constants_1.STOCK_MESSAGES.STOCK_NOT_FOUND });
        }
        return res.status(200).json({
            message: stock_constants_1.STOCK_MESSAGES.UPDATE_STOCK_SUCCESS,
            stock
        });
    }
    catch (error) {
        console.error('Error updating stock:', error);
        return res.status(500).json({ message: stock_constants_1.STOCK_MESSAGES.UPDATE_STOCK_ERROR });
    }
};
exports.updateStock = updateStock;
/**
 * Delete a stock
 */
const deleteStock = async (req, res) => {
    try {
        const { symbol } = req.params;
        await services_1.stockService.deleteStock(symbol);
        return res.status(200).json({
            message: stock_constants_1.STOCK_MESSAGES.DELETE_STOCK_SUCCESS
        });
    }
    catch (error) {
        console.error('Error deleting stock:', error);
        if (error instanceof Error && error.message === 'STOCK_NOT_FOUND') {
            return res.status(404).json({ message: stock_constants_1.STOCK_MESSAGES.STOCK_NOT_FOUND });
        }
        return res.status(500).json({ message: stock_constants_1.STOCK_MESSAGES.DELETE_STOCK_ERROR });
    }
};
exports.deleteStock = deleteStock;
