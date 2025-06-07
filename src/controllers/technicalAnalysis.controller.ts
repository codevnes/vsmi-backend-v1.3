import { Request, Response } from 'express';
import { technicalAnalysisService } from '../services';
import { AuthRequest } from '../types';
import { TECHNICAL_ANALYSIS_MESSAGES } from '../utils';

/**
 * Get all technical analyses with pagination
 */
export const getTechnicalAnalyses = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', search } = req.query;
    
    const result = await technicalAnalysisService.getAll({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: search as string,
    });
    
    return res.status(200).json({
      message: TECHNICAL_ANALYSIS_MESSAGES.GET_ANALYSES_SUCCESS,
      ...result
    });
  } catch (error: any) {
    console.error('Error fetching technical analyses:', error);
    return res.status(500).json({
      message: TECHNICAL_ANALYSIS_MESSAGES.GET_ANALYSES_ERROR
    });
  }
};

/**
 * Get technical analysis by symbol
 */
export const getTechnicalAnalysisBySymbol = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const technicalAnalysis = await technicalAnalysisService.getBySymbol(symbol);
    
    if (!technicalAnalysis) {
      return res.status(404).json({
        message: TECHNICAL_ANALYSIS_MESSAGES.ANALYSIS_NOT_FOUND_FOR_SYMBOL
      });
    }
    
    return res.status(200).json({
      message: TECHNICAL_ANALYSIS_MESSAGES.GET_ANALYSIS_SUCCESS,
      data: technicalAnalysis,
    });
  } catch (error: any) {
    console.error('Error fetching technical analysis:', error);
    return res.status(500).json({
      message: TECHNICAL_ANALYSIS_MESSAGES.GET_ANALYSIS_ERROR
    });
  }
};

/**
 * Create a new technical analysis
 */
export const createTechnicalAnalysis = async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    
    if (!data.symbol) {
      return res.status(400).json({
        message: TECHNICAL_ANALYSIS_MESSAGES.SYMBOL_REQUIRED
      });
    }
    
    // Check if analysis already exists for this symbol
    const existing = await technicalAnalysisService.getBySymbol(data.symbol);
    if (existing) {
      return res.status(409).json({
        message: TECHNICAL_ANALYSIS_MESSAGES.ANALYSIS_ALREADY_EXISTS
      });
    }
    
    const technicalAnalysis = await technicalAnalysisService.create(data);
    
    return res.status(201).json({
      message: TECHNICAL_ANALYSIS_MESSAGES.CREATE_ANALYSIS_SUCCESS,
      data: technicalAnalysis,
    });
  } catch (error: any) {
    console.error('Error creating technical analysis:', error);
    return res.status(500).json({
      message: TECHNICAL_ANALYSIS_MESSAGES.CREATE_ANALYSIS_ERROR
    });
  }
};

/**
 * Update an existing technical analysis
 */
export const updateTechnicalAnalysis = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol } = req.params;
    const data = req.body;
    
    // Check if analysis exists
    const existing = await technicalAnalysisService.getBySymbol(symbol);
    if (!existing) {
      return res.status(404).json({
        message: TECHNICAL_ANALYSIS_MESSAGES.ANALYSIS_NOT_FOUND_FOR_SYMBOL
      });
    }
    
    const technicalAnalysis = await technicalAnalysisService.update(symbol, data);
    
    return res.status(200).json({
      message: TECHNICAL_ANALYSIS_MESSAGES.UPDATE_ANALYSIS_SUCCESS,
      data: technicalAnalysis,
    });
  } catch (error: any) {
    console.error('Error updating technical analysis:', error);
    return res.status(500).json({
      message: TECHNICAL_ANALYSIS_MESSAGES.UPDATE_ANALYSIS_ERROR
    });
  }
};

/**
 * Upsert technical analysis (create if not exists, update if exists)
 */
export const upsertTechnicalAnalysis = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol } = req.params;
    const data = req.body;
    
    const technicalAnalysis = await technicalAnalysisService.upsert(symbol, data);
    
    return res.status(200).json({
      message: TECHNICAL_ANALYSIS_MESSAGES.UPSERT_ANALYSIS_SUCCESS,
      data: technicalAnalysis,
    });
  } catch (error: any) {
    console.error('Error upserting technical analysis:', error);
    return res.status(500).json({
      message: TECHNICAL_ANALYSIS_MESSAGES.UPSERT_ANALYSIS_ERROR
    });
  }
};

/**
 * Delete a technical analysis
 */
export const deleteTechnicalAnalysis = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol } = req.params;
    
    // Check if analysis exists
    const existing = await technicalAnalysisService.getBySymbol(symbol);
    if (!existing) {
      return res.status(404).json({
        message: TECHNICAL_ANALYSIS_MESSAGES.ANALYSIS_NOT_FOUND_FOR_SYMBOL
      });
    }
    
    await technicalAnalysisService.delete(symbol);
    
    return res.status(200).json({
      message: TECHNICAL_ANALYSIS_MESSAGES.DELETE_ANALYSIS_SUCCESS
    });
  } catch (error: any) {
    console.error('Error deleting technical analysis:', error);
    return res.status(500).json({
      message: TECHNICAL_ANALYSIS_MESSAGES.DELETE_ANALYSIS_ERROR
    });
  }
}; 