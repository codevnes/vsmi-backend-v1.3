import { Request, Response } from 'express';
import { stockProfileService } from '../services';
import { AuthRequest } from '../types';
import { STOCK_PROFILE_MESSAGES } from '../utils/stockProfile.constants';

/**
 * Get all stock profiles with pagination and filtering options
 */
export const getAllStockProfiles = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', search } = req.query;
    
    const result = await stockProfileService.getStockProfiles({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: search as string,
    });
    
    return res.status(200).json({
      message: STOCK_PROFILE_MESSAGES.GET_PROFILES_SUCCESS,
      ...result
    });
  } catch (error) {
    console.error('Error fetching stock profiles:', error);
    return res.status(500).json({ message: STOCK_PROFILE_MESSAGES.GET_PROFILES_ERROR });
  }
};

/**
 * Get stock profile by symbol
 */
export const getStockProfileBySymbol = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    
    const profile = await stockProfileService.getStockProfileBySymbol(symbol);
    
    if (!profile) {
      return res.status(404).json({ message: STOCK_PROFILE_MESSAGES.PROFILE_NOT_FOUND });
    }
    
    return res.status(200).json({
      message: STOCK_PROFILE_MESSAGES.GET_PROFILE_SUCCESS,
      data: profile,
    });
  } catch (error) {
    console.error('Error fetching stock profile:', error);
    return res.status(500).json({ message: STOCK_PROFILE_MESSAGES.GET_PROFILE_ERROR });
  }
};

/**
 * Create a new stock profile
 */
export const createStockProfile = async (req: Request, res: Response) => {
  try {
    const { symbol, price, profit, volume, pe, eps, roa, roe } = req.body;
    
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required' });
    }
    
    const profile = await stockProfileService.createStockProfile({
      symbol,
      price,
      profit,
      volume,
      pe,
      eps,
      roa,
      roe,
    });
    
    return res.status(201).json({
      message: STOCK_PROFILE_MESSAGES.CREATE_PROFILE_SUCCESS,
      data: profile,
    });
  } catch (error: any) {
    console.error('Error creating stock profile:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: STOCK_PROFILE_MESSAGES.STOCK_NOT_FOUND });
    }
    
    if (error.message.includes('already exists')) {
      return res.status(409).json({ message: STOCK_PROFILE_MESSAGES.PROFILE_ALREADY_EXISTS });
    }
    
    return res.status(500).json({ message: STOCK_PROFILE_MESSAGES.CREATE_PROFILE_ERROR });
  }
};

/**
 * Update existing stock profile
 */
export const updateStockProfile = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const { price, profit, volume, pe, eps, roa, roe } = req.body;
    
    const profile = await stockProfileService.updateStockProfile(symbol, {
      price,
      profit,
      volume,
      pe, 
      eps,
      roa,
      roe,
    });
    
    return res.status(200).json({
      message: STOCK_PROFILE_MESSAGES.UPDATE_PROFILE_SUCCESS,
      data: profile,
    });
  } catch (error: any) {
    console.error('Error updating stock profile:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: STOCK_PROFILE_MESSAGES.PROFILE_NOT_FOUND });
    }
    
    return res.status(500).json({ message: STOCK_PROFILE_MESSAGES.UPDATE_PROFILE_ERROR });
  }
};

/**
 * Delete a stock profile
 */
export const deleteStockProfile = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    
    await stockProfileService.deleteStockProfile(symbol);
    
    return res.status(200).json({
      message: STOCK_PROFILE_MESSAGES.DELETE_PROFILE_SUCCESS,
    });
  } catch (error: any) {
    console.error('Error deleting stock profile:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: STOCK_PROFILE_MESSAGES.PROFILE_NOT_FOUND });
    }
    
    return res.status(500).json({ message: STOCK_PROFILE_MESSAGES.DELETE_PROFILE_ERROR });
  }
};

/**
 * Upsert stock profile (create if not exists, update if exists)
 */
export const upsertStockProfile = async (req: Request, res: Response) => {
  try {
    const { symbol, price, profit, volume, pe, eps, roa, roe } = req.body;
    
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required' });
    }
    
    const profile = await stockProfileService.upsertStockProfile({
      symbol,
      price,
      profit,
      volume,
      pe,
      eps,
      roa,
      roe,
    });
    
    return res.status(200).json({
      message: STOCK_PROFILE_MESSAGES.UPSERT_PROFILE_SUCCESS,
      data: profile,
    });
  } catch (error: any) {
    console.error('Error upserting stock profile:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: STOCK_PROFILE_MESSAGES.STOCK_NOT_FOUND });
    }
    
    return res.status(500).json({ message: STOCK_PROFILE_MESSAGES.UPSERT_PROFILE_ERROR });
  }
}; 