import { PrismaClient } from '@prisma/client';
import { ISelectedStocks, ISelectedStocksCreate, ISelectedStocksUpdate, IPaginationOptions, IPaginationResult } from '../models';
import { prisma } from '../app';

export class SelectedStocksRepository {
  constructor(private readonly prismaClient: PrismaClient = prisma) {}

  async findAll(options?: IPaginationOptions): Promise<IPaginationResult<ISelectedStocks>> {
    const {
      page = 1,
      limit = 10,
      sort = 'date',
      order = 'desc',
    } = options || {};

    const skip = (page - 1) * limit;
    const take = limit;

    const [items, count] = await Promise.all([
      this.prismaClient.selectedStocks.findMany({
        skip,
        take,
        orderBy: {
          [sort]: order,
        },
      }),
      this.prismaClient.selectedStocks.count(),
    ]);

    const totalPages = Math.ceil(count / limit);

    return {
      data: items as ISelectedStocks[],
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findBySymbol(symbol: string, options?: IPaginationOptions): Promise<IPaginationResult<ISelectedStocks>> {
    const {
      page = 1,
      limit = 10,
      sort = 'date',
      order = 'desc',
    } = options || {};

    const skip = (page - 1) * limit;
    const take = limit;

    const [items, count] = await Promise.all([
      this.prismaClient.selectedStocks.findMany({
        where: {
          symbol,
        },
        skip,
        take,
        orderBy: {
          [sort]: order,
        },
      }),
      this.prismaClient.selectedStocks.count({
        where: {
          symbol,
        },
      }),
    ]);

    const totalPages = Math.ceil(count / limit);

    return {
      data: items as ISelectedStocks[],
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findByDate(date: Date): Promise<ISelectedStocks[]> {
    const items = await this.prismaClient.selectedStocks.findMany({
      where: {
        date,
      },
      orderBy: {
        qIndex: 'desc',
      },
    });

    return items as ISelectedStocks[];
  }

  async findTopByQIndex(limit: number = 20, startDate?: Date, endDate?: Date): Promise<ISelectedStocks[]> {
    const dateFilter = {};
    
    if (startDate && endDate) {
      Object.assign(dateFilter, {
        gte: startDate,
        lte: endDate,
      });
    } else if (startDate) {
      Object.assign(dateFilter, {
        gte: startDate,
      });
    } else if (endDate) {
      Object.assign(dateFilter, {
        lte: endDate,
      });
    }

    const whereClause = Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {};

    const items = await this.prismaClient.selectedStocks.findMany({
      where: whereClause,
      orderBy: {
        qIndex: 'desc',
      },
      take: limit,
    });

    return items as ISelectedStocks[];
  }

  async findById(id: string): Promise<ISelectedStocks | null> {
    const item = await this.prismaClient.selectedStocks.findUnique({
      where: {
        id,
      },
    });

    return item as ISelectedStocks | null;
  }

  async findBySymbolAndDate(symbol: string, date: Date): Promise<ISelectedStocks | null> {
    const item = await this.prismaClient.selectedStocks.findUnique({
      where: {
        symbol_date: {
          symbol,
          date,
        },
      },
    });

    return item as ISelectedStocks | null;
  }

  async create(data: ISelectedStocksCreate): Promise<ISelectedStocks> {
    const item = await this.prismaClient.selectedStocks.create({
      data,
    });

    return item as ISelectedStocks;
  }

  async update(id: string, data: ISelectedStocksUpdate): Promise<ISelectedStocks> {
    const item = await this.prismaClient.selectedStocks.update({
      where: {
        id,
      },
      data,
    });

    return item as ISelectedStocks;
  }

  async delete(id: string): Promise<ISelectedStocks> {
    const item = await this.prismaClient.selectedStocks.delete({
      where: {
        id,
      },
    });

    return item as ISelectedStocks;
  }

  async deleteMany(ids: string[]): Promise<number> {
    const result = await this.prismaClient.selectedStocks.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return result.count;
  }
} 