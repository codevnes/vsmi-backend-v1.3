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
exports.deleteMultipleSelectedStocks = exports.deleteSelectedStock = exports.updateSelectedStock = exports.createSelectedStock = exports.getSelectedStockById = exports.getTopSelectedStocksByQIndex = exports.getSelectedStocksByDate = exports.getSelectedStocksBySymbol = exports.getAllSelectedStocks = void 0;
var repositories_1 = require("../repositories");
var selectedStocks_constants_1 = require("../utils/selectedStocks.constants");
/**
 * Get all selected stocks with pagination
 */
var getAllSelectedStocks = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var page, limit, sort, order, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                page = req.query.page ? parseInt(req.query.page) : 1;
                limit = req.query.limit ? parseInt(req.query.limit) : 10;
                sort = req.query.sort || 'date';
                order = req.query.order || 'desc';
                return [4 /*yield*/, repositories_1.selectedStocksRepository.findAll({
                        page: page,
                        limit: limit,
                        sort: sort,
                        order: order,
                    })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, res.status(200).json(__assign({ message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_SUCCESS }, result))];
            case 2:
                error_1 = _a.sent();
                console.error('Error getting all selected stocks:', error_1);
                return [2 /*return*/, res.status(500).json({
                        message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_ERROR
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllSelectedStocks = getAllSelectedStocks;
/**
 * Get selected stocks by symbol with pagination
 */
var getSelectedStocksBySymbol = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var symbol, page, limit, sort, order, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                symbol = req.params.symbol;
                page = req.query.page ? parseInt(req.query.page) : 1;
                limit = req.query.limit ? parseInt(req.query.limit) : 10;
                sort = req.query.sort || 'date';
                order = req.query.order || 'desc';
                return [4 /*yield*/, repositories_1.selectedStocksRepository.findBySymbol(symbol, {
                        page: page,
                        limit: limit,
                        sort: sort,
                        order: order,
                    })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, res.status(200).json(__assign({ message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_SUCCESS }, result))];
            case 2:
                error_2 = _a.sent();
                console.error("Error getting selected stocks for symbol ".concat(req.params.symbol, ":"), error_2);
                return [2 /*return*/, res.status(500).json({
                        message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_ERROR
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSelectedStocksBySymbol = getSelectedStocksBySymbol;
/**
 * Get selected stocks by date
 */
var getSelectedStocksByDate = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var date, dateObj, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                date = req.params.date;
                dateObj = new Date(date);
                if (isNaN(dateObj.getTime())) {
                    return [2 /*return*/, res.status(400).json({
                            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.INVALID_DATE_FORMAT
                        })];
                }
                return [4 /*yield*/, repositories_1.selectedStocksRepository.findByDate(dateObj)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_SUCCESS,
                        data: result
                    })];
            case 2:
                error_3 = _a.sent();
                console.error("Error getting selected stocks for date ".concat(req.params.date, ":"), error_3);
                return [2 /*return*/, res.status(500).json({
                        message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_ERROR
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSelectedStocksByDate = getSelectedStocksByDate;
/**
 * Get top selected stocks by Q-Index
 */
var getTopSelectedStocksByQIndex = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var limit, startDate, endDate, result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                limit = req.query.limit ? parseInt(req.query.limit) : 20;
                startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
                endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
                // Validate dates if provided
                if ((startDate && isNaN(startDate.getTime())) ||
                    (endDate && isNaN(endDate.getTime()))) {
                    return [2 /*return*/, res.status(400).json({
                            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.INVALID_DATE_FORMAT
                        })];
                }
                return [4 /*yield*/, repositories_1.selectedStocksRepository.findTopByQIndex(limit, startDate, endDate)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_SUCCESS,
                        data: result
                    })];
            case 2:
                error_4 = _a.sent();
                console.error('Error getting top selected stocks by Q-Index:', error_4);
                return [2 /*return*/, res.status(500).json({
                        message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_ERROR
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTopSelectedStocksByQIndex = getTopSelectedStocksByQIndex;
/**
 * Get selected stock by ID
 */
var getSelectedStockById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, repositories_1.selectedStocksRepository.findById(id)];
            case 1:
                result = _a.sent();
                if (!result) {
                    return [2 /*return*/, res.status(404).json({
                            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.SELECTED_STOCK_NOT_FOUND
                        })];
                }
                return [2 /*return*/, res.status(200).json({
                        message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCK_SUCCESS,
                        data: result
                    })];
            case 2:
                error_5 = _a.sent();
                console.error("Error getting selected stock with id ".concat(req.params.id, ":"), error_5);
                return [2 /*return*/, res.status(500).json({
                        message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCK_ERROR
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSelectedStockById = getSelectedStockById;
/**
 * Create a new selected stock
 */
var createSelectedStock = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, existingStock, result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                data = req.body;
                // Validate required fields
                if (!data.symbol || !data.date) {
                    return [2 /*return*/, res.status(400).json({
                            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.REQUIRED_FIELDS
                        })];
                }
                // Convert date string to Date object
                if (typeof data.date === 'string') {
                    data.date = new Date(data.date);
                    if (isNaN(data.date.getTime())) {
                        return [2 /*return*/, res.status(400).json({
                                message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.INVALID_DATE_FORMAT
                            })];
                    }
                }
                return [4 /*yield*/, repositories_1.selectedStocksRepository.findBySymbolAndDate(data.symbol, data.date)];
            case 1:
                existingStock = _a.sent();
                if (existingStock) {
                    return [2 /*return*/, res.status(409).json({
                            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.SELECTED_STOCK_ALREADY_EXISTS
                        })];
                }
                return [4 /*yield*/, repositories_1.selectedStocksRepository.create(data)];
            case 2:
                result = _a.sent();
                return [2 /*return*/, res.status(201).json({
                        message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.CREATE_SELECTED_STOCK_SUCCESS,
                        data: result
                    })];
            case 3:
                error_6 = _a.sent();
                console.error('Error creating selected stock:', error_6);
                return [2 /*return*/, res.status(500).json({
                        message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.CREATE_SELECTED_STOCK_ERROR
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createSelectedStock = createSelectedStock;
/**
 * Update a selected stock
 */
var updateSelectedStock = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, data, existingStock, newSymbol, newDate, duplicateStock, result, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                id = req.params.id;
                data = req.body;
                return [4 /*yield*/, repositories_1.selectedStocksRepository.findById(id)];
            case 1:
                existingStock = _a.sent();
                if (!existingStock) {
                    return [2 /*return*/, res.status(404).json({
                            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.SELECTED_STOCK_NOT_FOUND
                        })];
                }
                // Convert date string to Date object if provided
                if (data.date && typeof data.date === 'string') {
                    data.date = new Date(data.date);
                    if (isNaN(data.date.getTime())) {
                        return [2 /*return*/, res.status(400).json({
                                message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.INVALID_DATE_FORMAT
                            })];
                    }
                }
                if (!((data.symbol && data.symbol !== existingStock.symbol) ||
                    (data.date && data.date.getTime() !== existingStock.date.getTime()))) return [3 /*break*/, 3];
                newSymbol = data.symbol || existingStock.symbol;
                newDate = data.date || existingStock.date;
                return [4 /*yield*/, repositories_1.selectedStocksRepository.findBySymbolAndDate(newSymbol, newDate)];
            case 2:
                duplicateStock = _a.sent();
                if (duplicateStock && duplicateStock.id !== id) {
                    return [2 /*return*/, res.status(409).json({
                            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.SELECTED_STOCK_ALREADY_EXISTS
                        })];
                }
                _a.label = 3;
            case 3: return [4 /*yield*/, repositories_1.selectedStocksRepository.update(id, data)];
            case 4:
                result = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.UPDATE_SELECTED_STOCK_SUCCESS,
                        data: result
                    })];
            case 5:
                error_7 = _a.sent();
                console.error("Error updating selected stock with id ".concat(req.params.id, ":"), error_7);
                return [2 /*return*/, res.status(500).json({
                        message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.UPDATE_SELECTED_STOCK_ERROR
                    })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateSelectedStock = updateSelectedStock;
/**
 * Delete a selected stock
 */
var deleteSelectedStock = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, existingStock, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, repositories_1.selectedStocksRepository.findById(id)];
            case 1:
                existingStock = _a.sent();
                if (!existingStock) {
                    return [2 /*return*/, res.status(404).json({
                            message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.SELECTED_STOCK_NOT_FOUND
                        })];
                }
                return [4 /*yield*/, repositories_1.selectedStocksRepository.delete(id)];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.DELETE_SELECTED_STOCK_SUCCESS
                    })];
            case 3:
                error_8 = _a.sent();
                console.error("Error deleting selected stock with id ".concat(req.params.id, ":"), error_8);
                return [2 /*return*/, res.status(500).json({
                        message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.DELETE_SELECTED_STOCK_ERROR
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteSelectedStock = deleteSelectedStock;
/**
 * Delete multiple selected stocks
 */
var deleteMultipleSelectedStocks = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, count, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                ids = req.body.ids;
                if (!ids || !Array.isArray(ids) || ids.length === 0) {
                    return [2 /*return*/, res.status(400).json({
                            message: 'Invalid or empty ids array'
                        })];
                }
                return [4 /*yield*/, repositories_1.selectedStocksRepository.deleteMany(ids)];
            case 1:
                count = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        message: "".concat(count, " selected stock(s) deleted successfully")
                    })];
            case 2:
                error_9 = _a.sent();
                console.error('Error deleting multiple selected stocks:', error_9);
                return [2 /*return*/, res.status(500).json({
                        message: selectedStocks_constants_1.SELECTED_STOCKS_MESSAGES.DELETE_SELECTED_STOCK_ERROR
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteMultipleSelectedStocks = deleteMultipleSelectedStocks;
