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
exports.deleteStock = exports.updateStock = exports.createStock = exports.getStockBySymbol = exports.getAllStocks = void 0;
var services_1 = require("../services");
var stock_constants_1 = require("../utils/stock.constants");
/**
 * Get all stocks with pagination
 */
var getAllStocks = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, limit, search, exchange, industry, result, error_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _a = req.query, _b = _a.page, page = _b === void 0 ? '1' : _b, _c = _a.limit, limit = _c === void 0 ? '10' : _c, search = _a.search, exchange = _a.exchange, industry = _a.industry;
                return [4 /*yield*/, services_1.stockService.getAllStocks({
                        page: parseInt(page),
                        limit: parseInt(limit),
                        search: search,
                        exchange: exchange,
                        industry: industry,
                    })];
            case 1:
                result = _d.sent();
                return [2 /*return*/, res.status(200).json(__assign({ message: stock_constants_1.STOCK_MESSAGES.GET_STOCKS_SUCCESS }, result))];
            case 2:
                error_1 = _d.sent();
                console.error('Error fetching stocks:', error_1);
                return [2 /*return*/, res.status(500).json({ message: stock_constants_1.STOCK_MESSAGES.GET_STOCKS_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllStocks = getAllStocks;
/**
 * Get stock by symbol
 */
var getStockBySymbol = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var symbol, stock, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                symbol = req.params.symbol;
                return [4 /*yield*/, services_1.stockService.getStockBySymbol(symbol)];
            case 1:
                stock = _a.sent();
                if (!stock) {
                    return [2 /*return*/, res.status(404).json({ message: stock_constants_1.STOCK_MESSAGES.STOCK_NOT_FOUND })];
                }
                return [2 /*return*/, res.status(200).json({
                        message: stock_constants_1.STOCK_MESSAGES.GET_STOCK_SUCCESS,
                        stock: stock
                    })];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching stock:', error_2);
                return [2 /*return*/, res.status(500).json({ message: stock_constants_1.STOCK_MESSAGES.GET_STOCK_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getStockBySymbol = getStockBySymbol;
/**
 * Create a new stock
 */
var createStock = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, symbol, name_1, stock, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, symbol = _a.symbol, name_1 = _a.name;
                if (!symbol || !name_1) {
                    return [2 /*return*/, res.status(400).json({ message: stock_constants_1.STOCK_MESSAGES.REQUIRED_FIELDS })];
                }
                return [4 /*yield*/, services_1.stockService.createStock(req.body)];
            case 1:
                stock = _b.sent();
                return [2 /*return*/, res.status(201).json({
                        message: stock_constants_1.STOCK_MESSAGES.CREATE_STOCK_SUCCESS,
                        stock: stock
                    })];
            case 2:
                error_3 = _b.sent();
                console.error('Error creating stock:', error_3);
                if (error_3 instanceof Error && error_3.message === 'STOCK_ALREADY_EXISTS') {
                    return [2 /*return*/, res.status(409).json({ message: stock_constants_1.STOCK_MESSAGES.STOCK_ALREADY_EXISTS })];
                }
                return [2 /*return*/, res.status(500).json({ message: stock_constants_1.STOCK_MESSAGES.CREATE_STOCK_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createStock = createStock;
/**
 * Update an existing stock
 */
var updateStock = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var symbol, stock, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                symbol = req.params.symbol;
                return [4 /*yield*/, services_1.stockService.updateStock(symbol, req.body)];
            case 1:
                stock = _a.sent();
                if (!stock) {
                    return [2 /*return*/, res.status(404).json({ message: stock_constants_1.STOCK_MESSAGES.STOCK_NOT_FOUND })];
                }
                return [2 /*return*/, res.status(200).json({
                        message: stock_constants_1.STOCK_MESSAGES.UPDATE_STOCK_SUCCESS,
                        stock: stock
                    })];
            case 2:
                error_4 = _a.sent();
                console.error('Error updating stock:', error_4);
                return [2 /*return*/, res.status(500).json({ message: stock_constants_1.STOCK_MESSAGES.UPDATE_STOCK_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateStock = updateStock;
/**
 * Delete a stock
 */
var deleteStock = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var symbol, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                symbol = req.params.symbol;
                return [4 /*yield*/, services_1.stockService.deleteStock(symbol)];
            case 1:
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        message: stock_constants_1.STOCK_MESSAGES.DELETE_STOCK_SUCCESS
                    })];
            case 2:
                error_5 = _a.sent();
                console.error('Error deleting stock:', error_5);
                if (error_5 instanceof Error && error_5.message === 'STOCK_NOT_FOUND') {
                    return [2 /*return*/, res.status(404).json({ message: stock_constants_1.STOCK_MESSAGES.STOCK_NOT_FOUND })];
                }
                return [2 /*return*/, res.status(500).json({ message: stock_constants_1.STOCK_MESSAGES.DELETE_STOCK_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteStock = deleteStock;
