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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
var services_1 = require("../services");
var utils_1 = require("../utils");
/**
 * Lấy danh sách người dùng với phân trang và tìm kiếm
 */
var getAllUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var page, limit, sort, order, search, role, verified, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                page = req.query.page ? parseInt(req.query.page) : 1;
                limit = req.query.limit ? parseInt(req.query.limit) : 10;
                sort = req.query.sort || 'createdAt';
                order = req.query.order || 'desc';
                search = req.query.search || '';
                role = req.query.role;
                verified = req.query.verified
                    ? req.query.verified === 'true'
                    : undefined;
                // Validate page và limit
                if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
                    res.status(400).json({
                        message: utils_1.USER_MESSAGES.INVALID_PAGINATION
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, services_1.userService.getUsersWithPagination({
                        page: page,
                        limit: limit,
                        sort: sort,
                        order: order,
                        search: search,
                        role: role,
                        verified: verified
                    })];
            case 1:
                result = _a.sent();
                res.status(200).json({
                    message: utils_1.USER_MESSAGES.GET_USERS_SUCCESS,
                    users: result.data,
                    pagination: result.pagination
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Get all users error:', error_1);
                res.status(500).json({
                    message: utils_1.USER_MESSAGES.GET_USERS_ERROR
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllUsers = getAllUsers;
/**
 * Lấy thông tin người dùng theo ID
 */
var getUserById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, serviceError_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.userService.getUserById(id)];
            case 2:
                user = _a.sent();
                res.status(200).json({
                    message: utils_1.USER_MESSAGES.GET_USER_SUCCESS,
                    user: user
                });
                return [3 /*break*/, 4];
            case 3:
                serviceError_1 = _a.sent();
                if (serviceError_1 instanceof Error && serviceError_1.message === 'USER_NOT_FOUND') {
                    res.status(404).json({
                        message: utils_1.USER_MESSAGES.USER_NOT_FOUND
                    });
                    return [2 /*return*/];
                }
                throw serviceError_1;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                console.error('Get user by ID error:', error_2);
                res.status(500).json({
                    message: utils_1.USER_MESSAGES.GET_USERS_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getUserById = getUserById;
/**
 * Tạo người dùng mới
 */
var createUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, fullName, phone, role, emailRegex, user, serviceError_2, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                // Kiểm tra req.body tồn tại
                if (!req.body) {
                    res.status(400).json({
                        message: utils_1.USER_MESSAGES.REQUIRED_FIELDS
                    });
                    return [2 /*return*/];
                }
                _a = req.body, email = _a.email, password = _a.password, fullName = _a.fullName, phone = _a.phone, role = _a.role;
                // Validate các trường bắt buộc
                if (!email || !password || !fullName) {
                    res.status(400).json({
                        message: utils_1.USER_MESSAGES.REQUIRED_FIELDS
                    });
                    return [2 /*return*/];
                }
                emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    res.status(400).json({
                        message: utils_1.USER_MESSAGES.INVALID_USER_DATA
                    });
                    return [2 /*return*/];
                }
                // Validate mật khẩu
                if (password.length < 6) {
                    res.status(400).json({
                        message: utils_1.USER_MESSAGES.INVALID_USER_DATA
                    });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.userService.createUser({
                        email: email,
                        password: password,
                        fullName: fullName,
                        phone: phone,
                        role: role
                    })];
            case 2:
                user = _b.sent();
                res.status(201).json({
                    message: utils_1.USER_MESSAGES.CREATE_USER_SUCCESS,
                    user: user
                });
                return [3 /*break*/, 4];
            case 3:
                serviceError_2 = _b.sent();
                if (serviceError_2 instanceof Error && serviceError_2.message === 'EMAIL_IN_USE') {
                    res.status(400).json({
                        message: utils_1.USER_MESSAGES.EMAIL_IN_USE
                    });
                    return [2 /*return*/];
                }
                throw serviceError_2;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_3 = _b.sent();
                console.error('Create user error:', error_3);
                res.status(500).json({
                    message: utils_1.USER_MESSAGES.CREATE_USER_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createUser = createUser;
/**
 * Cập nhật thông tin người dùng
 */
var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, fullName, phone, password, role, user, serviceError_3, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                id = req.params.id;
                // Kiểm tra req.body tồn tại
                if (!req.body) {
                    res.status(400).json({
                        message: utils_1.USER_MESSAGES.INVALID_USER_DATA
                    });
                    return [2 /*return*/];
                }
                _a = req.body, fullName = _a.fullName, phone = _a.phone, password = _a.password, role = _a.role;
                // Phải có ít nhất một trường để cập nhật
                if (!fullName && phone === undefined && !password && !role) {
                    res.status(400).json({
                        message: utils_1.USER_MESSAGES.INVALID_USER_DATA
                    });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.userService.updateUser(id, {
                        fullName: fullName,
                        phone: phone,
                        password: password,
                        role: role
                    })];
            case 2:
                user = _b.sent();
                res.status(200).json({
                    message: utils_1.USER_MESSAGES.UPDATE_USER_SUCCESS,
                    user: user
                });
                return [3 /*break*/, 4];
            case 3:
                serviceError_3 = _b.sent();
                if (serviceError_3 instanceof Error && serviceError_3.message === 'USER_NOT_FOUND') {
                    res.status(404).json({
                        message: utils_1.USER_MESSAGES.USER_NOT_FOUND
                    });
                    return [2 /*return*/];
                }
                throw serviceError_3;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_4 = _b.sent();
                console.error('Update user error:', error_4);
                res.status(500).json({
                    message: utils_1.USER_MESSAGES.UPDATE_USER_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
/**
 * Xóa người dùng
 */
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, serviceError_4, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                id = req.params.id;
                // Kiểm tra không cho phép xóa chính mình
                if (req.userId === id) {
                    res.status(400).json({
                        message: utils_1.USER_MESSAGES.CANNOT_DELETE_SELF
                    });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.userService.deleteUser(id)];
            case 2:
                _a.sent();
                res.status(200).json({
                    message: utils_1.USER_MESSAGES.DELETE_USER_SUCCESS
                });
                return [3 /*break*/, 4];
            case 3:
                serviceError_4 = _a.sent();
                if (serviceError_4 instanceof Error && serviceError_4.message === 'USER_NOT_FOUND') {
                    res.status(404).json({
                        message: utils_1.USER_MESSAGES.USER_NOT_FOUND
                    });
                    return [2 /*return*/];
                }
                throw serviceError_4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_5 = _a.sent();
                console.error('Delete user error:', error_5);
                res.status(500).json({
                    message: utils_1.USER_MESSAGES.DELETE_USER_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;
