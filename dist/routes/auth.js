"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', controllers_1.register);
router.post('/login', controllers_1.login);
router.post('/refresh-token', controllers_1.refreshToken);
// Protected routes
router.get('/profile', middlewares_1.verifyToken, controllers_1.getProfile);
exports.default = router;
