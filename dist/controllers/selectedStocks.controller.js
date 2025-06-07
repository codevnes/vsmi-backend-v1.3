"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMultipleSelectedStocks = exports.deleteSelectedStock = exports.updateSelectedStock = exports.createSelectedStock = exports.getSelectedStockById = exports.getTopSelectedStocksByQIndex = exports.getSelectedStocksByDate = exports.getSelectedStocksBySymbol = exports.getAllSelectedStocks = void 0;
const repositories_1 = require("../repositories");
const selectedStocks_constants_1 = require("../utils/selectedStocks.constants");
/**
 * Get all selected stocks with pagination
 */
const getAllSelectedStocks = async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const sort = req.query.sort || 'date';
        const order = req.query.order || 'desc';
        const result = await repositories_1.selectedStocksRepository.findAll({
            page,
            limit,
            sort,
            order,
        });
        return res.status(200).json({
            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_SUCCESS,
            ...result
        });
    }
    catch (error) {
        console.error('Error getting all selected stocks:', error);
        return res.status(500).json({
            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_ERROR
        });
    }
};
exports.getAllSelectedStocks = getAllSelectedStocks;
/**
 * Get selected stocks by symbol with pagination
 */
const getSelectedStocksBySymbol = async (req, res) => {
    try {
        const { symbol } = req.params;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const sort = req.query.sort || 'date';
        const order = req.query.order || 'desc';
        const result = await repositories_1.selectedStocksRepository.findBySymbol(symbol, {
            page,
            limit,
            sort,
            order,
        });
        return res.status(200).json({
            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_SUCCESS,
            ...result
        });
    }
    catch (error) {
        console.error(`Error getting selected stocks for symbol ${req.params.symbol}:`, error);
        return res.status(500).json({
            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_ERROR
        });
    }
};
exports.getSelectedStocksBySymbol = getSelectedStocksBySymbol;
/**
 * Get selected stocks by date
 */
const getSelectedStocksByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({
                message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.INVALID_DATE_FORMAT
            });
        }
        const result = await repositories_1.selectedStocksRepository.findByDate(dateObj);
        return res.status(200).json({
            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_SUCCESS,
            data: result
        });
    }
    catch (error) {
        console.error(`Error getting selected stocks for date ${req.params.date}:`, error);
        return res.status(500).json({
            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_ERROR
        });
    }
};
exports.getSelectedStocksByDate = getSelectedStocksByDate;
/**
 * Get top selected stocks by Q-Index
 */
const getTopSelectedStocksByQIndex = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 20;
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        // Validate dates if provided
        if ((startDate && isNaN(startDate.getTime())) ||
            (endDate && isNaN(endDate.getTime()))) {
            return res.status(400).json({
                message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.INVALID_DATE_FORMAT
            });
        }
        const result = await repositories_1.selectedStocksRepository.findTopByQIndex(limit, startDate, endDate);
        return res.status(200).json({
            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_SUCCESS,
            data: result
        });
    }
    catch (error) {
        console.error('Error getting top selected stocks by Q-Index:', error);
        return res.status(500).json({
            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_ERROR
        });
    }
};
exports.getTopSelectedStocksByQIndex = getTopSelectedStocksByQIndex;
/**
 * Get selected stock by ID
 */
const getSelectedStockById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await repositories_1.selectedStocksRepository.findById(id);
        if (!result) {
            return res.status(404).json({
                message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.SELECTED_STOCK_NOT_FOUND
            });
        }
        return res.status(200).json({
            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCK_SUCCESS,
            data: result
        });
    }
    catch (error) {
        console.error(`Error getting selected stock with id ${req.params.id}:`, error);
        return res.status(500).json({
            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCK_ERROR
        });
    }
};
exports.getSelectedStockById = getSelectedStockById;
/**
 * Create a new selected stock
 */
