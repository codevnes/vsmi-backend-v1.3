import { ISelectedStocks, ISelectedStocksCreate, ISelectedStocksUpdate, IPaginationOptions, IPaginationResult } from '../models';
import { prisma } from '../app';
import { bigIntSerializer } from '../utils/helpers';

export class SelectedStocksRepository {
  constructor() {}

  async findAll(options?: IPaginationOptions): Promise<IPaginationResult<ISelectedStocks & { stockPrices?: any[], stockInfo?: any }>> {
    const {
      page = 1,
      limit = 10,
      sort = 'symbol',
      order = 'asc',
    } = options || {};

    const skip = (page - 1) * limit;
    const take = limit;

    try {
      // Calculate the date 3 months ago from today
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const [items, count] = await Promise.all([
        prisma.selectedStocks.findMany({
          skip,
          take,
          orderBy: {
            [sort]: order,
          },
          include: {
            stock: {
              select: {
                id: true,
                symbol: true,
                name: true,
                exchange: true,
                industry: true,
                stockPrices: {
                  where: {
                    date: {
                      gte: threeMonthsAgo
                    }
                  },
                  orderBy: {
                    date: 'desc'
                  },
                  select: {
                    date: true,
                    close: true
                  }
                }
              }
            }
          }
        }),
        prisma.selectedStocks.count(),
      ]);

      const totalPages = Math.ceil(count / limit);

      // Map the results to include stock info and stock prices and convert BigInt values
      const mappedItems = items.map(item => {
        const { stock, ...rest } = item;
        const { stockPrices, ...stockInfo } = stock || { stockPrices: [], symbol: rest.symbol };
        
        return {
          ...rest,
          stockInfo,
          stockPrices: stockPrices || []
        };
      });

      return {
        data: bigIntSerializer(mappedItems) as (ISelectedStocks & { stockPrices: any[], stockInfo: any })[],
        pagination: {
          page,
          limit,
          totalItems: count,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findBySymbol(symbol: string): Promise<(ISelectedStocks & { stockInfo?: any }) | null> {
    const item = await prisma.selectedStocks.findFirst({
      where: {
        symbol
      },
      include: {
        stock: {
          select: {
            id: true,
            symbol: true,
            name: true,
            exchange: true,
            industry: true,
            description: true,
            profile: true,
          }
        }
      }
    });

    if (!item) {
      return null;
    }

    const { stock, ...rest } = item;
    return {
      ...rest,
      stockInfo: stock || { symbol: rest.symbol }
    } as (ISelectedStocks & { stockInfo: any });
  }

  async findBySymbolAndDate(symbol: string, date: Date): Promise<ISelectedStocks | null> {
    // Convert the date to UTC and extract year, month, day
    const targetDate = new Date(date);
    
    // Create the date range for comparison (beginning and end of the day)
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const item = await prisma.selectedStocks.findFirst({
      where: {
        symbol,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });

    return item as ISelectedStocks | null;
  }

  async findTopByReturn(limit: number = 20): Promise<(ISelectedStocks & { stockInfo?: any })[]> {
    const items = await prisma.selectedStocks.findMany({
      orderBy: {
        return: 'desc',
      },
      take: limit,
      include: {
        stock: {
          select: {
            id: true,
            symbol: true,
            name: true,
            exchange: true,
            industry: true,
          }
        }
      }
    });

    // Map the results to include stock info
    return items.map(item => {
      const { stock, ...rest } = item;
      return {
        ...rest,
        stockInfo: stock || { symbol: rest.symbol }
      };
    }) as (ISelectedStocks & { stockInfo: any })[];
  }

  async findById(id: string): Promise<(ISelectedStocks & { stockInfo?: any }) | null> {
    const item = await prisma.selectedStocks.findUnique({
      where: {
        id,
      },
      include: {
        stock: {
          select: {
            id: true,
            symbol: true,
            name: true,
            exchange: true,
            industry: true,
            description: true,
            profile: true,
          }
        }
      }
    });

    if (!item) {
      return null;
    }

    const { stock, ...rest } = item;
    return {
      ...rest,
      stockInfo: stock || { symbol: rest.symbol }
    } as (ISelectedStocks & { stockInfo: any });
  }

  async create(data: ISelectedStocksCreate): Promise<ISelectedStocks> {
    // Create a valid data object for Prisma
    const item = await prisma.selectedStocks.create({
      data: {
        symbol: data.symbol,
        close: data.close ?? null,
        return: data.return ?? null,
        volume: data.volume ?? null,
      },
    });

    return item as ISelectedStocks;
  }

  async update(id: string, data: ISelectedStocksUpdate): Promise<ISelectedStocks> {
    const item = await prisma.selectedStocks.update({
      where: {
        id,
      },
      data: {
        symbol: data.symbol,
        close: data.close,
        return: data.return,
        volume: data.volume
      },
    });

    return item as ISelectedStocks;
  }

  async delete(id: string): Promise<ISelectedStocks> {
    const item = await prisma.selectedStocks.delete({
      where: {
        id,
      },
    });

    return item as ISelectedStocks;
  }

  async deleteMany(ids: string[]): Promise<number> {
    const result = await prisma.selectedStocks.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return result.count;
  }
} 