"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubscriptionPlan = exports.updateSubscriptionPlan = exports.createSubscriptionPlan = exports.getSubscriptionPlanById = exports.getAllSubscriptionPlans = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
/**
 * Lấy danh sách gói cước
 */
const getAllSubscriptionPlans = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const result = await services_1.subscriptionPlanService.getAllSubscriptionPlans({
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
            search: search,
        });
        return res.status(200).json({
            message: utils_1.SUBSCRIPTION_MESSAGES.GET_PLANS_SUCCESS,
            plans: result.data,
            pagination: result.pagination
        });
    }
    catch (error) {
        console.error("Error getting subscription plans:", error);
        return res.status(500).json({ message: utils_1.SUBSCRIPTION_MESSAGES.GET_PLANS_ERROR });
    }
};
exports.getAllSubscriptionPlans = getAllSubscriptionPlans;
/**
 * Lấy thông tin chi tiết gói cước theo ID
 */
const getSubscriptionPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        try {
            const plan = await services_1.subscriptionPlanService.getSubscriptionPlanById(id);
            return res.status(200).json({
                message: utils_1.SUBSCRIPTION_MESSAGES.GET_PLAN_SUCCESS,
                plan
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error && serviceError.message === 'PLAN_NOT_FOUND') {
                return res.status(404).json({ message: utils_1.SUBSCRIPTION_MESSAGES.PLAN_NOT_FOUND });
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error("Error getting subscription plan:", error);
        return res.status(500).json({ message: utils_1.SUBSCRIPTION_MESSAGES.GET_PLAN_ERROR });
    }
};
exports.getSubscriptionPlanById = getSubscriptionPlanById;
/**
 * Tạo gói cước mới
 */
const createSubscriptionPlan = async (req, res) => {
    try {
        const { name, description, price, durationDays, symbols } = req.body;
        if (!name || price === undefined || price === null || !durationDays) {
            return res.status(400).json({ message: utils_1.SUBSCRIPTION_MESSAGES.REQUIRED_PLAN_FIELDS });
        }
        try {
            const plan = await services_1.subscriptionPlanService.createSubscriptionPlan({
                name,
                description,
                price: parseFloat(price),
                durationDays: parseInt(durationDays),
            }, symbols);
            return res.status(201).json({
                message: utils_1.SUBSCRIPTION_MESSAGES.CREATE_PLAN_SUCCESS,
                plan
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error) {
                if (serviceError.message === 'REQUIRED_PLAN_FIELDS') {
                    return res.status(400).json({ message: utils_1.SUBSCRIPTION_MESSAGES.REQUIRED_PLAN_FIELDS });
                }
                if (serviceError.message === 'STOCK_NOT_FOUND') {
                    return res.status(400).json({ message: utils_1.SUBSCRIPTION_MESSAGES.INVALID_PLAN_DATA });
                }
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error("Error creating subscription plan:", error);
        return res.status(500).json({ message: utils_1.SUBSCRIPTION_MESSAGES.CREATE_PLAN_ERROR });
    }
};
exports.createSubscriptionPlan = createSubscriptionPlan;
/**
 * Cập nhật thông tin gói cước
 */
const updateSubscriptionPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, durationDays, symbols } = req.body;
        try {
            const plan = await services_1.subscriptionPlanService.updateSubscriptionPlan(id, {
                name,
                description,
                price: price !== undefined ? parseFloat(price) : undefined,
                durationDays: durationDays !== undefined ? parseInt(durationDays) : undefined,
            }, symbols);
            return res.status(200).json({
                message: utils_1.SUBSCRIPTION_MESSAGES.UPDATE_PLAN_SUCCESS,
                plan
            });
        }
        catch (serviceError) {
            if (serviceError instanceof Error) {
                if (serviceError.message === 'PLAN_NOT_FOUND') {
                    return res.status(404).json({ message: utils_1.SUBSCRIPTION_MESSAGES.PLAN_NOT_FOUND });
                }
                if (serviceError.message === 'STOCK_NOT_FOUND') {
                    return res.status(400).json({ message: utils_1.SUBSCRIPTION_MESSAGES.INVALID_PLAN_DATA });
                }
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error("Error updating subscription plan:", error);
        return res.status(500).json({ message: utils_1.SUBSCRIPTION_MESSAGES.UPDATE_PLAN_ERROR });
    }
};
exports.updateSubscriptionPlan = updateSubscriptionPlan;
/**
 * Xóa gói cước
 */
const deleteSubscriptionPlan = async (req, res) => {
    try {
        const { id } = req.params;
        try {
            await services_1.subscriptionPlanService.deleteSubscriptionPlan(id);
            return res.status(200).json({ message: utils_1.SUBSCRIPTION_MESSAGES.DELETE_PLAN_SUCCESS });
        }
        catch (serviceError) {
            if (serviceError instanceof Error) {
                if (serviceError.message === 'PLAN_NOT_FOUND') {
                    return res.status(404).json({ message: utils_1.SUBSCRIPTION_MESSAGES.PLAN_NOT_FOUND });
                }
                if (serviceError.message === 'PLAN_IN_USE') {
                    return res.status(400).json({ message: "Không thể xóa gói cước đang được sử dụng" });
                }
            }
            throw serviceError;
        }
    }
    catch (error) {
        console.error("Error deleting subscription plan:", error);
        return res.status(500).json({ message: utils_1.SUBSCRIPTION_MESSAGES.DELETE_PLAN_ERROR });
    }
};
exports.deleteSubscriptionPlan = deleteSubscriptionPlan;
