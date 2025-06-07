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
exports.FScoreController = void 0;
var fscore_service_1 = require("../services/fscore.service");
var fscore_constants_1 = require("../utils/fscore.constants");
var FScoreController = /** @class */ (function () {
    function FScoreController() {
        var _this = this;
        /**
         * Get all FScores
         */
        this.getAll = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var fscores, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.fscoreService.getAll()];
                    case 1:
                        fscores = _a.sent();
                        res.status(200).json({
                            message: fscore_constants_1.FSCORE_MESSAGES.GET_FSCORES_SUCCESS,
                            data: fscores
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error getting all FScores:', error_1);
                        res.status(500).json({
                            message: fscore_constants_1.FSCORE_MESSAGES.GET_FSCORES_ERROR
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Get FScore by ID
         */
        this.getById = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var id, fscore, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, this.fscoreService.getById(id)];
                    case 1:
                        fscore = _a.sent();
                        if (!fscore) {
                            res.status(404).json({
                                message: fscore_constants_1.FSCORE_MESSAGES.FSCORE_NOT_FOUND
                            });
                            return [2 /*return*/];
                        }
                        res.status(200).json({
                            message: fscore_constants_1.FSCORE_MESSAGES.GET_FSCORE_SUCCESS,
                            data: fscore
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error getting FScore by ID:', error_2);
                        res.status(500).json({
                            message: fscore_constants_1.FSCORE_MESSAGES.GET_FSCORE_ERROR
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Get FScore by symbol
         */
        this.getBySymbol = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var symbol, fscore, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        symbol = req.params.symbol;
                        return [4 /*yield*/, this.fscoreService.getBySymbol(symbol)];
                    case 1:
                        fscore = _a.sent();
                        if (!fscore) {
                            res.status(404).json({
                                message: fscore_constants_1.FSCORE_MESSAGES.FSCORE_NOT_FOUND_FOR_SYMBOL
                            });
                            return [2 /*return*/];
                        }
                        res.status(200).json({
                            message: fscore_constants_1.FSCORE_MESSAGES.GET_FSCORE_SUCCESS,
                            data: fscore
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error getting FScore by symbol:', error_3);
                        res.status(500).json({
                            message: fscore_constants_1.FSCORE_MESSAGES.GET_FSCORE_ERROR
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Create a new FScore
         */
        this.create = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var data, existing, fscore, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        data = req.body;
                        // Validate required fields
                        if (!data.symbol) {
                            res.status(400).json({
                                message: fscore_constants_1.FSCORE_MESSAGES.SYMBOL_REQUIRED
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.fscoreService.getBySymbol(data.symbol)];
                    case 1:
                        existing = _a.sent();
                        if (existing) {
                            res.status(409).json({
                                message: fscore_constants_1.FSCORE_MESSAGES.FSCORE_ALREADY_EXISTS
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.fscoreService.create(data)];
                    case 2:
                        fscore = _a.sent();
                        res.status(201).json({
                            message: fscore_constants_1.FSCORE_MESSAGES.CREATE_FSCORE_SUCCESS,
                            data: fscore
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Error creating FScore:', error_4);
                        res.status(500).json({
                            message: fscore_constants_1.FSCORE_MESSAGES.CREATE_FSCORE_ERROR
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Update FScore by ID
         */
        this.update = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var id, data, existingFScore, updatedFScore, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        id = req.params.id;
                        data = req.body;
                        return [4 /*yield*/, this.fscoreService.getById(id)];
                    case 1:
                        existingFScore = _a.sent();
                        if (!existingFScore) {
                            res.status(404).json({
                                message: fscore_constants_1.FSCORE_MESSAGES.FSCORE_NOT_FOUND
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.fscoreService.update(id, data)];
                    case 2:
                        updatedFScore = _a.sent();
                        res.status(200).json({
                            message: fscore_constants_1.FSCORE_MESSAGES.UPDATE_FSCORE_SUCCESS,
                            data: updatedFScore
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        console.error('Error updating FScore:', error_5);
                        res.status(500).json({
                            message: fscore_constants_1.FSCORE_MESSAGES.UPDATE_FSCORE_ERROR
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Update FScore by symbol
         */
        this.updateBySymbol = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var symbol, data, existingFScore, updatedFScore, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        symbol = req.params.symbol;
                        data = req.body;
                        return [4 /*yield*/, this.fscoreService.getBySymbol(symbol)];
                    case 1:
                        existingFScore = _a.sent();
                        if (!existingFScore) {
                            res.status(404).json({
                                message: fscore_constants_1.FSCORE_MESSAGES.FSCORE_NOT_FOUND_FOR_SYMBOL
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.fscoreService.updateBySymbol(symbol, data)];
                    case 2:
                        updatedFScore = _a.sent();
                        res.status(200).json({
                            message: fscore_constants_1.FSCORE_MESSAGES.UPDATE_FSCORE_SUCCESS,
                            data: updatedFScore
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _a.sent();
                        console.error('Error updating FScore by symbol:', error_6);
                        res.status(500).json({
                            message: fscore_constants_1.FSCORE_MESSAGES.UPDATE_FSCORE_ERROR
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Delete FScore by ID
         */
        this.delete = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var id, existingFScore, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        id = req.params.id;
                        return [4 /*yield*/, this.fscoreService.getById(id)];
                    case 1:
                        existingFScore = _a.sent();
                        if (!existingFScore) {
                            res.status(404).json({
                                message: fscore_constants_1.FSCORE_MESSAGES.FSCORE_NOT_FOUND
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.fscoreService.delete(id)];
                    case 2:
                        _a.sent();
                        res.status(200).json({
                            message: fscore_constants_1.FSCORE_MESSAGES.DELETE_FSCORE_SUCCESS
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_7 = _a.sent();
                        console.error('Error deleting FScore:', error_7);
                        res.status(500).json({
                            message: fscore_constants_1.FSCORE_MESSAGES.DELETE_FSCORE_ERROR
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Delete FScore by symbol
         */
        this.deleteBySymbol = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var symbol, existingFScore, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        symbol = req.params.symbol;
                        return [4 /*yield*/, this.fscoreService.getBySymbol(symbol)];
                    case 1:
                        existingFScore = _a.sent();
                        if (!existingFScore) {
                            res.status(404).json({
                                message: fscore_constants_1.FSCORE_MESSAGES.FSCORE_NOT_FOUND_FOR_SYMBOL
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.fscoreService.deleteBySymbol(symbol)];
                    case 2:
                        _a.sent();
                        res.status(200).json({
                            message: fscore_constants_1.FSCORE_MESSAGES.DELETE_FSCORE_SUCCESS
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _a.sent();
                        console.error('Error deleting FScore by symbol:', error_8);
                        res.status(500).json({
                            message: fscore_constants_1.FSCORE_MESSAGES.DELETE_FSCORE_ERROR
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Create or update FScore by symbol
         */
        this.upsert = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var symbol, data, fscore, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        symbol = req.params.symbol;
                        data = req.body;
                        return [4 /*yield*/, this.fscoreService.upsert(symbol, __assign(__assign({}, data), { symbol: symbol }))];
                    case 1:
                        fscore = _a.sent();
                        res.status(200).json({
                            message: fscore_constants_1.FSCORE_MESSAGES.UPSERT_FSCORE_SUCCESS,
                            data: fscore
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        console.error('Error upserting FScore:', error_9);
                        res.status(500).json({
                            message: fscore_constants_1.FSCORE_MESSAGES.UPSERT_FSCORE_ERROR
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.fscoreService = new fscore_service_1.FScoreService();
    }
    return FScoreController;
}());
exports.FScoreController = FScoreController;
