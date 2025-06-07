"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const repositories_1 = require("../repositories");
const config_1 = require("../config");
const utils_1 = require("../utils");
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
class ImageService {
    /**
     * Lấy danh sách hình ảnh với phân trang
     */
    async getAllImages(options) {
        const result = await repositories_1.imageRepository.findAllWithPagination(options);
        return {
            data: result.data.map(image => this.toPublicImage(image)),
            pagination: result.pagination
        };
    }
    /**
     * Lấy thông tin hình ảnh theo ID
     */
    async getImageById(id) {
        const image = await repositories_1.imageRepository.findById(id);
        if (!image) {
            throw new Error('IMAGE_NOT_FOUND');
        }
        return this.toPublicImage(image);
    }
    /**
     * Tạo hình ảnh mới từ file được upload
     */
    async uploadImage(file, altText) {
        try {
            // Xử lý hình ảnh với sharp
            const processedFileName = `processed-${file.filename}`;
            const processedFilePath = path_1.default.join(config_1.imageConfig.processedImageDir, processedFileName);
            // Xử lý hình ảnh với sharp (resize, tối ưu)
            const metadata = await (0, sharp_1.default)(file.path)
                .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
                .toFormat('jpeg', { quality: 80, progressive: true })
                .toFile(processedFilePath);
            // Lưu thông tin hình ảnh vào database
            const imageData = {
                filename: file.filename,
                processedFilename: processedFileName,
                path: file.path,
                url: `/processed/${processedFileName}`,
                mimetype: file.mimetype,
                size: file.size,
                width: metadata.width,
                height: metadata.height,
                altText: altText || null
            };
            const newImage = await repositories_1.imageRepository.create(imageData);
            return this.toPublicImage(newImage);
        }
        catch (error) {
            // Xóa file đã upload nếu có lỗi
            if (file && file.path) {
                await (0, utils_1.deleteFile)(file.path);
            }
            throw error;
        }
    }
    /**
     * Cập nhật thông tin hình ảnh (chỉ cho phép cập nhật altText)
     */
    async updateImage(id, data) {
        const image = await repositories_1.imageRepository.findById(id);
        if (!image) {
            throw new Error('IMAGE_NOT_FOUND');
        }
        const updatedImage = await repositories_1.imageRepository.update(id, data);
        return this.toPublicImage(updatedImage);
    }
    /**
     * Xóa hình ảnh
     */
    async deleteImage(id) {
        const image = await repositories_1.imageRepository.findById(id);
        if (!image) {
            throw new Error('IMAGE_NOT_FOUND');
        }
        // Kiểm tra xem hình ảnh có đang được sử dụng không
        const isInUse = await repositories_1.imageRepository.isImageInUse(id);
        if (isInUse) {
            throw new Error('IMAGE_IN_USE');
        }
        // Xóa file vật lý
        if (image.path) {
            await (0, utils_1.deleteFile)(image.path);
        }
        // Xóa file xử lý
        const processedFilePath = path_1.default.join(config_1.imageConfig.processedImageDir, image.processedFilename);
        await (0, utils_1.deleteFile)(processedFilePath);
        // Xóa record trong database
        return await repositories_1.imageRepository.delete(id);
    }
    /**
     * Chuyển đổi hình ảnh sang định dạng public
     */
    toPublicImage(image) {
        return {
            id: image.id,
            url: image.url,
            altText: image.altText,
            width: image.width,
            height: image.height,
            createdAt: image.createdAt
        };
    }
}
exports.ImageService = ImageService;