const createSelectedStock = async (req, res) => {
    try {
        const data = req.body;
        // Validate required fields
        if (!data.symbol || !data.date) {
            return res.status(400).json({
                message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.REQUIRED_FIELDS
            });
        }
        // Convert date string to Date object
        if (typeof data.date === 'string') {
            data.date = new Date(data.date);
            if (isNaN(data.date.getTime())) {
                return res.status(400).json({
                    message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.INVALID_DATE_FORMAT
                });
            }
        }
        // Check if the selected stock already exists
        const existingStock = await repositories_1.selectedStocksRepository.findBySymbolAndDate(data.symbol, data.date);
        if (existingStock) {
            return res.status(409).json({
                message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.SELECTED_STOCK_ALREADY_EXISTS
            });
        }
        const result = await repositories_1.selectedStocksRepository.create(data);
        return res.status(201).json({
            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.CREATE_SELECTED_STOCK_SUCCESS,
            data: result
        });
    }
    catch (error) {
        console.error('Error creating selected stock:', error);
        return res.status(500).json({
            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.CREATE_SELECTED_STOCK_ERROR
        });
    }
};
exports.createSelectedStock = createSelectedStock;
/**
 * Update a selected stock
 */
const updateSelectedStock = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        // Check if the selected stock exists
        const existingStock = await repositories_1.selectedStocksRepository.findById(id);
        if (!existingStock) {
            return res.status(404).json({
                message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.SELECTED_STOCK_NOT_FOUND
            });
        }
        // Convert date string to Date object if provided
        if (data.date && typeof data.date === 'string') {
            data.date = new Date(data.date);
            if (isNaN(data.date.getTime())) {
                return res.status(400).json({
                    message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.INVALID_DATE_FORMAT
                });
            }
        }
        // Check for symbol and date uniqueness if either is being updated
        if ((data.symbol && data.symbol !== existingStock.symbol) ||
            (data.date && data.date.getTime() !== existingStock.date.getTime())) {
            const newSymbol = data.symbol || existingStock.symbol;
            const newDate = data.date || existingStock.date;
            const duplicateStock = await repositories_1.selectedStocksRepository.findBySymbolAndDate(newSymbol, newDate);
            if (duplicateStock && duplicateStock.id !== id) {
                return res.status(409).json({
                    message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.SELECTED_STOCK_ALREADY_EXISTS
                });
            }
        }
        const result = await repositories_1.selectedStocksRepository.update(id, data);
        return res.status(200).json({
            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.UPDATE_SELECTED_STOCK_SUCCESS,
            data: result
        });
    }
    catch (error) {
        console.error(`Error updating selected stock with id ${req.params.id}:`, error);
        return res.status(500).json({
            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.UPDATE_SELECTED_STOCK_ERROR
        });
    }
};
exports.updateSelectedStock = updateSelectedStock;
/**
 * Delete a selected stock
 */
const deleteSelectedStock = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if the selected stock exists
        const existingStock = await repositories_1.selectedStocksRepository.findById(id);
        if (!existingStock) {
            return res.status(404).json({
                message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.SELECTED_STOCK_NOT_FOUND
            });
        }
        await repositories_1.selectedStocksRepository.delete(id);
        return res.status(200).json({
            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.DELETE_SELECTED_STOCK_SUCCESS
        });
    }
    catch (error) {
        console.error(`Error deleting selected stock with id ${req.params.id}:`, error);
        return res.status(500).json({
            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.DELETE_SELECTED_STOCK_ERROR
        });
    }
};
exports.deleteSelectedStock = deleteSelectedStock;
/**
 * Delete multiple selected stocks
 */
const deleteMultipleSelectedStocks = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                message: 'Invalid or empty ids array'
            });
        }
        const count = await repositories_1.selectedStocksRepository.deleteMany(ids);
        return res.status(200).json({
            message: `${count} selected stock(s) deleted successfully`
        });
    }
    catch (error) {
        console.error('Error deleting multiple selected stocks:', error);
        return res.status(500).json({
            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.DELETE_SELECTED_STOCK_ERROR
        });
    }
};
exports.deleteMultipleSelectedStocks = deleteMultipleSelectedStocks;
