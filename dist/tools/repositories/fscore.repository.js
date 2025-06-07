"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FScoreRepository = void 0;
var app_1 = require("../app");
var FScoreRepository = /** @class */ (function () {
    function FScoreRepository() {
    }
    FScoreRepository.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n        SELECT * FROM \"FScore\" WHERE id = $1\n      ";
                        return [4 /*yield*/, app_1.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT * FROM \"FScore\" WHERE id = ", ""], ["SELECT * FROM \"FScore\" WHERE id = ", ""])), id)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, Array.isArray(result) && result.length > 0 ? result[0] : null];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error finding FScore by ID:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FScoreRepository.prototype.findBySymbol = function (symbol) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, app_1.prisma.$queryRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["SELECT * FROM \"FScore\" WHERE symbol = ", ""], ["SELECT * FROM \"FScore\" WHERE symbol = ", ""])), symbol)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, Array.isArray(result) && result.length > 0 ? result[0] : null];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error finding FScore by symbol:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FScoreRepository.prototype.findAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, app_1.prisma.$queryRaw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["SELECT * FROM \"FScore\" ORDER BY symbol ASC"], ["SELECT * FROM \"FScore\" ORDER BY symbol ASC"])))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error fetching all FScores:', error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FScoreRepository.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, values, columns, placeholders, query, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        keys = Object.keys(data);
                        values = Object.values(data);
                        columns = keys.map(function (k) { return "\"".concat(k, "\""); }).join(', ');
                        placeholders = keys.map(function (_, i) { return "$".concat(i + 1); }).join(', ');
                        query = "\n        INSERT INTO \"FScore\" (".concat(columns, ")\n        VALUES (").concat(placeholders, ")\n        RETURNING *\n      ");
                        return [4 /*yield*/, app_1.prisma.$queryRawUnsafe.apply(app_1.prisma, __spreadArray([query], values, false))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, Array.isArray(result) && result.length > 0 ? result[0] : null];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error creating FScore:', error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FScoreRepository.prototype.update = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var entries, sets, values, query, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        entries = Object.entries(data);
                        sets = entries.map(function (_a, i) {
                            var key = _a[0];
                            return "\"".concat(key, "\" = $").concat(i + 2);
                        }).join(', ');
                        values = __spreadArray([id], entries.map(function (_a) {
                            var _ = _a[0], value = _a[1];
                            return value;
                        }), true);
                        query = "\n        UPDATE \"FScore\"\n        SET ".concat(sets, "\n        WHERE id = $1\n        RETURNING *\n      ");
                        return [4 /*yield*/, app_1.prisma.$queryRawUnsafe.apply(app_1.prisma, __spreadArray([query], values, false))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, Array.isArray(result) && result.length > 0 ? result[0] : null];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error updating FScore by ID:', error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FScoreRepository.prototype.updateBySymbol = function (symbol, data) {
        return __awaiter(this, void 0, void 0, function () {
            var entries, sets, values, query, result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        entries = Object.entries(data);
                        sets = entries.map(function (_a, i) {
                            var key = _a[0];
                            return "\"".concat(key, "\" = $").concat(i + 2);
                        }).join(', ');
                        values = __spreadArray([symbol], entries.map(function (_a) {
                            var _ = _a[0], value = _a[1];
                            return value;
                        }), true);
                        query = "\n        UPDATE \"FScore\"\n        SET ".concat(sets, "\n        WHERE symbol = $1\n        RETURNING *\n      ");
                        return [4 /*yield*/, app_1.prisma.$queryRawUnsafe.apply(app_1.prisma, __spreadArray([query], values, false))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, Array.isArray(result) && result.length > 0 ? result[0] : null];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error updating FScore by symbol:', error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FScoreRepository.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, app_1.prisma.$queryRaw(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n        DELETE FROM \"FScore\"\n        WHERE id = ", "\n        RETURNING *\n      "], ["\n        DELETE FROM \"FScore\"\n        WHERE id = ", "\n        RETURNING *\n      "])), id)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, Array.isArray(result) && result.length > 0 ? result[0] : null];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Error deleting FScore by ID:', error_7);
                        throw error_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FScoreRepository.prototype.deleteBySymbol = function (symbol) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, app_1.prisma.$queryRaw(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n        DELETE FROM \"FScore\"\n        WHERE symbol = ", "\n        RETURNING *\n      "], ["\n        DELETE FROM \"FScore\"\n        WHERE symbol = ", "\n        RETURNING *\n      "])), symbol)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, Array.isArray(result) && result.length > 0 ? result[0] : null];
                    case 2:
                        error_8 = _a.sent();
                        console.error('Error deleting FScore by symbol:', error_8);
                        throw error_8;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FScoreRepository.prototype.upsert = function (symbol, data) {
        return __awaiter(this, void 0, void 0, function () {
            var exists, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.findBySymbol(symbol)];
                    case 1:
                        exists = _a.sent();
                        if (exists) {
                            return [2 /*return*/, this.updateBySymbol(symbol, data)];
                        }
                        else {
                            return [2 /*return*/, this.create(__assign(__assign({}, data), { symbol: symbol }))];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        console.error('Error upserting FScore:', error_9);
                        throw error_9;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return FScoreRepository;
}());
exports.FScoreRepository = FScoreRepository;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
