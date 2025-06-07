"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var controllers_1 = require("../controllers");
var middlewares_1 = require("../middlewares");
var router = (0, express_1.Router)();
// Routes công khai - không cần xác thực
router.get('/', controllers_1.getAllImages);
router.get('/:id', controllers_1.getImageById);
// Routes cần xác thực và phân quyền Admin hoặc Author
router.post('/', middlewares_1.verifyToken, middlewares_1.isAuthorOrAdmin, middlewares_1.upload.single('image'), middlewares_1.validateFile, controllers_1.uploadImage);
router.put('/:id', middlewares_1.verifyToken, middlewares_1.isAuthorOrAdmin, controllers_1.updateImage);
router.delete('/:id', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.deleteImage); // Chỉ admin mới được xóa
exports.default = router;
