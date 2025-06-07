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
exports.bulkCreateFinancialMetrics = exports.deleteFinancialMetrics = exports.updateFinancialMetrics = exports.createFinancialMetrics = exports.getFinancialMetricsBySymbolYearQuarter = exports.getFinancialMetricsById = exports.getFinancialMetrics = void 0;
var services_1 = require("../services");
var financialMetrics_constants_1 = require("../utils/financialMetrics.constants");
var helpers_1 = require("../utils/helpers");
/**
 * Get financial metrics with pagination
 */
var getFinancialMetrics = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, limit, symbol, year, quarter, result, error_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _a = req.query, _b = _a.page, page = _b === void 0 ? '1' : _b, _c = _a.limit, limit = _c === void 0 ? '20' : _c, symbol = _a.symbol, year = _a.year, quarter = _a.quarter;
                return [4 /*yield*/, services_1.financialMetricsService.getFinancialMetricsList({
                        symbol: symbol,
                        year: year ? parseInt(year) : undefined,
                        quarter: quarter ? parseInt(quarter) : undefined,
                        page: parseInt(page),
                        limit: parseInt(limit),
                    })];
            case 1:
                result = _d.sent();
                return [2 /*return*/, res.status(200).json(__assign({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.GET_METRICS_SUCCESS }, (0, helpers_1.bigIntSerializer)(result)))];
            case 2:
                error_1 = _d.sent();
                console.error('Error fetching financial metrics:', error_1);
                return [2 /*return*/, res.status(500).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.GET_METRICS_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getFinancialMetrics = getFinancialMetrics;
/**
 * Get financial metrics by ID
 */
var getFinancialMetricsById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, metrics, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, services_1.financialMetricsService.getFinancialMetricsById(id)];
            case 1:
                metrics = _a.sent();
                if (!metrics) {
                    return [2 /*return*/, res.status(404).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.METRICS_NOT_FOUND })];
                }
                return [2 /*return*/, res.status(200).json({
                        message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.GET_METRICS_BY_ID_SUCCESS,
                        metrics: (0, helpers_1.bigIntSerializer)(metrics)
                    })];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching financial metrics by ID:', error_2);
                return [2 /*return*/, res.status(500).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.GET_METRICS_BY_ID_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getFinancialMetricsById = getFinancialMetricsById;
/**
 * Get financial metrics by symbol, year, and quarter
 */
var getFinancialMetricsBySymbolYearQuarter = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, symbol, year, quarter, metrics, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.params, symbol = _a.symbol, year = _a.year, quarter = _a.quarter;
                return [4 /*yield*/, services_1.financialMetricsService.getFinancialMetricsBySymbolYearQuarter(symbol, parseInt(year), quarter ? parseInt(quarter) : null)];
            case 1:
                metrics = _b.sent();
                if (!metrics) {
                    return [2 /*return*/, res.status(404).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.METRICS_NOT_FOUND })];
                }
                return [2 /*return*/, res.status(200).json({
                        message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.GET_METRICS_BY_ID_SUCCESS,
                        metrics: (0, helpers_1.bigIntSerializer)(metrics)
                    })];
            case 2:
                error_3 = _b.sent();
                console.error('Error fetching financial metrics by symbol/year/quarter:', error_3);
                return [2 /*return*/, res.status(500).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.GET_METRICS_BY_ID_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getFinancialMetricsBySymbolYearQuarter = getFinancialMetricsBySymbolYearQuarter;
/**
 * Create financial metrics
 */
var createFinancialMetrics = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, symbol, year, quarter, eps, epsIndustry, pe, peIndustry, roa, roe, roaIndustry, roeIndustry, revenue, margin, totalDebtToEquity, totalAssetsToEquity, metrics, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, symbol = _a.symbol, year = _a.year, quarter = _a.quarter, eps = _a.eps, epsIndustry = _a.epsIndustry, pe = _a.pe, peIndustry = _a.peIndustry, roa = _a.roa, roe = _a.roe, roaIndustry = _a.roaIndustry, roeIndustry = _a.roeIndustry, revenue = _a.revenue, margin = _a.margin, totalDebtToEquity = _a.totalDebtToEquity, totalAssetsToEquity = _a.totalAssetsToEquity;
                if (!symbol || !year) {
                    return [2 /*return*/, res.status(400).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.REQUIRED_FIELDS })];
                }
                return [4 /*yield*/, services_1.financialMetricsService.createFinancialMetrics({
                        symbol: symbol,
                        year: parseInt(year),
                        quarter: quarter ? parseInt(quarter) : null,
                        eps: eps ? parseFloat(eps) : null,
                        epsIndustry: epsIndustry ? parseFloat(epsIndustry) : null,
                        pe: pe ? parseFloat(pe) : null,
                        peIndustry: peIndustry ? parseFloat(peIndustry) : null,
                        roa: roa ? parseFloat(roa) : null,
                        roe: roe ? parseFloat(roe) : null,
                        roaIndustry: roaIndustry ? parseFloat(roaIndustry) : null,
                        roeIndustry: roeIndustry ? parseFloat(roeIndustry) : null,
                        revenue: revenue ? parseFloat(revenue) : null,
                        margin: margin ? parseFloat(margin) : null,
                        totalDebtToEquity: totalDebtToEquity ? parseFloat(totalDebtToEquity) : null,
                        totalAssetsToEquity: totalAssetsToEquity ? parseFloat(totalAssetsToEquity) : null,
                    })];
            case 1:
                metrics = _b.sent();
                return [2 /*return*/, res.status(201).json({
                        message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.CREATE_METRICS_SUCCESS,
                        metrics: (0, helpers_1.bigIntSerializer)(metrics)
                    })];
            case 2:
                error_4 = _b.sent();
                console.error('Error creating financial metrics:', error_4);
                if (error_4 instanceof Error) {
                    if (error_4.message === 'STOCK_NOT_FOUND') {
                        return [2 /*return*/, res.status(404).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.STOCK_NOT_FOUND })];
                    }
                    if (error_4.message === 'FINANCIAL_METRICS_ALREADY_EXISTS') {
                        return [2 /*return*/, res.status(409).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.METRICS_ALREADY_EXISTS })];
                    }
                }
                return [2 /*return*/, res.status(500).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.CREATE_METRICS_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createFinancialMetrics = createFinancialMetrics;
/**
 * Update financial metrics
 */
var updateFinancialMetrics = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, eps, epsIndustry, pe, peIndustry, roa, roe, roaIndustry, roeIndustry, revenue, margin, totalDebtToEquity, totalAssetsToEquity, updateData, metrics, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.body, eps = _a.eps, epsIndustry = _a.epsIndustry, pe = _a.pe, peIndustry = _a.peIndustry, roa = _a.roa, roe = _a.roe, roaIndustry = _a.roaIndustry, roeIndustry = _a.roeIndustry, revenue = _a.revenue, margin = _a.margin, totalDebtToEquity = _a.totalDebtToEquity, totalAssetsToEquity = _a.totalAssetsToEquity;
                updateData = {};
                if (eps !== undefined)
                    updateData.eps = parseFloat(eps);
                if (epsIndustry !== undefined)
                    updateData.epsIndustry = parseFloat(epsIndustry);
                if (pe !== undefined)
                    updateData.pe = parseFloat(pe);
                if (peIndustry !== undefined)
                    updateData.peIndustry = parseFloat(peIndustry);
                if (roa !== undefined)
                    updateData.roa = parseFloat(roa);
                if (roe !== undefined)
                    updateData.roe = parseFloat(roe);
                if (roaIndustry !== undefined)
                    updateData.roaIndustry = parseFloat(roaIndustry);
                if (roeIndustry !== undefined)
                    updateData.roeIndustry = parseFloat(roeIndustry);
                if (revenue !== undefined)
                    updateData.revenue = parseFloat(revenue);
                if (margin !== undefined)
                    updateData.margin = parseFloat(margin);
                if (totalDebtToEquity !== undefined)
                    updateData.totalDebtToEquity = parseFloat(totalDebtToEquity);
                if (totalAssetsToEquity !== undefined)
                    updateData.totalAssetsToEquity = parseFloat(totalAssetsToEquity);
                return [4 /*yield*/, services_1.financialMetricsService.updateFinancialMetrics(id, updateData)];
            case 1:
                metrics = _b.sent();
                if (!metrics) {
                    return [2 /*return*/, res.status(404).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.METRICS_NOT_FOUND })];
                }
                return [2 /*return*/, res.status(200).json({
                        message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.UPDATE_METRICS_SUCCESS,
                        metrics: (0, helpers_1.bigIntSerializer)(metrics)
                    })];
            case 2:
                error_5 = _b.sent();
                console.error('Error updating financial metrics:', error_5);
                return [2 /*return*/, res.status(500).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.UPDATE_METRICS_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateFinancialMetrics = updateFinancialMetrics;
/**
 * Delete financial metrics
 */
var deleteFinancialMetrics = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, services_1.financialMetricsService.deleteFinancialMetricsById(id)];
            case 1:
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.DELETE_METRICS_SUCCESS
                    })];
            case 2:
                error_6 = _a.sent();
                console.error('Error deleting financial metrics:', error_6);
                if (error_6 instanceof Error && error_6.message === 'FINANCIAL_METRICS_NOT_FOUND') {
                    return [2 /*return*/, res.status(404).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.METRICS_NOT_FOUND })];
                }
                return [2 /*return*/, res.status(500).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.DELETE_METRICS_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteFinancialMetrics = deleteFinancialMetrics;
/**
 * Bulk create financial metrics
 */
var bulkCreateFinancialMetrics = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var financialMetrics, processedData, count, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                financialMetrics = req.body.financialMetrics;
                if (!Array.isArray(financialMetrics) || financialMetrics.length === 0) {
                    return [2 /*return*/, res.status(400).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.INVALID_DATA })];
                }
                processedData = financialMetrics.map(function (item) { return ({
                    symbol: item.symbol,
                    year: parseInt(item.year),
                    quarter: item.quarter ? parseInt(item.quarter) : null,
                    eps: item.eps ? parseFloat(item.eps) : null,
                    epsIndustry: item.epsIndustry ? parseFloat(item.epsIndustry) : null,
                    pe: item.pe ? parseFloat(item.pe) : null,
                    peIndustry: item.peIndustry ? parseFloat(item.peIndustry) : null,
                    roa: item.roa ? parseFloat(item.roa) : null,
                    roe: item.roe ? parseFloat(item.roe) : null,
                    roaIndustry: item.roaIndustry ? parseFloat(item.roaIndustry) : null,
                    roeIndustry: item.roeIndustry ? parseFloat(item.roeIndustry) : null,
                    revenue: item.revenue ? parseFloat(item.revenue) : null,
                    margin: item.margin ? parseFloat(item.margin) : null,
                    totalDebtToEquity: item.totalDebtToEquity ? parseFloat(item.totalDebtToEquity) : null,
                    totalAssetsToEquity: item.totalAssetsToEquity ? parseFloat(item.totalAssetsToEquity) : null,
                }); });
                return [4 /*yield*/, services_1.financialMetricsService.bulkCreateFinancialMetrics(processedData)];
            case 1:
                count = _a.sent();
                return [2 /*return*/, res.status(201).json({
                        message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.BULK_CREATE_SUCCESS,
                        count: (0, helpers_1.bigIntSerializer)(count)
                    })];
            case 2:
                error_7 = _a.sent();
                console.error('Error bulk creating financial metrics:', error_7);
                return [2 /*return*/, res.status(500).json({ message: financialMetrics_constants_1.FINANCIAL_METRICS_MESSAGES.BULK_CREATE_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.bulkCreateFinancialMetrics = bulkCreateFinancialMetrics;
