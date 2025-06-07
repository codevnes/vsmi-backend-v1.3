import { prisma } from '../app';
import { TechnicalAnalysisDto } from '../types';

interface GetAllTechnicalAnalysesParams {
  page: number;
  limit: number;
  search?: string;
}

export class TechnicalAnalysisService {
  async getAll({ page, limit, search }: GetAllTechnicalAnalysesParams) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { symbol: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    const [technicalAnalyses, total] = await Promise.all([
      prisma.technicalAnalysis.findMany({
        where,
        skip,
        take: limit,
        orderBy: { symbol: 'asc' },
        include: {
          stock: true,
        },
      }),
      prisma.technicalAnalysis.count({ where }),
    ]);
    
    return {
      data: technicalAnalyses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBySymbol(symbol: string) {
    return prisma.technicalAnalysis.findUnique({
      where: {
        symbol,
      },
      include: {
        stock: true,
      },
    });
  }

  async create(data: TechnicalAnalysisDto) {
    return prisma.technicalAnalysis.create({
      data: {
        symbol: data.symbol,
        stock: {
          connect: {
            symbol: data.symbol,
          },
        },
        close: data.close,
        
        rsi14: data.rsi14,
        rsiEvaluation: data.rsiEvaluation,
        
        stochasticK: data.stochasticK,
        stochasticEvaluation: data.stochasticEvaluation,
        
        williamsR: data.williamsR,
        williamsEvaluation: data.williamsEvaluation,
        
        ultimateOscillator: data.ultimateOscillator,
        ultimateOscillatorEvaluation: data.ultimateOscillatorEvaluation,
        
        cci20: data.cci20,
        cciEvaluation: data.cciEvaluation,
        
        stochasticRsiFast: data.stochasticRsiFast,
        stochasticRsiFastEvaluation: data.stochasticRsiFastEvaluation,
        
        macdLevel: data.macdLevel,
        macdEvaluation: data.macdEvaluation,
        
        adx14: data.adx14,
        adxEvaluation: data.adxEvaluation,
        
        momentum10: data.momentum10,
        momentumEvaluation: data.momentumEvaluation,
        
        ma10: data.ma10,
        ma10Evaluation: data.ma10Evaluation,
        
        ma20: data.ma20,
        ma20Evaluation: data.ma20Evaluation,
        
        ma30: data.ma30,
        ma30Evaluation: data.ma30Evaluation,
        
        ma50: data.ma50,
        ma50Evaluation: data.ma50Evaluation,
        
        ma100: data.ma100,
        ma100Evaluation: data.ma100Evaluation,
        
        ma200: data.ma200,
        ma200Evaluation: data.ma200Evaluation,
        
        hma9: data.hma9,
        hma9Evaluation: data.hma9Evaluation,
        
        ichimokuBaseLine: data.ichimokuBaseLine,
        ichimokuBaseLineEvaluation: data.ichimokuBaseLineEvaluation,
      },
      include: {
        stock: true,
      },
    });
  }

  async update(symbol: string, data: Partial<TechnicalAnalysisDto>) {
    return prisma.technicalAnalysis.update({
      where: { symbol },
      data,
      include: {
        stock: true,
      },
    });
  }

  async upsert(symbol: string, data: Partial<TechnicalAnalysisDto>) {
    return prisma.technicalAnalysis.upsert({
      where: { symbol },
      create: {
        symbol,
        stock: {
          connect: {
            symbol,
          },
        },
        close: data.close,
        
        rsi14: data.rsi14,
        rsiEvaluation: data.rsiEvaluation,
        
        stochasticK: data.stochasticK,
        stochasticEvaluation: data.stochasticEvaluation,
        
        williamsR: data.williamsR,
        williamsEvaluation: data.williamsEvaluation,
        
        ultimateOscillator: data.ultimateOscillator,
        ultimateOscillatorEvaluation: data.ultimateOscillatorEvaluation,
        
        cci20: data.cci20,
        cciEvaluation: data.cciEvaluation,
        
        stochasticRsiFast: data.stochasticRsiFast,
        stochasticRsiFastEvaluation: data.stochasticRsiFastEvaluation,
        
        macdLevel: data.macdLevel,
        macdEvaluation: data.macdEvaluation,
        
        adx14: data.adx14,
        adxEvaluation: data.adxEvaluation,
        
        momentum10: data.momentum10,
        momentumEvaluation: data.momentumEvaluation,
        
        ma10: data.ma10,
        ma10Evaluation: data.ma10Evaluation,
        
        ma20: data.ma20,
        ma20Evaluation: data.ma20Evaluation,
        
        ma30: data.ma30,
        ma30Evaluation: data.ma30Evaluation,
        
        ma50: data.ma50,
        ma50Evaluation: data.ma50Evaluation,
        
        ma100: data.ma100,
        ma100Evaluation: data.ma100Evaluation,
        
        ma200: data.ma200,
        ma200Evaluation: data.ma200Evaluation,
        
        hma9: data.hma9,
        hma9Evaluation: data.hma9Evaluation,
        
        ichimokuBaseLine: data.ichimokuBaseLine,
        ichimokuBaseLineEvaluation: data.ichimokuBaseLineEvaluation,
      },
      update: data,
      include: {
        stock: true,
      },
    });
  }

  async delete(symbol: string) {
    return prisma.technicalAnalysis.delete({
      where: { symbol },
    });
  }
} 