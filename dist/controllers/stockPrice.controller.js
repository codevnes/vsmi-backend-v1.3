"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkCreateStockPrices = exports.getLatestStockPrice = exports.deleteStockPrice = exports.updateStockPrice = exports.createStockPrice = exports.getStockPriceByDate = exports.getStockPrices = void 0;
const services_1 = require("../services");
const stockPrice_constants_1 = require("../utils/stockPrice.constants");
const helpers_1 = require("../utils/helpers");
const getStockPrices = async (req, res) => {
    try {
        const { symbol } = req.params;
        const { startDate, endDate, page = '1', limit = '30' } = req.query;
        const result = await services_1.stockPriceService.getStockPrices({
            symbol,
            startDate: startDate,
            endDate: endDate,
            page: parseInt(page),
            limit: parseInt(limit),
        });
        return res.status(200).json({
            message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.GET_STOCK_PRICES_SUCCESS,
            ...(0, helpers_1.bigIntSerializer)(result)
        });
    }
    catch (error) {
        console.error('Error fetching stock prices:', error);
        return res.status(500).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.GET_STOCK_PRICES_ERROR });
    }
};
exports.getStockPrices = getStockPrices;
const getStockPriceByDate = async (req, res) => {
    try {
        const { symbol, date } = req.params;
        const stockPrice = await services_1.stockPriceService.getStockPriceByDate(symbol, date);
        if (!stockPrice) {
            return res.status(404).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.STOCK_PRICE_NOT_FOUND });
        }
        return res.status(200).json({
            message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.GET_STOCK_PRICE_SUCCESS,
            stockPrice: (0, helpers_1.bigIntSerializer)(stockPrice)
        });
    }
    catch (error) {
        console.error('Error fetching stock price:', error);
        return res.status(500).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.GET_STOCK_PRICE_ERROR });
    }
};
exports.getStockPriceByDate = getStockPriceByDate;
const createStockPrice = async (req, res) => {
    try {
        const { symbol, date, open, high, low, close, volume, trendQ, fq, bandDown, bandUp } = req.body;
        if (!symbol || !date || !open || !high || !low || !close) {
            return res.status(400).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.REQUIRED_FIELDS });
        }
        const stockPrice = await services_1.stockPriceService.createStockPrice({
            symbol,
            date: new Date(date),
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            close: parseFloat(close),
            volume: volume ? parseInt(volume) : undefined,
            trendQ: trendQ ? parseFloat(trendQ) : undefined,
            fq: fq ? parseFloat(fq) : undefined,
            bandDown: bandDown ? parseFloat(bandDown) : undefined,
            bandUp: bandUp ? parseFloat(bandUp) : undefined,
        });
        return res.status(201).json({
            message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.CREATE_STOCK_PRICE_SUCCESS,
            stockPrice: (0, helpers_1.bigIntSerializer)(stockPrice)
        });
    }
    catch (error) {
        console.error('Error creating stock price:', error);
        if (error instanceof Error) {
            if (error.message === 'STOCK_NOT_FOUND') {
                return res.status(404).json({ message: 'Stock not found' });
            }
            if (error.message === 'STOCK_PRICE_ALREADY_EXISTS') {
                return res.status(409).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.STOCK_PRICE_ALREADY_EXISTS });
            }
        }
        return res.status(500).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.CREATE_STOCK_PRICE_ERROR });
    }
};
exports.createStockPrice = createStockPrice;
const updateStockPrice = async (req, res) => {
    try {
        const { symbol, date } = req.params;
        const { open, high, low, close, volume, trendQ, fq, bandDown, bandUp } = req.body;
        const updateData = {};
        if (open !== undefined)
            updateData.open = parseFloat(open);
        if (high !== undefined)
            updateData.high = parseFloat(high);
        if (low !== undefined)
            updateData.low = parseFloat(low);
        if (close !== undefined)
            updateData.close = parseFloat(close);
        if (volume !== undefined)
            updateData.volume = parseInt(volume);
        if (trendQ !== undefined)
            updateData.trendQ = parseFloat(trendQ);
        if (fq !== undefined)
            updateData.fq = parseFloat(fq);
        if (bandDown !== undefined)
            updateData.bandDown = parseFloat(bandDown);
        if (bandUp !== undefined)
            updateData.bandUp = parseFloat(bandUp);
        const stockPrice = await services_1.stockPriceService.updateStockPrice(symbol, date, updateData);
        if (!stockPrice) {
            return res.status(404).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.STOCK_PRICE_NOT_FOUND });
        }
        return res.status(200).json({
            message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.UPDATE_STOCK_PRICE_SUCCESS,
            stockPrice: (0, helpers_1.bigIntSerializer)(stockPrice)
        });
    }
    catch (error) {
        console.error('Error updating stock price:', error);
        return res.status(500).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.UPDATE_STOCK_PRICE_ERROR });
    }
};
exports.updateStockPrice = updateStockPrice;
const deleteStockPrice = async (req, res) => {
    try {
        const { symbol, date } = req.params;
        await services_1.stockPriceService.deleteStockPrice(symbol, date);
        return res.status(200).json({
            message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.DELETE_STOCK_PRICE_SUCCESS
        });
    }
    catch (error) {
        console.error('Error deleting stock price:', error);
        if (error instanceof Error && error.message === 'STOCK_PRICE_NOT_FOUND') {
            return res.status(404).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.STOCK_PRICE_NOT_FOUND });
        }
        return res.status(500).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.DELETE_STOCK_PRICE_ERROR });
    }
};
exports.deleteStockPrice = deleteStockPrice;
const getLatestStockPrice = async (req, res) => {
    try {
        const { symbol } = req.params;
        const stockPrice = await services_1.stockPriceService.getLatestStockPrice(symbol);
        if (!stockPrice) {
            return res.status(404).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.STOCK_PRICE_NOT_FOUND });
        }
        return res.status(200).json({
            message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.GET_STOCK_PRICE_SUCCESS,
            stockPrice: (0, helpers_1.bigIntSerializer)(stockPrice)
        });
    }
    catch (error) {
        console.error('Error fetching latest stock price:', error);
        return res.status(500).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.GET_STOCK_PRICE_ERROR });
    }
};
exports.getLatestStockPrice = getLatestStockPrice;
const bulkCreateStockPrices = async (req, res) => {
    try {
        const { stockPrices } = req.body;
        if (!Array.isArray(stockPrices) || stockPrices.length === 0) {
            return res.status(400).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.INVALID_DATA });
        }
        const processedData = stockPrices.map(item => ({
            symbol: item.symbol,
            date: new Date(item.date),
            open: parseFloat(item.open),
            high: parseFloat(item.high),
            low: parseFloat(item.low),
            close: parseFloat(item.close),
            volume: item.volume ? parseInt(item.volume) : undefined,
            trendQ: item.trendQ ? parseFloat(item.trendQ) : undefined,
            fq: item.fq ? parseFloat(item.fq) : undefined,
            bandDown: item.bandDown ? parseFloat(item.bandDown) : undefined,
            bandUp: item.bandUp ? parseFloat(item.bandUp) : undefined,
        }));
        const count = await services_1.stockPriceService.bulkCreateStockPrices(processedData);
        return res.status(201).json({
            message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.BULK_CREATE_SUCCESS,
            count: (0, helpers_1.bigIntSerializer)(count)
        });
    }
    catch (error) {
        console.error('Error processing bulk stock prices:', error);
        return res.status(500).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.BULK_CREATE_ERROR });
    }
};
exports.bulkCreateStockPrices = bulkCreateStockPrices;
