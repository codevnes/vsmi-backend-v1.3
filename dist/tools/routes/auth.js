"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var controllers_1 = require("../controllers");
var middlewares_1 = require("../middlewares");
var router = (0, express_1.Router)();
// Public routes
router.post('/register', controllers_1.register);
router.post('/login', controllers_1.login);
router.post('/refresh-token', controllers_1.refreshToken);
// Protected routes
router.get('/profile', middlewares_1.verifyToken, controllers_1.getProfile);
exports.default = router;
