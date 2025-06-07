"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDirectoryExists = exports.deleteFile = exports.isImage = exports.generateFileName = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const util_1 = require("util");
const unlinkAsync = (0, util_1.promisify)(fs_1.default.unlink);
/**
 * Tạo tên file ngẫu nhiên để tránh trùng lặp
 *
 * @param originalname Tên file gốc
 * @returns Tên file đã xử lý
 */
const generateFileName = (originalname) => {
    const timestamp = Date.now().toString();
    const randomString = crypto_1.default.randomBytes(8).toString('hex');
    const ext = path_1.default.extname(originalname);
    const fileName = `${timestamp}-${randomString}${ext}`;
    return fileName;
};
exports.generateFileName = generateFileName;
/**
 * Kiểm tra file có phải là hình ảnh không
 *
 * @param mimetype MIME type của file
 * @returns boolean
 */
const isImage = (mimetype) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    return allowedMimeTypes.includes(mimetype);
};
exports.isImage = isImage;
/**
 * Xóa file
 *
 * @param filePath Đường dẫn đến file cần xóa
 */
const deleteFile = async (filePath) => {
    try {
        if (fs_1.default.existsSync(filePath)) {
            await unlinkAsync(filePath);
        }
    }
    catch (error) {
        console.error('Error deleting file:', error);
    }
};
exports.deleteFile = deleteFile;
/**
 * Tạo thư mục nếu chưa tồn tại
 *
 * @param dirPath Đường dẫn thư mục
 */
const ensureDirectoryExists = (dirPath) => {
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, { recursive: true });
    }
};
exports.ensureDirectoryExists = ensureDirectoryExists;
