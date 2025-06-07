"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
// Tất cả các routes đều yêu cầu xác thực
router.use(middlewares_1.verifyToken);
// Routes quản lý người dùng - chỉ cho admin
router.get('/', middlewares_1.isAdmin, controllers_1.getAllUsers);
router.get('/:id', middlewares_1.isAdmin, controllers_1.getUserById);
router.post('/', middlewares_1.isAdmin, controllers_1.createUser);
router.put('/:id', middlewares_1.isAdmin, controllers_1.updateUser);
router.delete('/:id', middlewares_1.isAdmin, controllers_1.deleteUser);
exports.default = router;
