import { Request, Response } from 'express';
import { prisma } from '../app';
import fscoreService from '../services/fscore.service';

/**
 * Get F-Score analysis for a specific symbol
 */
export const getFScoreAnalysis = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({
        message: 'Symbol parameter is required'
      });
    }

    // Check if an analysis already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAnalysis = await prisma.fScoreAnalysis.findFirst({
      where: {
        symbol,
        analysisDate: {
          gte: today
        }
      },
      orderBy: {
        analysisDate: 'desc'
      }
    });

    // If analysis exists, return it
    if (existingAnalysis) {
      return res.status(200).json(existingAnalysis);
    }

    // Otherwise, process a new analysis
    const analysis = await fscoreService.processFScoreAnalysis(symbol);

    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Error getting F-Score analysis:', error);
    return res.status(500).json({
      message: 'Error getting F-Score analysis',
      error: (error as Error).message
    });
  }
};

/**
 * Batch process F-Score analyses for multiple symbols
 */
export const batchProcessFScoreAnalyses = async (req: Request, res: Response) => {
  try {
    const { symbols } = req.body;

    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return res.status(400).json({
        message: 'Symbols array is required and cannot be empty'
      });
    }

    const result = await fscoreService.batchProcessFScoreAnalyses(symbols);

    return res.status(200).json({
      message: 'Batch processing completed',
      ...result
    });
  } catch (error) {
    console.error('Error batch processing F-Score analyses:', error);
    return res.status(500).json({
      message: 'Error batch processing F-Score analyses',
      error: (error as Error).message
    });
  }
};

/**
 * Get all F-Score analyses with pagination
 */
export const getAllFScoreAnalyses = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', symbol, fromDate, toDate } = req.query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);
    const skip = (parsedPage - 1) * parsedLimit;

    // Build filter conditions
    const where: any = {};
    
    if (symbol) {
      where.symbol = symbol as string;
    }
    
    if (fromDate && toDate) {
      where.analysisDate = {
        gte: new Date(fromDate as string),
        lte: new Date(toDate as string)
      };
    } else if (fromDate) {
      where.analysisDate = {
        gte: new Date(fromDate as string)
      };
    } else if (toDate) {
      where.analysisDate = {
        lte: new Date(toDate as string)
      };
    }

    // Query with pagination and filtering
    const [analyses, total] = await Promise.all([
      prisma.fScoreAnalysis.findMany({
        where,
        orderBy: {
          analysisDate: 'desc'
        },
        skip,
        take: parsedLimit
      }),
      prisma.fScoreAnalysis.count({
        where
      })
    ]);

    const totalPages = Math.ceil(total / parsedLimit);

    return res.status(200).json({
      data: analyses,
      meta: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error getting F-Score analyses:', error);
    return res.status(500).json({
      message: 'Error getting F-Score analyses',
      error: (error as Error).message
    });
  }
}; 