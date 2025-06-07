import { Request, Response } from 'express';
import { selectedStocksRepository } from '../repositories';
import { ISelectedStocksCreate, ISelectedStocksUpdate } from '../models';
import { SELECTED_STOCKS_MESSAGES } from '../utils/selectedStocks.constants';

/**
 * Get all selected stocks with pagination
 */
export const getAllSelectedStocks = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const sort = req.query.sort as string || 'date';
    const order = req.query.order as 'asc' | 'desc' || 'desc';

    const result = await selectedStocksRepository.findAll({
      page,
      limit,
      sort,
      order,
    });

    return res.status(200).json({
      message: SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_SUCCESS,
      ...result
    });
  } catch (error) {
    console.error('Error getting all selected stocks:', error);
    return res.status(500).json({ 
      message: SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_ERROR 
    });
  }
};

/**
 * Get selected stocks by symbol with pagination
 */
export const getSelectedStocksBySymbol = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const sort = req.query.sort as string || 'date';
    const order = req.query.order as 'asc' | 'desc' || 'desc';

    const result = await selectedStocksRepository.findBySymbol(symbol, {
      page,
      limit,
      sort,
      order,
    });

    return res.status(200).json({
      message: SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_SUCCESS,
      ...result
    });
  } catch (error) {
    console.error(`Error getting selected stocks for symbol ${req.params.symbol}:`, error);
    return res.status(500).json({ 
      message: SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_ERROR 
    });
  }
};

/**
 * Get selected stocks by date
 */
export const getSelectedStocksByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        message: SELECTED_STOCKS_MESSAGES.INVALID_DATE_FORMAT
      });
    }

    const result = await selectedStocksRepository.findByDate(dateObj);

    return res.status(200).json({
      message: SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_SUCCESS,
      data: result
    });
  } catch (error) {
    console.error(`Error getting selected stocks for date ${req.params.date}:`, error);
    return res.status(500).json({ 
      message: SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_ERROR 
    });
  }
};

/**
 * Get top selected stocks by Q-Index
 */
export const getTopSelectedStocksByQIndex = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    // Validate dates if provided
    if (
      (startDate && isNaN(startDate.getTime())) ||
      (endDate && isNaN(endDate.getTime()))
    ) {
      return res.status(400).json({
        message: SELECTED_STOCKS_MESSAGES.INVALID_DATE_FORMAT
      });
    }

    const result = await selectedStocksRepository.findTopByQIndex(limit, startDate, endDate);

    return res.status(200).json({
      message: SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_SUCCESS,
      data: result
    });
  } catch (error) {
    console.error('Error getting top selected stocks by Q-Index:', error);
    return res.status(500).json({ 
      message: SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCKS_ERROR 
    });
  }
};

/**
 * Get selected stock by ID
 */
export const getSelectedStockById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await selectedStocksRepository.findById(id);

    if (!result) {
      return res.status(404).json({
        message: SELECTED_STOCKS_MESSAGES.SELECTED_STOCK_NOT_FOUND
      });
    }

    return res.status(200).json({
      message: SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCK_SUCCESS,
      data: result
    });
  } catch (error) {
    console.error(`Error getting selected stock with id ${req.params.id}:`, error);
    return res.status(500).json({ 
      message: SELECTED_STOCKS_MESSAGES.GET_SELECTED_STOCK_ERROR 
    });
  }
};

/**
 * Create a new selected stock
 */
