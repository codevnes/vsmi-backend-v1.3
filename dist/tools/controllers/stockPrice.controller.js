"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkCreateStockPrices = exports.getLatestStockPrice = exports.deleteStockPrice = exports.updateStockPrice = exports.createStockPrice = exports.getStockPriceByDate = exports.getStockPrices = void 0;
var services_1 = require("../services");
var stockPrice_constants_1 = require("../utils/stockPrice.constants");
var helpers_1 = require("../utils/helpers");
var getStockPrices = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var symbol, _a, startDate, endDate, _b, page, _c, limit, result, error_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                symbol = req.params.symbol;
                _a = req.query, startDate = _a.startDate, endDate = _a.endDate, _b = _a.page, page = _b === void 0 ? '1' : _b, _c = _a.limit, limit = _c === void 0 ? '30' : _c;
                return [4 /*yield*/, services_1.stockPriceService.getStockPrices({
                        symbol: symbol,
                        startDate: startDate,
                        endDate: endDate,
                        page: parseInt(page),
                        limit: parseInt(limit),
                    })];
            case 1:
                result = _d.sent();
                return [2 /*return*/, res.status(200).json(__assign({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.GET_STOCK_PRICES_SUCCESS }, (0, helpers_1.bigIntSerializer)(result)))];
            case 2:
                error_1 = _d.sent();
                console.error('Error fetching stock prices:', error_1);
                return [2 /*return*/, res.status(500).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.GET_STOCK_PRICES_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getStockPrices = getStockPrices;
var getStockPriceByDate = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, symbol, date, stockPrice, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.params, symbol = _a.symbol, date = _a.date;
                return [4 /*yield*/, services_1.stockPriceService.getStockPriceByDate(symbol, date)];
            case 1:
                stockPrice = _b.sent();
                if (!stockPrice) {
                    return [2 /*return*/, res.status(404).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.STOCK_PRICE_NOT_FOUND })];
                }
                return [2 /*return*/, res.status(200).json({
                        message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.GET_STOCK_PRICE_SUCCESS,
                        stockPrice: (0, helpers_1.bigIntSerializer)(stockPrice)
                    })];
            case 2:
                error_2 = _b.sent();
                console.error('Error fetching stock price:', error_2);
                return [2 /*return*/, res.status(500).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.GET_STOCK_PRICE_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getStockPriceByDate = getStockPriceByDate;
var createStockPrice = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, symbol, date, open_1, high, low, close_1, volume, trendQ, fq, bandDown, bandUp, stockPrice, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, symbol = _a.symbol, date = _a.date, open_1 = _a.open, high = _a.high, low = _a.low, close_1 = _a.close, volume = _a.volume, trendQ = _a.trendQ, fq = _a.fq, bandDown = _a.bandDown, bandUp = _a.bandUp;
                if (!symbol || !date || !open_1 || !high || !low || !close_1) {
                    return [2 /*return*/, res.status(400).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.REQUIRED_FIELDS })];
                }
                return [4 /*yield*/, services_1.stockPriceService.createStockPrice({
                        symbol: symbol,
                        date: new Date(date),
                        open: parseFloat(open_1),
                        high: parseFloat(high),
                        low: parseFloat(low),
                        close: parseFloat(close_1),
                        volume: volume ? parseInt(volume) : undefined,
                        trendQ: trendQ ? parseFloat(trendQ) : undefined,
                        fq: fq ? parseFloat(fq) : undefined,
                        bandDown: bandDown ? parseFloat(bandDown) : undefined,
                        bandUp: bandUp ? parseFloat(bandUp) : undefined,
                    })];
            case 1:
                stockPrice = _b.sent();
                return [2 /*return*/, res.status(201).json({
                        message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.CREATE_STOCK_PRICE_SUCCESS,
                        stockPrice: (0, helpers_1.bigIntSerializer)(stockPrice)
                    })];
            case 2:
                error_3 = _b.sent();
                console.error('Error creating stock price:', error_3);
                if (error_3 instanceof Error) {
                    if (error_3.message === 'STOCK_NOT_FOUND') {
                        return [2 /*return*/, res.status(404).json({ message: 'Stock not found' })];
                    }
                    if (error_3.message === 'STOCK_PRICE_ALREADY_EXISTS') {
                        return [2 /*return*/, res.status(409).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.STOCK_PRICE_ALREADY_EXISTS })];
                    }
                }
                return [2 /*return*/, res.status(500).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.CREATE_STOCK_PRICE_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createStockPrice = createStockPrice;
var updateStockPrice = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, symbol, date, _b, open_2, high, low, close_2, volume, trendQ, fq, bandDown, bandUp, updateData, stockPrice, error_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.params, symbol = _a.symbol, date = _a.date;
                _b = req.body, open_2 = _b.open, high = _b.high, low = _b.low, close_2 = _b.close, volume = _b.volume, trendQ = _b.trendQ, fq = _b.fq, bandDown = _b.bandDown, bandUp = _b.bandUp;
                updateData = {};
                if (open_2 !== undefined)
                    updateData.open = parseFloat(open_2);
                if (high !== undefined)
                    updateData.high = parseFloat(high);
                if (low !== undefined)
                    updateData.low = parseFloat(low);
                if (close_2 !== undefined)
                    updateData.close = parseFloat(close_2);
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
                return [4 /*yield*/, services_1.stockPriceService.updateStockPrice(symbol, date, updateData)];
            case 1:
                stockPrice = _c.sent();
                if (!stockPrice) {
                    return [2 /*return*/, res.status(404).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.STOCK_PRICE_NOT_FOUND })];
                }
                return [2 /*return*/, res.status(200).json({
                        message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.UPDATE_STOCK_PRICE_SUCCESS,
                        stockPrice: (0, helpers_1.bigIntSerializer)(stockPrice)
                    })];
            case 2:
                error_4 = _c.sent();
                console.error('Error updating stock price:', error_4);
                return [2 /*return*/, res.status(500).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.UPDATE_STOCK_PRICE_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateStockPrice = updateStockPrice;
var deleteStockPrice = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, symbol, date, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.params, symbol = _a.symbol, date = _a.date;
                return [4 /*yield*/, services_1.stockPriceService.deleteStockPrice(symbol, date)];
            case 1:
                _b.sent();
                return [2 /*return*/, res.status(200).json({
                        message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.DELETE_STOCK_PRICE_SUCCESS
                    })];
            case 2:
                error_5 = _b.sent();
                console.error('Error deleting stock price:', error_5);
                if (error_5 instanceof Error && error_5.message === 'STOCK_PRICE_NOT_FOUND') {
                    return [2 /*return*/, res.status(404).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.STOCK_PRICE_NOT_FOUND })];
                }
                return [2 /*return*/, res.status(500).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.DELETE_STOCK_PRICE_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteStockPrice = deleteStockPrice;
var getLatestStockPrice = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var symbol, stockPrice, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                symbol = req.params.symbol;
                return [4 /*yield*/, services_1.stockPriceService.getLatestStockPrice(symbol)];
            case 1:
                stockPrice = _a.sent();
                if (!stockPrice) {
                    return [2 /*return*/, res.status(404).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.STOCK_PRICE_NOT_FOUND })];
                }
                return [2 /*return*/, res.status(200).json({
                        message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.GET_STOCK_PRICE_SUCCESS,
                        stockPrice: (0, helpers_1.bigIntSerializer)(stockPrice)
                    })];
            case 2:
                error_6 = _a.sent();
                console.error('Error fetching latest stock price:', error_6);
                return [2 /*return*/, res.status(500).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.GET_STOCK_PRICE_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getLatestStockPrice = getLatestStockPrice;
var bulkCreateStockPrices = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var stockPrices, processedData, count, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                stockPrices = req.body.stockPrices;
                if (!Array.isArray(stockPrices) || stockPrices.length === 0) {
                    return [2 /*return*/, res.status(400).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.INVALID_DATA })];
                }
                processedData = stockPrices.map(function (item) { return ({
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
                }); });
                return [4 /*yield*/, services_1.stockPriceService.bulkCreateStockPrices(processedData)];
            case 1:
                count = _a.sent();
                return [2 /*return*/, res.status(201).json({
                        message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.BULK_CREATE_SUCCESS,
                        count: (0, helpers_1.bigIntSerializer)(count)
                    })];
            case 2:
                error_7 = _a.sent();
                console.error('Error processing bulk stock prices:', error_7);
                return [2 /*return*/, res.status(500).json({ message: stockPrice_constants_1.STOCK_PRICE_MESSAGES.BULK_CREATE_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.bulkCreateStockPrices = bulkCreateStockPrices;
