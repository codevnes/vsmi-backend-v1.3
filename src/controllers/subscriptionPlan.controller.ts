import { Request, Response } from "express";
import { subscriptionPlanService } from "../services";
import { SUBSCRIPTION_MESSAGES } from "../utils";
import { AuthRequest } from "../types";

/**
 * Lấy danh sách gói cước
 */
export const getAllSubscriptionPlans = async (req: Request, res: Response) => {
  try {
    const { page, limit, search } = req.query;
    
    const result = await subscriptionPlanService.getAllSubscriptionPlans({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
    });
    
    return res.status(200).json({
      message: SUBSCRIPTION_MESSAGES.GET_PLANS_SUCCESS,
      plans: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error("Error getting subscription plans:", error);
    return res.status(500).json({ message: SUBSCRIPTION_MESSAGES.GET_PLANS_ERROR });
  }
};

/**
 * Lấy thông tin chi tiết gói cước theo ID
 */
export const getSubscriptionPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    try {
      const plan = await subscriptionPlanService.getSubscriptionPlanById(id);
      return res.status(200).json({
        message: SUBSCRIPTION_MESSAGES.GET_PLAN_SUCCESS,
        plan
      });
    } catch (serviceError) {
      if (serviceError instanceof Error && serviceError.message === 'PLAN_NOT_FOUND') {
        return res.status(404).json({ message: SUBSCRIPTION_MESSAGES.PLAN_NOT_FOUND });
      }
      throw serviceError;
    }
  } catch (error) {
    console.error("Error getting subscription plan:", error);
    return res.status(500).json({ message: SUBSCRIPTION_MESSAGES.GET_PLAN_ERROR });
  }
};

/**
 * Tạo gói cước mới
 */
export const createSubscriptionPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, durationDays, symbols } = req.body;

    if (!name || price === undefined || price === null || !durationDays) {
      return res.status(400).json({ message: SUBSCRIPTION_MESSAGES.REQUIRED_PLAN_FIELDS });
    }

    try {
      const plan = await subscriptionPlanService.createSubscriptionPlan(
        {
          name,
          description,
          price: parseFloat(price),
          durationDays: parseInt(durationDays),
        },
        symbols
      );

      return res.status(201).json({
        message: SUBSCRIPTION_MESSAGES.CREATE_PLAN_SUCCESS,
        plan
      });
    } catch (serviceError) {
      if (serviceError instanceof Error) {
        if (serviceError.message === 'REQUIRED_PLAN_FIELDS') {
          return res.status(400).json({ message: SUBSCRIPTION_MESSAGES.REQUIRED_PLAN_FIELDS });
        }
        if (serviceError.message === 'STOCK_NOT_FOUND') {
          return res.status(400).json({ message: SUBSCRIPTION_MESSAGES.INVALID_PLAN_DATA });
        }
      }
      throw serviceError;
    }
  } catch (error) {
    console.error("Error creating subscription plan:", error);
    return res.status(500).json({ message: SUBSCRIPTION_MESSAGES.CREATE_PLAN_ERROR });
  }
};

/**
 * Cập nhật thông tin gói cước
 */
export const updateSubscriptionPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, durationDays, symbols } = req.body;

    try {
      const plan = await subscriptionPlanService.updateSubscriptionPlan(
        id,
        {
          name,
          description,
          price: price !== undefined ? parseFloat(price) : undefined,
          durationDays: durationDays !== undefined ? parseInt(durationDays) : undefined,
        },
        symbols
      );

      return res.status(200).json({
        message: SUBSCRIPTION_MESSAGES.UPDATE_PLAN_SUCCESS,
        plan
      });
    } catch (serviceError) {
      if (serviceError instanceof Error) {
        if (serviceError.message === 'PLAN_NOT_FOUND') {
          return res.status(404).json({ message: SUBSCRIPTION_MESSAGES.PLAN_NOT_FOUND });
        }
        if (serviceError.message === 'STOCK_NOT_FOUND') {
          return res.status(400).json({ message: SUBSCRIPTION_MESSAGES.INVALID_PLAN_DATA });
        }
      }
      throw serviceError;
    }
  } catch (error) {
    console.error("Error updating subscription plan:", error);
    return res.status(500).json({ message: SUBSCRIPTION_MESSAGES.UPDATE_PLAN_ERROR });
  }
};

/**
 * Xóa gói cước
 */
export const deleteSubscriptionPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    try {
      await subscriptionPlanService.deleteSubscriptionPlan(id);
      return res.status(200).json({ message: SUBSCRIPTION_MESSAGES.DELETE_PLAN_SUCCESS });
    } catch (serviceError) {
      if (serviceError instanceof Error) {
        if (serviceError.message === 'PLAN_NOT_FOUND') {
          return res.status(404).json({ message: SUBSCRIPTION_MESSAGES.PLAN_NOT_FOUND });
        }
        if (serviceError.message === 'PLAN_IN_USE') {
          return res.status(400).json({ message: "Không thể xóa gói cước đang được sử dụng" });
        }
      }
      throw serviceError;
    }
  } catch (error) {
    console.error("Error deleting subscription plan:", error);
    return res.status(500).json({ message: SUBSCRIPTION_MESSAGES.DELETE_PLAN_ERROR });
  }
}; 