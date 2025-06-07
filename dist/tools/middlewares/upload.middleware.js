"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFile = exports.handleUploadErrors = exports.upload = void 0;
var multer_1 = __importDefault(require("multer"));
var config_1 = require("../config");
var utils_1 = require("../utils");
var utils_2 = require("../utils");
// Đảm bảo thư mục upload tồn tại
(0, utils_1.ensureDirectoryExists)(config_1.imageConfig.uploadDir);
(0, utils_1.ensureDirectoryExists)(config_1.imageConfig.imageDir);
(0, utils_1.ensureDirectoryExists)(config_1.imageConfig.processedImageDir);
// Cấu hình multer storage
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config_1.imageConfig.uploadDir);
    },
    filename: function (req, file, cb) {
        var fileName = (0, utils_1.generateFileName)(file.originalname);
        cb(null, fileName);
    }
});
// Cấu hình multer file filter
var fileFilter = function (req, file, cb) {
    if (!(0, utils_1.isImage)(file.mimetype)) {
        return cb(new Error(utils_2.IMAGE_MESSAGES.INVALID_FILE_TYPE));
    }
    cb(null, true);
};
// Khởi tạo multer
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: config_1.imageConfig.maxFileSize
    }
});
// Middleware xử lý lỗi từ multer
var handleUploadErrors = function (err, req, res, next) {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: utils_2.IMAGE_MESSAGES.FILE_TOO_LARGE
            });
        }
        return res.status(400).json({
            message: err.message
        });
    }
    else if (err) {
        return res.status(400).json({
            message: err.message || utils_2.IMAGE_MESSAGES.UPLOAD_IMAGE_ERROR
        });
    }
    next();
};
exports.handleUploadErrors = handleUploadErrors;
// Middleware kiểm tra file trong request
var validateFile = function (req, res, next) {
    if (!req.file) {
        res.status(400).json({
            message: utils_2.IMAGE_MESSAGES.FILE_REQUIRED
        });
        return;
    }
    next();
};
exports.validateFile = validateFile;
