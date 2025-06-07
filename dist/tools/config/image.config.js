"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageConfig = void 0;
var path_1 = __importDefault(require("path"));
exports.imageConfig = {
    uploadDir: path_1.default.join(process.cwd(), 'public/uploads'),
    imageDir: path_1.default.join(process.cwd(), 'public/images'),
    processedImageDir: path_1.default.join(process.cwd(), 'public/images'),
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    baseUrl: process.env.IMAGE_BASE_URL || 'http://localhost:3000/images'
};
