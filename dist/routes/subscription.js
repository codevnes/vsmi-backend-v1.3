"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscription_controller_1 = require("../controllers/subscription.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Admin routes
router.get('/', auth_middleware_1.authenticateToken, auth_middleware_1.isAdmin, subscription_controller_1.getAllSubscriptions);
// Authenticated user routes
router.get('/:id', auth_middleware_1.authenticateToken, subscription_controller_1.getSubscriptionById);
router.get('/user/:userId', auth_middleware_1.authenticateToken, subscription_controller_1.getSubscriptionsByUserId);
router.post('/', auth_middleware_1.authenticateToken, subscription_controller_1.createSubscription);
router.put('/:id', auth_middleware_1.authenticateToken, subscription_controller_1.updateSubscription);
router.patch('/:id/cancel', auth_middleware_1.authenticateToken, subscription_controller_1.cancelSubscription);
exports.default = router;
