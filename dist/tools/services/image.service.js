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
exports.ImageService = void 0;
var repositories_1 = require("../repositories");
var config_1 = require("../config");
var utils_1 = require("../utils");
var path_1 = __importDefault(require("path"));
var sharp_1 = __importDefault(require("sharp"));
var ImageService = /** @class */ (function () {
    function ImageService() {
    }
    /**
     * Lấy danh sách hình ảnh với phân trang
     */
    ImageService.prototype.getAllImages = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.imageRepository.findAllWithPagination(options)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                data: result.data.map(function (image) { return _this.toPublicImage(image); }),
                                pagination: result.pagination
                            }];
                }
            });
        });
    };
    /**
     * Lấy thông tin hình ảnh theo ID
     */
    ImageService.prototype.getImageById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var image;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.imageRepository.findById(id)];
                    case 1:
                        image = _a.sent();
                        if (!image) {
                            throw new Error('IMAGE_NOT_FOUND');
                        }
                        return [2 /*return*/, this.toPublicImage(image)];
                }
            });
        });
    };
    /**
     * Tạo hình ảnh mới từ file được upload
     */
    ImageService.prototype.uploadImage = function (file, altText) {
        return __awaiter(this, void 0, void 0, function () {
            var processedFileName, processedFilePath, metadata, imageData, newImage, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 6]);
                        processedFileName = "processed-".concat(file.filename);
                        processedFilePath = path_1.default.join(config_1.imageConfig.processedImageDir, processedFileName);
                        return [4 /*yield*/, (0, sharp_1.default)(file.path)
                                .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
                                .toFormat('jpeg', { quality: 80, progressive: true })
                                .toFile(processedFilePath)];
                    case 1:
                        metadata = _a.sent();
                        imageData = {
                            filename: file.filename,
                            processedFilename: processedFileName,
                            path: file.path,
                            url: "/processed/".concat(processedFileName),
                            mimetype: file.mimetype,
                            size: file.size,
                            width: metadata.width,
                            height: metadata.height,
                            altText: altText || null
                        };
                        return [4 /*yield*/, repositories_1.imageRepository.create(imageData)];
                    case 2:
                        newImage = _a.sent();
                        return [2 /*return*/, this.toPublicImage(newImage)];
                    case 3:
                        error_1 = _a.sent();
                        if (!(file && file.path)) return [3 /*break*/, 5];
                        return [4 /*yield*/, (0, utils_1.deleteFile)(file.path)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Cập nhật thông tin hình ảnh (chỉ cho phép cập nhật altText)
     */
    ImageService.prototype.updateImage = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var image, updatedImage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.imageRepository.findById(id)];
                    case 1:
                        image = _a.sent();
                        if (!image) {
                            throw new Error('IMAGE_NOT_FOUND');
                        }
                        return [4 /*yield*/, repositories_1.imageRepository.update(id, data)];
                    case 2:
                        updatedImage = _a.sent();
                        return [2 /*return*/, this.toPublicImage(updatedImage)];
                }
            });
        });
    };
    /**
     * Xóa hình ảnh
     */
    ImageService.prototype.deleteImage = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var image, isInUse, processedFilePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repositories_1.imageRepository.findById(id)];
                    case 1:
                        image = _a.sent();
                        if (!image) {
                            throw new Error('IMAGE_NOT_FOUND');
                        }
                        return [4 /*yield*/, repositories_1.imageRepository.isImageInUse(id)];
                    case 2:
                        isInUse = _a.sent();
                        if (isInUse) {
                            throw new Error('IMAGE_IN_USE');
                        }
                        if (!image.path) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, utils_1.deleteFile)(image.path)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        processedFilePath = path_1.default.join(config_1.imageConfig.processedImageDir, image.processedFilename);
                        return [4 /*yield*/, (0, utils_1.deleteFile)(processedFilePath)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, repositories_1.imageRepository.delete(id)];
                    case 6: 
                    // Xóa record trong database
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Chuyển đổi hình ảnh sang định dạng public
     */
    ImageService.prototype.toPublicImage = function (image) {
        return {
            id: image.id,
            url: image.url,
            altText: image.altText,
            width: image.width,
            height: image.height,
            createdAt: image.createdAt
        };
    };
    return ImageService;
}());
exports.ImageService = ImageService;
