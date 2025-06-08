import { PrismaClient, Subscription, SubscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

interface SubscriptionInput {
  userId: string;
  planId: string;
  startDate?: Date;
  endDate?: Date;
  status?: SubscriptionStatus;
}

interface GetAllSubscriptionsParams {
  page?: number;
  limit?: number;
  userId?: string;
  status?: SubscriptionStatus;
}

export class SubscriptionService {
  async getAllSubscriptions(params?: GetAllSubscriptionsParams) {
    const { page = 1, limit = 10, userId, status } = params || {};
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (status) {
      where.status = status;
    }
    
    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
          plan: true,
        },
      }),
      prisma.subscription.count({ where }),
    ]);
    
    return {
      data: subscriptions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  
  async getSubscriptionById(id: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        plan: true,
      },
    });
    
    if (!subscription) {
      throw new Error('SUBSCRIPTION_NOT_FOUND');
    }
    
    return subscription;
  }
  
  async getSubscriptionsByUserId(userId: string) {
    // Kiểm tra người dùng có tồn tại không
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    
    return prisma.subscription.findMany({
      where: { userId },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  
  async createSubscription(data: SubscriptionInput, currentUserId: string) {
    // Validate required fields
    if (!data.userId || !data.planId) {
      throw new Error('REQUIRED_SUBSCRIPTION_FIELDS');
    }
    
    // Kiểm tra người dùng có tồn tại không
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });
    
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    
    // Kiểm tra gói cước có tồn tại không
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: data.planId },
    });
    
    if (!plan) {
      throw new Error('PLAN_NOT_FOUND');
    }
    
    // Thiết lập ngày bắt đầu và kết thúc
    const startDate = data.startDate || new Date();
    let endDate = data.endDate;
    
    // Nếu không có ngày kết thúc, tính dựa trên thời hạn của gói
    if (!endDate) {
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + plan.durationDays);
    }
    
    // Tạo đăng ký mới
    const subscription = await prisma.subscription.create({
      data: {
        userId: data.userId,
        planId: data.planId,
        startDate,
        endDate,
        status: data.status || SubscriptionStatus.ACTIVE,
        createdBy: currentUserId,
        updatedBy: currentUserId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        plan: true,
      },
    });
    
    return subscription;
  }
  
  async updateSubscription(id: string, data: Partial<SubscriptionInput>, currentUserId: string) {
    // Kiểm tra đăng ký có tồn tại không
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id },
    });
    
    if (!existingSubscription) {
      throw new Error('SUBSCRIPTION_NOT_FOUND');
    }
    
    // Nếu thay đổi gói cước, kiểm tra gói mới có tồn tại không
    if (data.planId) {
      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: data.planId },
      });
      
      if (!plan) {
        throw new Error('PLAN_NOT_FOUND');
      }
    }
    
    // Cập nhật đăng ký
    const subscription = await prisma.subscription.update({
      where: { id },
      data: {
        planId: data.planId,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        updatedBy: currentUserId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        plan: true,
      },
    });
    
    return subscription;
  }
  
  async cancelSubscription(id: string, currentUserId: string) {
    // Kiểm tra đăng ký có tồn tại không
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id },
    });
    
    if (!existingSubscription) {
      throw new Error('SUBSCRIPTION_NOT_FOUND');
    }
    
    // Cập nhật trạng thái thành CANCELLED
    const subscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: SubscriptionStatus.CANCELLED,
        updatedBy: currentUserId,
      },
    });
    
    return subscription;
  }
} 