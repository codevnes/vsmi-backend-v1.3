import { PrismaClient, StockPrice } from '@prisma/client';

const prisma = new PrismaClient();

interface StockPriceInput {
  symbol: string;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  trendQ?: number;
  fq?: number;
  bandDown?: number;
  bandUp?: number;
}

interface GetStockPricesParams {
  symbol: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}

export class StockPriceService {
  async getStockPrices({ symbol, startDate, endDate, page, limit }: GetStockPricesParams) {
    const skip = (page - 1) * limit;
    
    const where: any = {
      symbol,
    };
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.date = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      where.date = {
        lte: new Date(endDate),
      };
    }
    
    const [stockPrices, total] = await Promise.all([
      prisma.stockPrice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      prisma.stockPrice.count({ where }),
    ]);
    
    return {
      data: stockPrices,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  
  async getStockPriceByDate(symbol: string, date: string) {
    const parsedDate = new Date(date);
    
    return prisma.stockPrice.findUnique({
      where: {
        symbol_date: {
          symbol,
          date: parsedDate,
        },
      },
    });
  }
  
  async createStockPrice(data: StockPriceInput): Promise<StockPrice> {
    // Check if stock exists
    const existingStock = await prisma.stock.findUnique({
      where: { symbol: data.symbol },
    });
    
    if (!existingStock) {
      throw new Error('STOCK_NOT_FOUND');
    }
    
    // Check if stock price for this date already exists
    const existingStockPrice = await prisma.stockPrice.findUnique({
      where: {
        symbol_date: {
          symbol: data.symbol,
          date: data.date,
        },
      },
    });
    
    if (existingStockPrice) {
      throw new Error('STOCK_PRICE_ALREADY_EXISTS');
    }
    
    return prisma.stockPrice.create({
      data,
    });
  }
  
  async updateStockPrice(symbol: string, date: string, data: Partial<StockPriceInput>): Promise<StockPrice | null> {
    const parsedDate = new Date(date);
    
    // Check if stock price exists
    const existingStockPrice = await prisma.stockPrice.findUnique({
      where: {
        symbol_date: {
          symbol,
          date: parsedDate,
        },
      },
    });
    
    if (!existingStockPrice) {
      return null;
    }
    
    return prisma.stockPrice.update({
      where: {
        symbol_date: {
          symbol,
          date: parsedDate,
        },
      },
      data,
    });
  }
  
  async deleteStockPrice(symbol: string, date: string): Promise<void> {
    const parsedDate = new Date(date);
    
    // Check if stock price exists
    const existingStockPrice = await prisma.stockPrice.findUnique({
      where: {
        symbol_date: {
          symbol,
          date: parsedDate,
        },
      },
    });
    
    if (!existingStockPrice) {
      throw new Error('STOCK_PRICE_NOT_FOUND');
    }
    
    await prisma.stockPrice.delete({
      where: {
        symbol_date: {
          symbol,
          date: parsedDate,
        },
      },
    });
  }
  
  async getLatestStockPrice(symbol: string): Promise<StockPrice | null> {
    return prisma.stockPrice.findFirst({
      where: { symbol },
      orderBy: { date: 'desc' },
    });
  }
  
  async bulkCreateStockPrices(data: StockPriceInput[]): Promise<number> {
    const result = await prisma.$transaction(
      data.map((item) => 
        prisma.stockPrice.upsert({
          where: {
            symbol_date: {
              symbol: item.symbol,
              date: item.date,
            },
          },
          update: item,
          create: item,
        })
      )
    );
    
    return result.length;
  }
} 