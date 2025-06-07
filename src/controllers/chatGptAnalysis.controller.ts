import { Request, Response } from 'express';
import { prisma } from '../app';
import { openAIService } from '../services';

/**
 * Get all ChatGPT analyses with pagination
 */
export const getChatGptAnalyses = async (req: Request, res: Response) => {
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
      prisma.chatGptAnalysis.findMany({
        where,
        orderBy: {
          analysisDate: 'desc'
        },
        skip,
        take: parsedLimit
      }),
      prisma.chatGptAnalysis.count({
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
    console.error('Error getting ChatGPT analyses:', error);
    return res.status(500).json({
      message: 'Lỗi khi truy vấn phân tích ChatGPT',
      error: (error as Error).message
    });
  }
};

/**
 * Get a specific ChatGPT analysis by symbol and date
 */
export const getChatGptAnalysisBySymbolAndDate = async (req: Request, res: Response) => {
  try {
    const { symbol, date } = req.params;

    const analysis = await prisma.chatGptAnalysis.findUnique({
      where: {
        symbol_analysisDate: {
          symbol,
          analysisDate: new Date(date)
        }
      }
    });

    if (!analysis) {
      return res.status(404).json({
        message: `Không tìm thấy phân tích ChatGPT cho mã ${symbol} vào ngày ${date}`
      });
    }

    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Error getting ChatGPT analysis by symbol and date:', error);
    return res.status(500).json({
      message: 'Lỗi khi truy vấn phân tích ChatGPT',
      error: (error as Error).message
    });
  }
};

/**
 * Get latest ChatGPT analysis for a symbol
 */
export const getLatestChatGptAnalysisBySymbol = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;

    const analysis = await prisma.chatGptAnalysis.findFirst({
      where: {
        symbol
      },
      orderBy: {
        analysisDate: 'desc'
      }
    });

    if (!analysis) {
      return res.status(404).json({
        message: `Không tìm thấy phân tích ChatGPT mới nhất cho mã ${symbol}`
      });
    }

    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Error getting latest ChatGPT analysis for symbol:', error);
    return res.status(500).json({
      message: 'Lỗi khi truy vấn phân tích ChatGPT mới nhất',
      error: (error as Error).message
    });
  }
};

/**
 * Process and create a new ChatGPT analysis
 */
export const processChatGptAnalysis = async (req: Request, res: Response) => {
  try {
    const { symbol, date } = req.body;

    if (!symbol || !date) {
      return res.status(400).json({
        message: 'Thiếu thông tin cần thiết: symbol và date là bắt buộc'
      });
    }

    const analysis = await openAIService.processTechnicalRecommendation(symbol, date);

    return res.status(201).json({
      message: 'Phân tích ChatGPT được tạo thành công',
      data: analysis
    });
  } catch (error) {
    console.error('Error processing ChatGPT analysis:', error);
    return res.status(500).json({
      message: 'Lỗi khi xử lý phân tích ChatGPT',
      error: (error as Error).message
    });
  }
};

/**
 * Delete a ChatGPT analysis
 */
export const deleteChatGptAnalysis = async (req: Request, res: Response) => {
  try {
    const { symbol, date } = req.params;

    await prisma.chatGptAnalysis.delete({
      where: {
        symbol_analysisDate: {
          symbol,
          analysisDate: new Date(date)
        }
      }
    });

    return res.status(200).json({
      message: 'Phân tích ChatGPT đã được xóa thành công'
    });
  } catch (error) {
    console.error('Error deleting ChatGPT analysis:', error);
    return res.status(500).json({
      message: 'Lỗi khi xóa phân tích ChatGPT',
      error: (error as Error).message
    });
  }
};

/**
 * Batch process multiple ChatGPT analyses
 */
export const batchProcessChatGptAnalyses = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Thiếu thông tin cần thiết: items phải là một mảng không rỗng'
      });
    }

    const results = [];
    const errors = [];

    // Process each item sequentially to avoid rate limiting
    for (const item of items) {
      try {
        const { symbol, date } = item;
        if (!symbol || !date) {
          errors.push({ 
            symbol, 
            date, 
            error: 'Thiếu thông tin cần thiết: symbol và date là bắt buộc' 
          });
          continue;
        }

        const analysis = await openAIService.processTechnicalRecommendation(symbol, date);
        results.push(analysis);
      } catch (error) {
        errors.push({ 
          ...item, 
          error: (error as Error).message 
        });
      }
    }

    return res.status(200).json({
      message: 'Quá trình xử lý hàng loạt hoàn tất',
      results,
      errors,
      success: results.length,
      failed: errors.length
    });
  } catch (error) {
    console.error('Error batch processing ChatGPT analyses:', error);
    return res.status(500).json({
      message: 'Lỗi khi xử lý hàng loạt phân tích ChatGPT',
      error: (error as Error).message
    });
  }
}; 