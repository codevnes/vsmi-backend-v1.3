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
exports.getProfile = exports.refreshToken = exports.login = exports.register = void 0;
var utils_1 = require("../utils");
var services_1 = require("../services");
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, fullName, phone, emailRegex, result, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Kiểm tra req.body tồn tại
                if (!req.body) {
                    res.status(400).json({
                        message: utils_1.AUTH_MESSAGES.REQUIRED_FIELDS
                    });
                    return [2 /*return*/];
                }
                _a = req.body, email = _a.email, password = _a.password, fullName = _a.fullName, phone = _a.phone;
                // Validate required fields
                if (!email || !password || !fullName) {
                    res.status(400).json({
                        message: utils_1.AUTH_MESSAGES.REQUIRED_FIELDS
                    });
                    return [2 /*return*/];
                }
                emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    res.status(400).json({
                        message: utils_1.AUTH_MESSAGES.INVALID_EMAIL
                    });
                    return [2 /*return*/];
                }
                // Validate password strength
                if (password.length < 6) {
                    res.status(400).json({
                        message: utils_1.AUTH_MESSAGES.WEAK_PASSWORD
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, services_1.authService.register({ email: email, password: password, fullName: fullName, phone: phone })];
            case 1:
                result = _b.sent();
                // Trả về kết quả
                res.status(201).json(__assign({ message: utils_1.AUTH_MESSAGES.REGISTRATION_SUCCESS }, result));
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error('Registration error:', error_1);
                // Xử lý từng loại lỗi cụ thể
                if (error_1 instanceof Error && error_1.message === 'EMAIL_IN_USE') {
                    res.status(400).json({
                        message: utils_1.AUTH_MESSAGES.EMAIL_IN_USE
                    });
                    return [2 /*return*/];
                }
                res.status(500).json({
                    message: utils_1.AUTH_MESSAGES.REGISTRATION_FAILED
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, result, serviceError_1, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                // Kiểm tra req.body tồn tại
                if (!req.body) {
                    res.status(400).json({
                        message: utils_1.AUTH_MESSAGES.LOGIN_REQUIRED_FIELDS
                    });
                    return [2 /*return*/];
                }
                _a = req.body, email = _a.email, password = _a.password;
                // Validate required fields
                if (!email || !password) {
                    res.status(400).json({
                        message: utils_1.AUTH_MESSAGES.LOGIN_REQUIRED_FIELDS
                    });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.authService.login({ email: email, password: password })];
            case 2:
                result = _b.sent();
                res.status(200).json(__assign({ message: utils_1.AUTH_MESSAGES.LOGIN_SUCCESS }, result));
                return [3 /*break*/, 4];
            case 3:
                serviceError_1 = _b.sent();
                if (serviceError_1 instanceof Error) {
                    if (serviceError_1.message === 'ACCOUNT_NOT_FOUND') {
                        res.status(404).json({
                            message: utils_1.AUTH_MESSAGES.ACCOUNT_NOT_FOUND
                        });
                        return [2 /*return*/];
                    }
                    if (serviceError_1.message === 'INVALID_PASSWORD') {
                        res.status(401).json({
                            message: utils_1.AUTH_MESSAGES.INVALID_PASSWORD
                        });
                        return [2 /*return*/];
                    }
                }
                throw serviceError_1;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                console.error('Login error:', error_2);
                res.status(500).json({
                    message: utils_1.AUTH_MESSAGES.LOGIN_FAILED
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var refreshToken = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, result, serviceError_2, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                // Kiểm tra req.body tồn tại
                if (!req.body) {
                    res.status(400).json({
                        message: utils_1.AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED
                    });
                    return [2 /*return*/];
                }
                token = req.body.refreshToken;
                if (!token) {
                    res.status(400).json({
                        message: utils_1.AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED
                    });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.authService.refreshToken(token)];
            case 2:
                result = _a.sent();
                res.status(200).json(__assign({ message: utils_1.AUTH_MESSAGES.REFRESH_TOKEN_SUCCESS }, result));
                return [3 /*break*/, 4];
            case 3:
                serviceError_2 = _a.sent();
                if (serviceError_2 instanceof Error) {
                    if (serviceError_2.message === 'USER_NOT_FOUND') {
                        res.status(404).json({
                            message: utils_1.AUTH_MESSAGES.USER_NOT_FOUND
                        });
                        return [2 /*return*/];
                    }
                    if (serviceError_2.message === 'REFRESH_TOKEN_INVALID') {
                        res.status(401).json({
                            message: utils_1.AUTH_MESSAGES.REFRESH_TOKEN_INVALID
                        });
                        return [2 /*return*/];
                    }
                }
                throw serviceError_2;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_3 = _a.sent();
                console.error('Refresh token error:', error_3);
                res.status(500).json({
                    message: utils_1.AUTH_MESSAGES.SYSTEM_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.refreshToken = refreshToken;
var getProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, serviceError_3, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!req.userId) {
                    res.status(401).json({
                        message: utils_1.AUTH_MESSAGES.UNAUTHORIZED
                    });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.authService.getProfile(req.userId)];
            case 2:
                result = _a.sent();
                res.status(200).json(__assign({ message: utils_1.AUTH_MESSAGES.PROFILE_SUCCESS }, result));
                return [3 /*break*/, 4];
            case 3:
                serviceError_3 = _a.sent();
                if (serviceError_3 instanceof Error && serviceError_3.message === 'USER_NOT_FOUND') {
                    res.status(404).json({
                        message: utils_1.AUTH_MESSAGES.USER_NOT_FOUND
                    });
                    return [2 /*return*/];
                }
                throw serviceError_3;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_4 = _a.sent();
                console.error('Get profile error:', error_4);
                res.status(500).json({
                    message: utils_1.AUTH_MESSAGES.PROFILE_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getProfile = getProfile;
