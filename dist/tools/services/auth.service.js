"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = require("../config");
var repositories_1 = require("../repositories");
var client_1 = require("@prisma/client");
var AuthService = /** @class */ (function () {
    function AuthService() {
    }
    /**
     * Đăng ký người dùng mới
     */
    AuthService.prototype.register = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, hashedPassword, userData, newUser, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.userRepository.findByEmail(data.email)];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser) {
                            throw new Error('EMAIL_IN_USE');
                        }
                        return [4 /*yield*/, bcrypt_1.default.hash(data.password, 10)];
                    case 2:
                        hashedPassword = _a.sent();
                        userData = {
                            email: data.email,
                            fullName: data.fullName,
                            password: hashedPassword,
                            phone: data.phone || null,
                            role: client_1.Role.USER,
                        };
                        return [4 /*yield*/, repositories_1.userRepository.create(userData)];
                    case 3:
                        newUser = _a.sent();
                        token = this.generateToken(newUser.id, newUser.role);
                        return [2 /*return*/, {
                                user: {
                                    id: newUser.id,
                                    email: newUser.email,
                                    fullName: newUser.fullName,
                                    role: newUser.role,
                                },
                                token: token,
                            }];
                }
            });
        });
    };
    /**
     * Đăng nhập người dùng
     */
    AuthService.prototype.login = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isPasswordValid, token, refreshToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.userRepository.findByEmail(data.email)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('ACCOUNT_NOT_FOUND');
                        }
                        return [4 /*yield*/, bcrypt_1.default.compare(data.password, user.password)];
                    case 2:
                        isPasswordValid = _a.sent();
                        if (!isPasswordValid) {
                            throw new Error('INVALID_PASSWORD');
                        }
                        token = this.generateToken(user.id, user.role);
                        refreshToken = this.generateRefreshToken(user.id);
                        return [2 /*return*/, {
                                user: {
                                    id: user.id,
                                    email: user.email,
                                    fullName: user.fullName,
                                    role: user.role,
                                },
                                token: token,
                                refreshToken: refreshToken,
                            }];
                }
            });
        });
    };
    /**
     * Làm mới token
     */
    AuthService.prototype.refreshToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var decoded, user, newToken, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        decoded = jsonwebtoken_1.default.verify(token, config_1.authConfig.jwtSecret);
                        return [4 /*yield*/, repositories_1.userRepository.findById(decoded.id)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('USER_NOT_FOUND');
                        }
                        newToken = this.generateToken(user.id, user.role);
                        return [2 /*return*/, { token: newToken }];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error('REFRESH_TOKEN_INVALID');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Lấy thông tin người dùng
     */
    AuthService.prototype.getProfile = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.userRepository.getUserProfile(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('USER_NOT_FOUND');
                        }
                        return [2 /*return*/, { user: user }];
                }
            });
        });
    };
    /**
     * Tạo JWT token
     */
    AuthService.prototype.generateToken = function (userId, role) {
        return jsonwebtoken_1.default.sign({ id: userId, role: role }, config_1.authConfig.jwtSecret, { expiresIn: config_1.authConfig.jwtExpiration });
    };
    /**
     * Tạo refresh token
     */
    AuthService.prototype.generateRefreshToken = function (userId) {
        return jsonwebtoken_1.default.sign({ id: userId }, config_1.authConfig.jwtSecret, { expiresIn: config_1.authConfig.jwtRefreshExpiration });
    };
    return AuthService;
}());
exports.AuthService = AuthService;
