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
exports.upsertStockProfile = exports.deleteStockProfile = exports.updateStockProfile = exports.createStockProfile = exports.getStockProfileBySymbol = exports.getAllStockProfiles = void 0;
var services_1 = require("../services");
var stockProfile_constants_1 = require("../utils/stockProfile.constants");
/**
 * Get all stock profiles with pagination and filtering options
 */
var getAllStockProfiles = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, limit, search, result, error_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _a = req.query, _b = _a.page, page = _b === void 0 ? '1' : _b, _c = _a.limit, limit = _c === void 0 ? '10' : _c, search = _a.search;
                return [4 /*yield*/, services_1.stockProfileService.getStockProfiles({
                        page: parseInt(page),
                        limit: parseInt(limit),
                        search: search,
                    })];
            case 1:
                result = _d.sent();
                return [2 /*return*/, res.status(200).json(__assign({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.GET_PROFILES_SUCCESS }, result))];
            case 2:
                error_1 = _d.sent();
                console.error('Error fetching stock profiles:', error_1);
                return [2 /*return*/, res.status(500).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.GET_PROFILES_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllStockProfiles = getAllStockProfiles;
/**
 * Get stock profile by symbol
 */
var getStockProfileBySymbol = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var symbol, profile, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                symbol = req.params.symbol;
                return [4 /*yield*/, services_1.stockProfileService.getStockProfileBySymbol(symbol)];
            case 1:
                profile = _a.sent();
                if (!profile) {
                    return [2 /*return*/, res.status(404).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.PROFILE_NOT_FOUND })];
                }
                return [2 /*return*/, res.status(200).json({
                        message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.GET_PROFILE_SUCCESS,
                        data: profile,
                    })];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching stock profile:', error_2);
                return [2 /*return*/, res.status(500).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.GET_PROFILE_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getStockProfileBySymbol = getStockProfileBySymbol;
/**
 * Create a new stock profile
 */
var createStockProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, symbol, price, profit, volume, pe, eps, roa, roe, profile, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, symbol = _a.symbol, price = _a.price, profit = _a.profit, volume = _a.volume, pe = _a.pe, eps = _a.eps, roa = _a.roa, roe = _a.roe;
                if (!symbol) {
                    return [2 /*return*/, res.status(400).json({ message: 'Symbol is required' })];
                }
                return [4 /*yield*/, services_1.stockProfileService.createStockProfile({
                        symbol: symbol,
                        price: price,
                        profit: profit,
                        volume: volume,
                        pe: pe,
                        eps: eps,
                        roa: roa,
                        roe: roe,
                    })];
            case 1:
                profile = _b.sent();
                return [2 /*return*/, res.status(201).json({
                        message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.CREATE_PROFILE_SUCCESS,
                        data: profile,
                    })];
            case 2:
                error_3 = _b.sent();
                console.error('Error creating stock profile:', error_3);
                if (error_3.message.includes('not found')) {
                    return [2 /*return*/, res.status(404).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.STOCK_NOT_FOUND })];
                }
                if (error_3.message.includes('already exists')) {
                    return [2 /*return*/, res.status(409).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.PROFILE_ALREADY_EXISTS })];
                }
                return [2 /*return*/, res.status(500).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.CREATE_PROFILE_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createStockProfile = createStockProfile;
/**
 * Update existing stock profile
 */
var updateStockProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var symbol, _a, price, profit, volume, pe, eps, roa, roe, profile, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                symbol = req.params.symbol;
                _a = req.body, price = _a.price, profit = _a.profit, volume = _a.volume, pe = _a.pe, eps = _a.eps, roa = _a.roa, roe = _a.roe;
                return [4 /*yield*/, services_1.stockProfileService.updateStockProfile(symbol, {
                        price: price,
                        profit: profit,
                        volume: volume,
                        pe: pe,
                        eps: eps,
                        roa: roa,
                        roe: roe,
                    })];
            case 1:
                profile = _b.sent();
                return [2 /*return*/, res.status(200).json({
                        message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.UPDATE_PROFILE_SUCCESS,
                        data: profile,
                    })];
            case 2:
                error_4 = _b.sent();
                console.error('Error updating stock profile:', error_4);
                if (error_4.message.includes('not found')) {
                    return [2 /*return*/, res.status(404).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.PROFILE_NOT_FOUND })];
                }
                return [2 /*return*/, res.status(500).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.UPDATE_PROFILE_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateStockProfile = updateStockProfile;
/**
 * Delete a stock profile
 */
var deleteStockProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var symbol, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                symbol = req.params.symbol;
                return [4 /*yield*/, services_1.stockProfileService.deleteStockProfile(symbol)];
            case 1:
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.DELETE_PROFILE_SUCCESS,
                    })];
            case 2:
                error_5 = _a.sent();
                console.error('Error deleting stock profile:', error_5);
                if (error_5.message.includes('not found')) {
                    return [2 /*return*/, res.status(404).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.PROFILE_NOT_FOUND })];
                }
                return [2 /*return*/, res.status(500).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.DELETE_PROFILE_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteStockProfile = deleteStockProfile;
/**
 * Upsert stock profile (create if not exists, update if exists)
 */
var upsertStockProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, symbol, price, profit, volume, pe, eps, roa, roe, profile, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, symbol = _a.symbol, price = _a.price, profit = _a.profit, volume = _a.volume, pe = _a.pe, eps = _a.eps, roa = _a.roa, roe = _a.roe;
                if (!symbol) {
                    return [2 /*return*/, res.status(400).json({ message: 'Symbol is required' })];
                }
                return [4 /*yield*/, services_1.stockProfileService.upsertStockProfile({
                        symbol: symbol,
                        price: price,
                        profit: profit,
                        volume: volume,
                        pe: pe,
                        eps: eps,
                        roa: roa,
                        roe: roe,
                    })];
            case 1:
                profile = _b.sent();
                return [2 /*return*/, res.status(200).json({
                        message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.UPSERT_PROFILE_SUCCESS,
                        data: profile,
                    })];
            case 2:
                error_6 = _b.sent();
                console.error('Error upserting stock profile:', error_6);
                if (error_6.message.includes('not found')) {
                    return [2 /*return*/, res.status(404).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.STOCK_NOT_FOUND })];
                }
                return [2 /*return*/, res.status(500).json({ message: stockProfile_constants_1.STOCK_PROFILE_MESSAGES.UPSERT_PROFILE_ERROR })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.upsertStockProfile = upsertStockProfile;
