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
exports.deleteImage = exports.updateImage = exports.uploadImage = exports.getImageById = exports.getAllImages = void 0;
var services_1 = require("../services");
var utils_1 = require("../utils");
/**
 * Lấy danh sách hình ảnh với phân trang
 */
var getAllImages = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var page, limit, sort, order, search, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                page = req.query.page ? parseInt(req.query.page) : 1;
                limit = req.query.limit ? parseInt(req.query.limit) : 10;
                sort = req.query.sort || 'createdAt';
                order = req.query.order || 'desc';
                search = req.query.search || '';
                // Validate page và limit
                if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
                    res.status(400).json({
                        message: utils_1.IMAGE_MESSAGES.INVALID_IMAGE_DATA
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, services_1.imageService.getAllImages({
                        page: page,
                        limit: limit,
                        sort: sort,
                        order: order,
                        search: search
                    })];
            case 1:
                result = _a.sent();
                res.status(200).json({
                    message: utils_1.IMAGE_MESSAGES.GET_IMAGES_SUCCESS,
                    images: result.data,
                    pagination: result.pagination
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Get all images error:', error_1);
                res.status(500).json({
                    message: utils_1.IMAGE_MESSAGES.GET_IMAGES_ERROR
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllImages = getAllImages;
/**
 * Lấy thông tin hình ảnh theo ID
 */
var getImageById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, image, serviceError_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                id = parseInt(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({
                        message: utils_1.IMAGE_MESSAGES.INVALID_IMAGE_DATA
                    });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.imageService.getImageById(id)];
            case 2:
                image = _a.sent();
                res.status(200).json({
                    message: utils_1.IMAGE_MESSAGES.GET_IMAGE_SUCCESS,
                    image: image
                });
                return [3 /*break*/, 4];
            case 3:
                serviceError_1 = _a.sent();
                if (serviceError_1 instanceof Error && serviceError_1.message === 'IMAGE_NOT_FOUND') {
                    res.status(404).json({
                        message: utils_1.IMAGE_MESSAGES.IMAGE_NOT_FOUND
                    });
                    return [2 /*return*/];
                }
                throw serviceError_1;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                console.error('Get image by ID error:', error_2);
                res.status(500).json({
                    message: utils_1.IMAGE_MESSAGES.GET_IMAGES_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getImageById = getImageById;
/**
 * Upload hình ảnh mới
 */
var uploadImage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var file, altText, image, error_3, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                file = req.file;
                altText = req.body.altText;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.imageService.uploadImage(file, altText)];
            case 2:
                image = _a.sent();
                res.status(201).json({
                    message: utils_1.IMAGE_MESSAGES.UPLOAD_IMAGE_SUCCESS,
                    image: image
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('Upload image error:', error_3);
                res.status(500).json({
                    message: utils_1.IMAGE_MESSAGES.UPLOAD_IMAGE_ERROR
                });
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                error_4 = _a.sent();
                console.error('Upload image error:', error_4);
                res.status(500).json({
                    message: utils_1.IMAGE_MESSAGES.UPLOAD_IMAGE_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.uploadImage = uploadImage;
/**
 * Cập nhật thông tin hình ảnh (chỉ cho phép cập nhật altText)
 */
var updateImage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, altText, image, serviceError_2, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                id = parseInt(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({
                        message: utils_1.IMAGE_MESSAGES.INVALID_IMAGE_DATA
                    });
                    return [2 /*return*/];
                }
                altText = req.body.altText;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.imageService.updateImage(id, { altText: altText })];
            case 2:
                image = _a.sent();
                res.status(200).json({
                    message: utils_1.IMAGE_MESSAGES.UPDATE_IMAGE_SUCCESS,
                    image: image
                });
                return [3 /*break*/, 4];
            case 3:
                serviceError_2 = _a.sent();
                if (serviceError_2 instanceof Error && serviceError_2.message === 'IMAGE_NOT_FOUND') {
                    res.status(404).json({
                        message: utils_1.IMAGE_MESSAGES.IMAGE_NOT_FOUND
                    });
                    return [2 /*return*/];
                }
                throw serviceError_2;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_5 = _a.sent();
                console.error('Update image error:', error_5);
                res.status(500).json({
                    message: utils_1.IMAGE_MESSAGES.UPDATE_IMAGE_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateImage = updateImage;
/**
 * Xóa hình ảnh
 */
var deleteImage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, serviceError_3, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                id = parseInt(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({
                        message: utils_1.IMAGE_MESSAGES.INVALID_IMAGE_DATA
                    });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, services_1.imageService.deleteImage(id)];
            case 2:
                _a.sent();
                res.status(200).json({
                    message: utils_1.IMAGE_MESSAGES.DELETE_IMAGE_SUCCESS
                });
                return [3 /*break*/, 4];
            case 3:
                serviceError_3 = _a.sent();
                if (serviceError_3 instanceof Error) {
                    switch (serviceError_3.message) {
                        case 'IMAGE_NOT_FOUND':
                            res.status(404).json({
                                message: utils_1.IMAGE_MESSAGES.IMAGE_NOT_FOUND
                            });
                            return [2 /*return*/];
                        case 'IMAGE_IN_USE':
                            res.status(400).json({
                                message: utils_1.IMAGE_MESSAGES.IMAGE_IN_USE
                            });
                            return [2 /*return*/];
                        default:
                            throw serviceError_3;
                    }
                }
                throw serviceError_3;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_6 = _a.sent();
                console.error('Delete image error:', error_6);
                res.status(500).json({
                    message: utils_1.IMAGE_MESSAGES.DELETE_IMAGE_ERROR
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.deleteImage = deleteImage;