export const createSelectedStock = async (req: Request, res: Response) => {
  try {
    const data = req.body as ISelectedStocksCreate;

    // Validate required fields
    if (!data.symbol || !data.date) {
      return res.status(400).json({
        message: SELECTED_STOCKS_MESSAGES.REQUIRED_FIELDS
      });
    }

    // Convert date string to Date object
    if (typeof data.date === 'string') {
      data.date = new Date(data.date);
      
      if (isNaN(data.date.getTime())) {
        return res.status(400).json({
          message: SELECTED_STOCKS_MESSAGES.INVALID_DATE_FORMAT
        });
      }
    }

    // Check if the selected stock already exists
    const existingStock = await selectedStocksRepository.findBySymbolAndDate(
      data.symbol,
      data.date
    );

    if (existingStock) {
      return res.status(409).json({
        message: SELECTED_STOCKS_MESSAGES.SELECTED_STOCK_ALREADY_EXISTS
      });
    }

    const result = await selectedStocksRepository.create(data);

    return res.status(201).json({
      message: SELECTED_STOCKS_MESSAGES.CREATE_SELECTED_STOCK_SUCCESS,
      data: result
    });
  } catch (error) {
    console.error('Error creating selected stock:', error);
    return res.status(500).json({ 
      message: SELECTED_STOCKS_MESSAGES.CREATE_SELECTED_STOCK_ERROR 
    });
  }
};

/**
 * Update a selected stock
 */
export const updateSelectedStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body as ISelectedStocksUpdate;

    // Check if the selected stock exists
    const existingStock = await selectedStocksRepository.findById(id);

    if (!existingStock) {
      return res.status(404).json({
        message: SELECTED_STOCKS_MESSAGES.SELECTED_STOCK_NOT_FOUND
      });
    }

    // Convert date string to Date object if provided
    if (data.date && typeof data.date === 'string') {
      data.date = new Date(data.date);
      
      if (isNaN(data.date.getTime())) {
        return res.status(400).json({
          message: SELECTED_STOCKS_MESSAGES.INVALID_DATE_FORMAT
        });
      }
    }

    // Check for symbol and date uniqueness if either is being updated
    if (
      (data.symbol && data.symbol !== existingStock.symbol) ||
      (data.date && data.date.getTime() !== existingStock.date.getTime())
    ) {
      const newSymbol = data.symbol || existingStock.symbol;
      const newDate = data.date || existingStock.date;

      const duplicateStock = await selectedStocksRepository.findBySymbolAndDate(
        newSymbol,
        newDate
      );

      if (duplicateStock && duplicateStock.id !== id) {
        return res.status(409).json({
          message: SELECTED_STOCKS_MESSAGES.SELECTED_STOCK_ALREADY_EXISTS
        });
      }
    }

    const result = await selectedStocksRepository.update(id, data);

    return res.status(200).json({
      message: SELECTED_STOCKS_MESSAGES.UPDATE_SELECTED_STOCK_SUCCESS,
      data: result
    });
  } catch (error) {
    console.error(`Error updating selected stock with id ${req.params.id}:`, error);
    return res.status(500).json({ 
      message: SELECTED_STOCKS_MESSAGES.UPDATE_SELECTED_STOCK_ERROR 
    });
  }
};

/**
 * Delete a selected stock
 */
export const deleteSelectedStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if the selected stock exists
    const existingStock = await selectedStocksRepository.findById(id);

    if (!existingStock) {
      return res.status(404).json({
        message: SELECTED_STOCKS_MESSAGES.SELECTED_STOCK_NOT_FOUND
      });
    }

    await selectedStocksRepository.delete(id);

    return res.status(200).json({
      message: SELECTED_STOCKS_MESSAGES.DELETE_SELECTED_STOCK_SUCCESS
    });
  } catch (error) {
    console.error(`Error deleting selected stock with id ${req.params.id}:`, error);
    return res.status(500).json({ 
      message: SELECTED_STOCKS_MESSAGES.DELETE_SELECTED_STOCK_ERROR 
    });
  }
};

/**
 * Delete multiple selected stocks
 */
export const deleteMultipleSelectedStocks = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: 'Invalid or empty ids array'
      });
    }

    const count = await selectedStocksRepository.deleteMany(ids);

    return res.status(200).json({
      message: `${count} selected stock(s) deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting multiple selected stocks:', error);
    return res.status(500).json({ 
      message: SELECTED_STOCKS_MESSAGES.DELETE_SELECTED_STOCK_ERROR 
    });
  }
}; 