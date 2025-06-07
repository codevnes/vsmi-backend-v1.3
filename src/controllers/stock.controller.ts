import { Request, Response } from 'express';
import { stockService } from '../services';
import { AuthRequest } from '../types';
import { STOCK_MESSAGES } from '../utils/stock.constants';

/**
 * Get all stocks with pagination
 */
export const getAllStocks = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', search, exchange, industry } = req.query;
    
    const result = await stockService.getAllStocks({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: search as string,
      exchange: exchange as string,
      industry: industry as string,
    });
    
    return res.status(200).json({
      message: STOCK_MESSAGES.GET_STOCKS_SUCCESS,
      ...result
    });
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return res.status(500).json({ message: STOCK_MESSAGES.GET_STOCKS_ERROR });
  }
};

/**
 * Get stock by symbol
 */
export const getStockBySymbol = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const stock = await stockService.getStockBySymbol(symbol);
    
    if (!stock) {
      return res.status(404).json({ message: STOCK_MESSAGES.STOCK_NOT_FOUND });
    }
    
    return res.status(200).json({
      message: STOCK_MESSAGES.GET_STOCK_SUCCESS,
      stock
    });
  } catch (error) {
    console.error('Error fetching stock:', error);
    return res.status(500).json({ message: STOCK_MESSAGES.GET_STOCK_ERROR });
  }
};

/**
 * Create a new stock
 */
export const createStock = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol, name } = req.body;
    
    if (!symbol || !name) {
      return res.status(400).json({ message: STOCK_MESSAGES.REQUIRED_FIELDS });
    }
    
    const stock = await stockService.createStock(req.body);
    
    return res.status(201).json({
      message: STOCK_MESSAGES.CREATE_STOCK_SUCCESS,
      stock
    });
  } catch (error) {
    console.error('Error creating stock:', error);
    
    if (error instanceof Error && error.message === 'STOCK_ALREADY_EXISTS') {
      return res.status(409).json({ message: STOCK_MESSAGES.STOCK_ALREADY_EXISTS });
    }
    
    return res.status(500).json({ message: STOCK_MESSAGES.CREATE_STOCK_ERROR });
  }
};

/**
 * Update an existing stock
 */
export const updateStock = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol } = req.params;
    const stock = await stockService.updateStock(symbol, req.body);
    
    if (!stock) {
      return res.status(404).json({ message: STOCK_MESSAGES.STOCK_NOT_FOUND });
    }
    
    return res.status(200).json({
      message: STOCK_MESSAGES.UPDATE_STOCK_SUCCESS,
      stock
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    return res.status(500).json({ message: STOCK_MESSAGES.UPDATE_STOCK_ERROR });
  }
};

/**
 * Delete a stock
 */
export const deleteStock = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol } = req.params;
    await stockService.deleteStock(symbol);
    
    return res.status(200).json({
      message: STOCK_MESSAGES.DELETE_STOCK_SUCCESS
    });
  } catch (error) {
    console.error('Error deleting stock:', error);
    
    if (error instanceof Error && error.message === 'STOCK_NOT_FOUND') {
      return res.status(404).json({ message: STOCK_MESSAGES.STOCK_NOT_FOUND });
    }
    
    return res.status(500).json({ message: STOCK_MESSAGES.DELETE_STOCK_ERROR });
  }
}; 