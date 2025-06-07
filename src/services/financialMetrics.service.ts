import { PrismaClient, FinancialMetrics } from '@prisma/client';

const prisma = new PrismaClient();

interface FinancialMetricsInput {
  symbol: string;
  year: number;
  quarter?: number | null;
  eps?: number | null;
  epsIndustry?: number | null;
  pe?: number | null;
  peIndustry?: number | null;
  roa?: number | null;
  roe?: number | null;
  roaIndustry?: number | null;
  roeIndustry?: number | null;
  revenue?: number | null;
  margin?: number | null;
  totalDebtToEquity?: number | null;
  totalAssetsToEquity?: number | null;
}

interface GetFinancialMetricsParams {
  symbol?: string;
  year?: number;
  quarter?: number | null;
  page: number;
  limit: number;
}

export class FinancialMetricsService {
  async getFinancialMetricsList({
    symbol,
    year,
    quarter,
    page,
    limit
  }: GetFinancialMetricsParams) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (symbol) {
      where.symbol = symbol;
    }
    
    if (year) {
      where.year = year;
    }
    
    if (quarter !== undefined) {
      where.quarter = quarter;
    }
    
    const [financialMetrics, total] = await Promise.all([
      prisma.financialMetrics.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { year: 'desc' },
          { quarter: 'desc' },
        ],
        include: {
          stock: {
            select: {
              name: true,
              exchange: true
            }
          }
        }
      }),
      prisma.financialMetrics.count({ where }),
    ]);
    
    return {
      data: financialMetrics,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  
  async getFinancialMetricsById(id: string): Promise<FinancialMetrics | null> {
    return prisma.financialMetrics.findUnique({
      where: { id },
      include: {
        stock: {
          select: {
            name: true,
            exchange: true
          }
        }
      }
    });
  }
  
  async getFinancialMetricsBySymbolYearQuarter(
    symbol: string, 
    year: number, 
    quarter: number | null
  ): Promise<FinancialMetrics | null> {
    return prisma.financialMetrics.findUnique({
      where: {
        symbol_year_quarter: {
          symbol,
          year,
          quarter: quarter as any
        }
      },
      include: {
        stock: {
          select: {
            name: true,
            exchange: true
          }
        }
      }
    });
  }
  
  async createFinancialMetrics(data: FinancialMetricsInput): Promise<FinancialMetrics> {
    // Check if stock with symbol exists
    const stock = await prisma.stock.findUnique({
      where: { symbol: data.symbol },
    });
    
    if (!stock) {
      throw new Error('STOCK_NOT_FOUND');
    }
    
    // Check if metrics for this symbol, year, and quarter already exist
    const existingMetrics = await prisma.financialMetrics.findUnique({
      where: {
        symbol_year_quarter: {
          symbol: data.symbol,
          year: data.year,
          quarter: data.quarter as any
        }
      },
    });
    
    if (existingMetrics) {
      throw new Error('FINANCIAL_METRICS_ALREADY_EXISTS');
    }
    
    return prisma.financialMetrics.create({
      data,
    });
  }
  
  async updateFinancialMetrics(
    id: string, 
    data: Partial<Omit<FinancialMetricsInput, 'symbol' | 'year' | 'quarter'>>
  ): Promise<FinancialMetrics | null> {
    // Check if financial metrics exist
    const existingMetrics = await prisma.financialMetrics.findUnique({
      where: { id },
    });
    
    if (!existingMetrics) {
      return null;
    }
    
    return prisma.financialMetrics.update({
      where: { id },
      data,
    });
  }
  
  async updateFinancialMetricsBySymbolYearQuarter(
    symbol: string, 
    year: number, 
    quarter: number | null,
    data: Partial<Omit<FinancialMetricsInput, 'symbol' | 'year' | 'quarter'>>
  ): Promise<FinancialMetrics | null> {
    // Check if financial metrics exist
    const existingMetrics = await prisma.financialMetrics.findUnique({
      where: {
        symbol_year_quarter: {
          symbol,
          year,
          quarter: quarter as any
        }
      },
    });
    
    if (!existingMetrics) {
      return null;
    }
    
    return prisma.financialMetrics.update({
      where: {
        symbol_year_quarter: {
          symbol,
          year,
          quarter: quarter as any
        }
      },
      data,
    });
  }
  
  async deleteFinancialMetricsById(id: string): Promise<void> {
    // Check if financial metrics exist
    const existingMetrics = await prisma.financialMetrics.findUnique({
      where: { id },
    });
    
    if (!existingMetrics) {
      throw new Error('FINANCIAL_METRICS_NOT_FOUND');
    }
    
    await prisma.financialMetrics.delete({
      where: { id },
    });
  }
  
  async deleteFinancialMetricsBySymbolYearQuarter(
    symbol: string, 
    year: number, 
    quarter: number | null
  ): Promise<void> {
    // Check if financial metrics exist
    const existingMetrics = await prisma.financialMetrics.findUnique({
      where: {
        symbol_year_quarter: {
          symbol,
          year,
          quarter: quarter as any
        }
      },
    });
    
    if (!existingMetrics) {
      throw new Error('FINANCIAL_METRICS_NOT_FOUND');
    }
    
    await prisma.financialMetrics.delete({
      where: {
        symbol_year_quarter: {
          symbol,
          year,
          quarter: quarter as any
        }
      },
    });
  }
  
  async bulkCreateFinancialMetrics(dataArray: FinancialMetricsInput[]): Promise<number> {
    // Get unique symbols to validate
    const symbols = [...new Set(dataArray.map(item => item.symbol))];
    
    // Validate all symbols exist
    const stocks = await prisma.stock.findMany({
      where: {
        symbol: {
          in: symbols
        }
      },
      select: {
        symbol: true
      }
    });
    
    const validSymbols = new Set(stocks.map(s => s.symbol));
    
    // Find invalid symbols
    const invalidSymbols = symbols.filter(symbol => !validSymbols.has(symbol));
    if (invalidSymbols.length > 0) {
      console.log(`Found ${invalidSymbols.length} invalid symbols: ${invalidSymbols.join(', ')}`);
    }
    
    // Filter out items with invalid symbols
    const validData = dataArray.filter(item => validSymbols.has(item.symbol));
    
    console.log(`Total records: ${dataArray.length}, Valid symbols: ${validData.length}, Invalid symbols: ${dataArray.length - validData.length}`);
    
    if (validData.length === 0) {
      return 0;
    }
    
    // Check for potential duplicates in input data
    const uniqueKeys = new Map();
    const uniqueData = [];
    
    for (const item of validData) {
      // Do not modify the quarter value here
      const key = `${item.symbol}-${item.year}-${item.quarter === null ? 'null' : item.quarter}`;
      if (!uniqueKeys.has(key)) {
        uniqueKeys.set(key, true);
        uniqueData.push(item);
      }
    }
    
    console.log(`Found ${validData.length - uniqueData.length} duplicate entries in input data`);
    console.log(`Proceeding with ${uniqueData.length} unique records`);
    
    // Use createMany for bulk insertion
    const result = await prisma.financialMetrics.createMany({
      data: uniqueData,
      skipDuplicates: true, // Skip records that would cause unique constraint violations
    });
    
    console.log(`Successfully created ${result.count} new records out of ${uniqueData.length} unique records`);
    
    return result.count;
  }

  async getFinancialMetricsBySymbol(symbol: string): Promise<FinancialMetrics[]> {
    return prisma.financialMetrics.findMany({
      where: { symbol },
      orderBy: [
        { year: 'desc' },
        { quarter: 'desc' },
      ],
      include: {
        stock: {
          select: {
            name: true,
            exchange: true,
          },
        },
      },
    });
  }
} 