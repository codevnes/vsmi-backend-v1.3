"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptionPlan_controller_1 = require("../controllers/subscriptionPlan.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/', subscriptionPlan_controller_1.getAllSubscriptionPlans);
router.get('/:id', subscriptionPlan_controller_1.getSubscriptionPlanById);
// Admin only routes
router.post('/', auth_middleware_1.authenticateToken, auth_middleware_1.isAdmin, subscriptionPlan_controller_1.createSubscriptionPlan);
router.put('/:id', auth_middleware_1.authenticateToken, auth_middleware_1.isAdmin, subscriptionPlan_controller_1.updateSubscriptionPlan);
router.delete('/:id', auth_middleware_1.authenticateToken, auth_middleware_1.isAdmin, subscriptionPlan_controller_1.deleteSubscriptionPlan);
exports.default = router;
