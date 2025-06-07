"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
// Routes công khai - không cần xác thực
router.get('/', controllers_1.getAllCategories);
router.get('/tree', controllers_1.getCategoryTree);
router.get('/id/:id', controllers_1.getCategoryById);
router.get('/slug/:slug', controllers_1.getCategoryBySlug);
// Routes cần xác thực và phân quyền Admin hoặc Author
router.post('/', middlewares_1.verifyToken, middlewares_1.isAuthorOrAdmin, controllers_1.createCategory);
router.put('/:id', middlewares_1.verifyToken, middlewares_1.isAuthorOrAdmin, controllers_1.updateCategory);
router.delete('/:id', middlewares_1.verifyToken, middlewares_1.isAdmin, controllers_1.deleteCategory); // Chỉ admin mới được xóa
exports.default = router;
