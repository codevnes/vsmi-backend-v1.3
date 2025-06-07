"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var controllers_1 = require("../controllers");
var middlewares_1 = require("../middlewares");
var router = (0, express_1.Router)();
// Tất cả các routes đều yêu cầu xác thực
router.use(middlewares_1.verifyToken);
// Routes quản lý người dùng - chỉ cho admin
router.get('/', middlewares_1.isAdmin, controllers_1.getAllUsers);
router.get('/:id', middlewares_1.isAdmin, controllers_1.getUserById);
router.post('/', middlewares_1.isAdmin, controllers_1.createUser);
router.put('/:id', middlewares_1.isAdmin, controllers_1.updateUser);
router.delete('/:id', middlewares_1.isAdmin, controllers_1.deleteUser);
exports.default = router;
