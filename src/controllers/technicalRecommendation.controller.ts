import { Request, Response } from 'express';
import { technicalRecommendationService } from '../services';
import { AuthRequest } from '../types';
import { TECHNICAL_RECOMMENDATION_MESSAGES } from '../utils/technicalRecommendation.constants';

/**
 * Get all technical recommendations with pagination
 */
export const getTechnicalRecommendations = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', symbol, startDate, endDate } = req.query;
    
    const result = await technicalRecommendationService.getAll({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      symbol: symbol as string,
      startDate: startDate as string,
      endDate: endDate as string,
    });
    
    return res.status(200).json({
      message: TECHNICAL_RECOMMENDATION_MESSAGES.GET_RECOMMENDATIONS_SUCCESS,
      ...result
    });
  } catch (error: any) {
    console.error('Error fetching technical recommendations:', error);
    return res.status(500).json({
      message: TECHNICAL_RECOMMENDATION_MESSAGES.GET_RECOMMENDATIONS_ERROR
    });
  }
};

/**
 * Get technical recommendation by symbol and date
 */
export const getTechnicalRecommendationBySymbolAndDate = async (req: Request, res: Response) => {
  try {
    const { symbol, date } = req.params;
    
    if (!symbol) {
      return res.status(400).json({
        message: TECHNICAL_RECOMMENDATION_MESSAGES.SYMBOL_REQUIRED
      });
    }
    
    if (!date) {
      return res.status(400).json({
        message: TECHNICAL_RECOMMENDATION_MESSAGES.DATE_REQUIRED
      });
    }
    
    const recommendation = await technicalRecommendationService.getBySymbolAndDate(symbol, date);
    
    if (!recommendation) {
      return res.status(404).json({
        message: TECHNICAL_RECOMMENDATION_MESSAGES.RECOMMENDATION_NOT_FOUND_FOR_SYMBOL_AND_DATE
      });
    }
    
    return res.status(200).json({
      message: TECHNICAL_RECOMMENDATION_MESSAGES.GET_RECOMMENDATION_SUCCESS,
      data: recommendation,
    });
  } catch (error: any) {
    console.error('Error fetching technical recommendation:', error);
    return res.status(500).json({
      message: TECHNICAL_RECOMMENDATION_MESSAGES.GET_RECOMMENDATION_ERROR
    });
  }
};

/**
 * Get latest technical recommendation by symbol
 */
export const getLatestTechnicalRecommendationBySymbol = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({
        message: TECHNICAL_RECOMMENDATION_MESSAGES.SYMBOL_REQUIRED
      });
    }
    
    const recommendation = await technicalRecommendationService.getLatestBySymbol(symbol);
    
    if (!recommendation) {
      return res.status(404).json({
        message: TECHNICAL_RECOMMENDATION_MESSAGES.RECOMMENDATION_NOT_FOUND_FOR_SYMBOL_AND_DATE
      });
    }
    
    return res.status(200).json({
      message: TECHNICAL_RECOMMENDATION_MESSAGES.GET_RECOMMENDATION_SUCCESS,
      data: recommendation,
    });
  } catch (error: any) {
    console.error('Error fetching latest technical recommendation:', error);
    return res.status(500).json({
      message: TECHNICAL_RECOMMENDATION_MESSAGES.GET_RECOMMENDATION_ERROR
    });
  }
};

/**
 * Create a new technical recommendation
 */
export const createTechnicalRecommendation = async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    
    if (!data.symbol) {
      return res.status(400).json({
        message: TECHNICAL_RECOMMENDATION_MESSAGES.SYMBOL_REQUIRED
      });
    }
    
    if (!data.date) {
      return res.status(400).json({
        message: TECHNICAL_RECOMMENDATION_MESSAGES.DATE_REQUIRED
      });
    }
    
    // Check if recommendation already exists for this symbol and date
    const existing = await technicalRecommendationService.getBySymbolAndDate(data.symbol, data.date);
    if (existing) {
      return res.status(409).json({
        message: TECHNICAL_RECOMMENDATION_MESSAGES.RECOMMENDATION_ALREADY_EXISTS
      });
    }
    
    const recommendation = await technicalRecommendationService.create(data);
    
    return res.status(201).json({
      message: TECHNICAL_RECOMMENDATION_MESSAGES.CREATE_RECOMMENDATION_SUCCESS,
      data: recommendation,
    });
  } catch (error: any) {
    console.error('Error creating technical recommendation:', error);
    return res.status(500).json({
      message: TECHNICAL_RECOMMENDATION_MESSAGES.CREATE_RECOMMENDATION_ERROR
    });
  }
};

