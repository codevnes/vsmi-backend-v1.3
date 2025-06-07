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
exports.UserService = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var client_1 = require("@prisma/client");
var repositories_1 = require("../repositories");
var UserService = /** @class */ (function () {
    function UserService() {
    }
    /**
     * Lấy danh sách người dùng không phân trang (đã cũ)
     */
    UserService.prototype.getAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.userRepository.findAll()];
                    case 1:
                        users = _a.sent();
                        return [2 /*return*/, users.map(function (user) { return _this.toPublicUser(user); })];
                }
            });
        });
    };
    /**
     * Lấy danh sách người dùng với phân trang
     */
    UserService.prototype.getUsersWithPagination = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.userRepository.findAllWithPagination(options)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                data: result.data.map(function (user) { return _this.toPublicUser(user); }),
                                pagination: result.pagination
                            }];
                }
            });
        });
    };
    /**
     * Lấy thông tin một người dùng
     */
    UserService.prototype.getUserById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.userRepository.findById(id)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('USER_NOT_FOUND');
                        }
                        return [2 /*return*/, this.toPublicUser(user)];
                }
            });
        });
    };
    /**
     * Tạo người dùng mới
     */
    UserService.prototype.createUser = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, hashedPassword, userData, newUser;
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
                            role: data.role || client_1.Role.USER,
                        };
                        return [4 /*yield*/, repositories_1.userRepository.create(userData)];
                    case 3:
                        newUser = _a.sent();
                        return [2 /*return*/, this.toPublicUser(newUser)];
                }
            });
        });
    };
    /**
     * Cập nhật thông tin người dùng
     */
    UserService.prototype.updateUser = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, updateData, _a, updatedUser;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, repositories_1.userRepository.findById(id)];
                    case 1:
                        existingUser = _b.sent();
                        if (!existingUser) {
                            throw new Error('USER_NOT_FOUND');
                        }
                        updateData = {};
                        if (data.fullName)
                            updateData.fullName = data.fullName;
                        if (data.phone !== undefined)
                            updateData.phone = data.phone;
                        if (data.role)
                            updateData.role = data.role;
                        if (!data.password) return [3 /*break*/, 3];
                        _a = updateData;
                        return [4 /*yield*/, bcrypt_1.default.hash(data.password, 10)];
                    case 2:
                        _a.password = _b.sent();
                        _b.label = 3;
                    case 3: return [4 /*yield*/, repositories_1.userRepository.update(id, updateData)];
                    case 4:
                        updatedUser = _b.sent();
                        return [2 /*return*/, this.toPublicUser(updatedUser)];
                }
            });
        });
    };
    /**
     * Xóa người dùng
     */
    UserService.prototype.deleteUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.userRepository.findById(id)];
                    case 1:
                        existingUser = _a.sent();
                        if (!existingUser) {
                            throw new Error('USER_NOT_FOUND');
                        }
                        return [4 /*yield*/, repositories_1.userRepository.delete(id)];
                    case 2: 
                    // Xóa người dùng
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Chuyển đổi thông tin người dùng để trả về cho client
     */
    UserService.prototype.toPublicUser = function (user) {
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            role: user.role,
            verified: user.verified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    };
    return UserService;
}());
exports.UserService = UserService;
