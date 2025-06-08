import { Request, Response } from "express";
import { subscriptionService } from "../services";
import { SUBSCRIPTION_MESSAGES } from "../utils";
import { AuthRequest } from "../types";

/**
 * Lấy danh sách đăng ký gói cước
 */
export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const { page, limit, userId, status } = req.query;
    
    const result = await subscriptionService.getAllSubscriptions({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      userId: userId as string,
      status: status as any,
    });
    
    return res.status(200).json({
      message: SUBSCRIPTION_MESSAGES.GET_SUBSCRIPTIONS_SUCCESS,
      subscriptions: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error("Error getting subscriptions:", error);
    return res.status(500).json({ message: SUBSCRIPTION_MESSAGES.GET_SUBSCRIPTIONS_ERROR });
  }
};

/**
 * Lấy thông tin chi tiết đăng ký theo ID
 */
export const getSubscriptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    try {
      const subscription = await subscriptionService.getSubscriptionById(id);
      return res.status(200).json({
        message: SUBSCRIPTION_MESSAGES.GET_SUBSCRIPTION_SUCCESS,
        subscription
      });
    } catch (serviceError) {
      if (serviceError instanceof Error && serviceError.message === 'SUBSCRIPTION_NOT_FOUND') {
        return res.status(404).json({ message: SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND });
      }
      throw serviceError;
    }
  } catch (error) {
    console.error("Error getting subscription:", error);
    return res.status(500).json({ message: SUBSCRIPTION_MESSAGES.GET_SUBSCRIPTION_ERROR });
  }
};

/**
 * Lấy danh sách đăng ký theo người dùng
 */
export const getSubscriptionsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    try {
      const subscriptions = await subscriptionService.getSubscriptionsByUserId(userId);
      return res.status(200).json({
        message: SUBSCRIPTION_MESSAGES.GET_SUBSCRIPTIONS_SUCCESS,
        subscriptions
      });
    } catch (serviceError) {
      if (serviceError instanceof Error && serviceError.message === 'USER_NOT_FOUND') {
        return res.status(404).json({ message: SUBSCRIPTION_MESSAGES.USER_NOT_FOUND });
      }
      throw serviceError;
    }
  } catch (error) {
    console.error("Error getting user subscriptions:", error);
    return res.status(500).json({ message: SUBSCRIPTION_MESSAGES.GET_SUBSCRIPTIONS_ERROR });
  }
};

/**
 * Tạo đăng ký gói cước mới
 */
export const createSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, planId, startDate, endDate, status } = req.body;
    const currentUserId = req.user?.id!;

    if (!userId || !planId) {
      return res.status(400).json({ message: SUBSCRIPTION_MESSAGES.REQUIRED_SUBSCRIPTION_FIELDS });
    }

    try {
      const subscription = await subscriptionService.createSubscription(
        {
          userId,
          planId,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          status,
        },
        currentUserId
      );

      return res.status(201).json({
        message: SUBSCRIPTION_MESSAGES.CREATE_SUBSCRIPTION_SUCCESS,
        subscription
      });
    } catch (serviceError) {
      if (serviceError instanceof Error) {
        if (serviceError.message === 'REQUIRED_SUBSCRIPTION_FIELDS') {
          return res.status(400).json({ message: SUBSCRIPTION_MESSAGES.REQUIRED_SUBSCRIPTION_FIELDS });
        }
        if (serviceError.message === 'USER_NOT_FOUND') {
          return res.status(404).json({ message: SUBSCRIPTION_MESSAGES.USER_NOT_FOUND });
        }
        if (serviceError.message === 'PLAN_NOT_FOUND') {
          return res.status(404).json({ message: SUBSCRIPTION_MESSAGES.PLAN_NOT_FOUND });
        }
      }
      throw serviceError;
    }
  } catch (error) {
    console.error("Error creating subscription:", error);
    return res.status(500).json({ message: SUBSCRIPTION_MESSAGES.CREATE_SUBSCRIPTION_ERROR });
  }
};

/**
 * Cập nhật thông tin đăng ký
 */
export const updateSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { planId, startDate, endDate, status } = req.body;
    const currentUserId = req.user?.id!;

    try {
      const subscription = await subscriptionService.updateSubscription(
        id,
        {
          planId,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          status,
        },
        currentUserId
      );

      return res.status(200).json({
        message: SUBSCRIPTION_MESSAGES.UPDATE_SUBSCRIPTION_SUCCESS,
        subscription
      });
    } catch (serviceError) {
      if (serviceError instanceof Error) {
        if (serviceError.message === 'SUBSCRIPTION_NOT_FOUND') {
          return res.status(404).json({ message: SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND });
        }
        if (serviceError.message === 'PLAN_NOT_FOUND') {
          return res.status(404).json({ message: SUBSCRIPTION_MESSAGES.PLAN_NOT_FOUND });
        }
      }
      throw serviceError;
    }
  } catch (error) {
    console.error("Error updating subscription:", error);
    return res.status(500).json({ message: SUBSCRIPTION_MESSAGES.UPDATE_SUBSCRIPTION_ERROR });
  }
};

/**
 * Hủy đăng ký gói cước
 */
export const cancelSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id!;

    try {
      const subscription = await subscriptionService.cancelSubscription(id, currentUserId);
      return res.status(200).json({
        message: SUBSCRIPTION_MESSAGES.CANCEL_SUBSCRIPTION_SUCCESS,
        subscription
      });
    } catch (serviceError) {
      if (serviceError instanceof Error && serviceError.message === 'SUBSCRIPTION_NOT_FOUND') {
        return res.status(404).json({ message: SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND });
      }
      throw serviceError;
    }
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return res.status(500).json({ message: SUBSCRIPTION_MESSAGES.CANCEL_SUBSCRIPTION_ERROR });
  }
}; 