/**
 * Update an existing technical recommendation
 */
export const updateTechnicalRecommendation = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol, date } = req.params;
    const data = req.body;
    
    if (!symbol) {
      return res.status(400).json({
        message: TECHNICAL_RECOMMENDATION_MESSAGES.SYMBOL_REQUIRED
      });
    }
    
    if (!date) {
      return res.status(400).json({
        message: TECHNICAL_RECOMMENDATION_MESSAGES.DATE_REQUIRED
      });
    }
    
    // Check if recommendation exists
    const existing = await technicalRecommendationService.getBySymbolAndDate(symbol, date);
    if (!existing) {
      return res.status(404).json({
        message: TECHNICAL_RECOMMENDATION_MESSAGES.RECOMMENDATION_NOT_FOUND_FOR_SYMBOL_AND_DATE
      });
    }
    
    const recommendation = await technicalRecommendationService.update(symbol, date, data);
    
    return res.status(200).json({
      message: TECHNICAL_RECOMMENDATION_MESSAGES.UPDATE_RECOMMENDATION_SUCCESS,
      data: recommendation,
    });
  } catch (error: any) {
    console.error('Error updating technical recommendation:', error);
    return res.status(500).json({
      message: TECHNICAL_RECOMMENDATION_MESSAGES.UPDATE_RECOMMENDATION_ERROR
    });
  }
};

/**
 * Upsert technical recommendation (create if not exists, update if exists)
 */
export const upsertTechnicalRecommendation = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol, date } = req.params;
    const data = req.body;
    
    if (!symbol) {
      return res.status(400).json({
        message: TECHNICAL_RECOMMENDATION_MESSAGES.SYMBOL_REQUIRED
      });
    }
    
    if (!date) {
      return res.status(400).json({
        message: TECHNICAL_RECOMMENDATION_MESSAGES.DATE_REQUIRED
      });
    }
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        message: TECHNICAL_RECOMMENDATION_MESSAGES.INVALID_DATE_FORMAT
      });
    }
    
    const recommendation = await technicalRecommendationService.upsert(symbol, dateObj, data);
    
    return res.status(200).json({
      message: TECHNICAL_RECOMMENDATION_MESSAGES.UPSERT_RECOMMENDATION_SUCCESS,
      data: recommendation,
    });
  } catch (error: any) {
    console.error('Error upserting technical recommendation:', error);
    return res.status(500).json({
      message: TECHNICAL_RECOMMENDATION_MESSAGES.UPSERT_RECOMMENDATION_ERROR
    });
  }
};

/**
 * Delete a technical recommendation
 */
export const deleteTechnicalRecommendation = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol, date } = req.params;
    
    if (!symbol) {
      return res.status(400).json({
        message: TECHNICAL_RECOMMENDATION_MESSAGES.SYMBOL_REQUIRED
      });
    }
    
    if (!date) {
      return res.status(400).json({
        message: TECHNICAL_RECOMMENDATION_MESSAGES.DATE_REQUIRED
      });
    }
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        message: TECHNICAL_RECOMMENDATION_MESSAGES.INVALID_DATE_FORMAT
      });
    }
    
    // Check if recommendation exists
    const existing = await technicalRecommendationService.getBySymbolAndDate(symbol, date);
    if (!existing) {
      return res.status(404).json({
        message: TECHNICAL_RECOMMENDATION_MESSAGES.RECOMMENDATION_NOT_FOUND_FOR_SYMBOL_AND_DATE
      });
    }
    
    await technicalRecommendationService.delete(symbol, dateObj);
    
    return res.status(200).json({
      message: TECHNICAL_RECOMMENDATION_MESSAGES.DELETE_RECOMMENDATION_SUCCESS
    });
  } catch (error: any) {
    console.error('Error deleting technical recommendation:', error);
    return res.status(500).json({
      message: TECHNICAL_RECOMMENDATION_MESSAGES.DELETE_RECOMMENDATION_ERROR
    });
  }
}; 