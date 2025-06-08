"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelSubscription = exports.updateSubscription = exports.createSubscription = exports.getSubscriptionsByUserId = exports.getSubscriptionById = exports.getAllSubscriptions = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
/**
 * Lấy danh sách đăng ký gói cước
 */
const getAllSubscriptions = async (req, res) => {
    try {
        const { page, limit, userId, status } = req.query;
        const result = await services_1.subscriptionService.getAllSubscriptions({
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
            userId: userId,
            status: status,
        });
        return res.status(200).json({
            message: utils_1.SUBSCRIPTION_MESSAGES.GET_SUBSCRIPTIONS_SUCCESS,
            subscriptions: result.data,
            pagination: result.pagination
        });
    }
    catch (error) {
        console.error("Error getting subscriptions:", error);
        return res.status(500).json({ message: utils_1.SUBSCRIPTION_MESSAGES.GET_SUBSCRIPTIONS_ERROR });
    }
};
exports.getAllSubscriptions = getAllSubscriptions;
/**
 * Lấy thông tin chi tiết đăng ký theo ID
 */
const getSubscriptionById = async (req, res) => {
    try {
        const { id } = req.params;
        try {
            const subscription = await services_1.subscriptionService.getSubscriptionById(id);
            return res.status(200).json({
                message: utils_1.SUBSCRIPTION_MESSAGES.GET_SUBSCRIPTION_SUCCESS,
                subscription
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error && serviceError.message === 'SUBSCRIPTION_NOT_FOUND') {
                return res.status(404).json({ message: utils_1.SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND });
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error("Error getting subscription:", error);
        return res.status(500).json({ message: utils_1.SUBSCRIPTION_MESSAGES.GET_SUBSCRIPTION_ERROR });
    }
};
exports.getSubscriptionById = getSubscriptionById;
/**
 * Lấy danh sách đăng ký theo người dùng
 */
const getSubscriptionsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        try {
            const subscriptions = await services_1.subscriptionService.getSubscriptionsByUserId(userId);
            return res.status(200).json({
                message: utils_1.SUBSCRIPTION_MESSAGES.GET_SUBSCRIPTIONS_SUCCESS,
                subscriptions
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error && serviceError.message === 'USER_NOT_FOUND') {
                return res.status(404).json({ message: utils_1.SUBSCRIPTION_MESSAGES.USER_NOT_FOUND });
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error("Error getting user subscriptions:", error);
        return res.status(500).json({ message: utils_1.SUBSCRIPTION_MESSAGES.GET_SUBSCRIPTIONS_ERROR });
    }
};
exports.getSubscriptionsByUserId = getSubscriptionsByUserId;
/**
 * Tạo đăng ký gói cước mới
 */
const createSubscription = async (req, res) => {
    try {
        const { userId, planId, startDate, endDate, status } = req.body;
        const currentUserId = req.user?.id;
        if (!userId || !planId) {
            return res.status(400).json({ message: utils_1.SUBSCRIPTION_MESSAGES.REQUIRED_SUBSCRIPTION_FIELDS });
        }
        try {
            const subscription = await services_1.subscriptionService.createSubscription({
                userId,
                planId,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                status,
            }, currentUserId);
            return res.status(201).json({
                message: utils_1.SUBSCRIPTION_MESSAGES.CREATE_SUBSCRIPTION_SUCCESS,
                subscription
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error) {
                if (serviceError.message === 'REQUIRED_SUBSCRIPTION_FIELDS') {
                    return res.status(400).json({ message: utils_1.SUBSCRIPTION_MESSAGES.REQUIRED_SUBSCRIPTION_FIELDS });
                }
                if (serviceError.message === 'USER_NOT_FOUND') {
                    return res.status(404).json({ message: utils_1.SUBSCRIPTION_MESSAGES.USER_NOT_FOUND });
                }
                if (serviceError.message === 'PLAN_NOT_FOUND') {
                    return res.status(404).json({ message: utils_1.SUBSCRIPTION_MESSAGES.PLAN_NOT_FOUND });
                }
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error("Error creating subscription:", error);
        return res.status(500).json({ message: utils_1.SUBSCRIPTION_MESSAGES.CREATE_SUBSCRIPTION_ERROR });
    }
};
exports.createSubscription = createSubscription;
/**
 * Cập nhật thông tin đăng ký
 */
const updateSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const { planId, startDate, endDate, status } = req.body;
        const currentUserId = req.user?.id;
        try {
            const subscription = await services_1.subscriptionService.updateSubscription(id, {
                planId,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                status,
            }, currentUserId);
            return res.status(200).json({
                message: utils_1.SUBSCRIPTION_MESSAGES.UPDATE_SUBSCRIPTION_SUCCESS,
                subscription
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error) {
                if (serviceError.message === 'SUBSCRIPTION_NOT_FOUND') {
                    return res.status(404).json({ message: utils_1.SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND });
                }
                if (serviceError.message === 'PLAN_NOT_FOUND') {
                    return res.status(404).json({ message: utils_1.SUBSCRIPTION_MESSAGES.PLAN_NOT_FOUND });
                }
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error("Error updating subscription:", error);
        return res.status(500).json({ message: utils_1.SUBSCRIPTION_MESSAGES.UPDATE_SUBSCRIPTION_ERROR });
    }
};
exports.updateSubscription = updateSubscription;
/**
 * Hủy đăng ký gói cước
 */
const cancelSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user?.id;
        try {
            const subscription = await services_1.subscriptionService.cancelSubscription(id, currentUserId);
            return res.status(200).json({
                message: utils_1.SUBSCRIPTION_MESSAGES.CANCEL_SUBSCRIPTION_SUCCESS,
                subscription
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error && serviceError.message === 'SUBSCRIPTION_NOT_FOUND') {
                return res.status(404).json({ message: utils_1.SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND });
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error("Error cancelling subscription:", error);
        return res.status(500).json({ message: utils_1.SUBSCRIPTION_MESSAGES.CANCEL_SUBSCRIPTION_ERROR });
    }
};
exports.cancelSubscription = cancelSubscription;
