import { PrismaClient, SubscriptionPlan } from '@prisma/client';

const prisma = new PrismaClient();

interface SubscriptionPlanInput {
  name: string;
  description?: string;
  price: number;
  durationDays: number;
}

interface GetAllSubscriptionPlansParams {
  page?: number;
  limit?: number;
  search?: string;
}

export class SubscriptionPlanService {
  async getAllSubscriptionPlans(params?: GetAllSubscriptionPlansParams) {
    const { page = 1, limit = 10, search } = params || {};
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    const [plans, total] = await Promise.all([
      prisma.subscriptionPlan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          symbols: {
            include: {
              stock: {
                select: {
                  symbol: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.subscriptionPlan.count({ where }),
    ]);
    
    return {
      data: plans,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  
  async getSubscriptionPlanById(id: string) {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id },
      include: {
        symbols: {
          include: {
            stock: {
              select: {
                symbol: true,
                name: true,
              },
            },
          },
        },
      },
    });
    
    if (!plan) {
      throw new Error('PLAN_NOT_FOUND');
    }
    
    return plan;
  }
  
  async createSubscriptionPlan(data: SubscriptionPlanInput, symbols?: string[]) {
    // Validate required fields
    if (!data.name || !data.price || !data.durationDays) {
      throw new Error('REQUIRED_PLAN_FIELDS');
    }
    
    // Tạo transaction để đảm bảo dữ liệu nhất quán
    return prisma.$transaction(async (tx) => {
      // Tạo gói cước
      const plan = await tx.subscriptionPlan.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          durationDays: data.durationDays,
        },
      });
      
      // Nếu có danh sách symbols, thêm vào bảng SubscriptionPlanSymbol
      if (symbols && symbols.length > 0) {
        // Kiểm tra tất cả symbols có tồn tại không
        const existingStocks = await tx.stock.findMany({
          where: {
            symbol: {
              in: symbols,
            },
          },
          select: {
            symbol: true,
          },
        });
        
        const existingSymbols = existingStocks.map(stock => stock.symbol);
        
        // Kiểm tra nếu có symbol không tồn tại
        if (existingSymbols.length !== symbols.length) {
          throw new Error('STOCK_NOT_FOUND');
        }
        
        // Tạo liên kết giữa gói cước và mã chứng khoán
        await tx.subscriptionPlanSymbol.createMany({
          data: symbols.map(symbol => ({
            planId: plan.id,
            symbol,
          })),
        });
      }
      
      // Trả về gói cước đã tạo với đầy đủ thông tin
      return tx.subscriptionPlan.findUnique({
        where: { id: plan.id },
        include: {
          symbols: {
            include: {
              stock: {
                select: {
                  symbol: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    });
  }
  
  async updateSubscriptionPlan(id: string, data: Partial<SubscriptionPlanInput>, symbols?: string[]) {
    // Kiểm tra gói cước tồn tại
    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: { id },
    });
    
    if (!existingPlan) {
      throw new Error('PLAN_NOT_FOUND');
    }
    
    // Tạo transaction để đảm bảo dữ liệu nhất quán
    return prisma.$transaction(async (tx) => {
      // Cập nhật thông tin gói cước
      const plan = await tx.subscriptionPlan.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          durationDays: data.durationDays,
        },
      });
      
      // Nếu có danh sách symbols mới, cập nhật lại
      if (symbols !== undefined) {
        // Xóa tất cả symbols hiện tại
        await tx.subscriptionPlanSymbol.deleteMany({
          where: { planId: id },
        });
        
        // Nếu có symbols mới, thêm vào
        if (symbols.length > 0) {
          // Kiểm tra tất cả symbols có tồn tại không
          const existingStocks = await tx.stock.findMany({
            where: {
              symbol: {
                in: symbols,
              },
            },
            select: {
              symbol: true,
            },
          });
          
          const existingSymbols = existingStocks.map(stock => stock.symbol);
          
          // Kiểm tra nếu có symbol không tồn tại
          if (existingSymbols.length !== symbols.length) {
            throw new Error('STOCK_NOT_FOUND');
          }
          
          // Tạo liên kết mới
          await tx.subscriptionPlanSymbol.createMany({
            data: symbols.map(symbol => ({
              planId: plan.id,
              symbol,
            })),
          });
        }
      }
      
      // Trả về gói cước đã cập nhật với đầy đủ thông tin
      return tx.subscriptionPlan.findUnique({
        where: { id: plan.id },
        include: {
          symbols: {
            include: {
              stock: {
                select: {
                  symbol: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    });
  }
  
  async deleteSubscriptionPlan(id: string) {
    // Kiểm tra gói cước tồn tại
    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: { id },
    });
    
    if (!existingPlan) {
      throw new Error('PLAN_NOT_FOUND');
    }
    
    // Kiểm tra nếu có đăng ký sử dụng gói này
    const existingSubscriptions = await prisma.subscription.findFirst({
      where: { planId: id },
    });
    
    if (existingSubscriptions) {
      throw new Error('PLAN_IN_USE');
    }
    
    // Tạo transaction để đảm bảo dữ liệu nhất quán
    return prisma.$transaction(async (tx) => {
      // Xóa tất cả symbols liên quan
      await tx.subscriptionPlanSymbol.deleteMany({
        where: { planId: id },
      });
      
      // Xóa gói cước
      await tx.subscriptionPlan.delete({
        where: { id },
      });
      
      return true;
    });
  }
} 