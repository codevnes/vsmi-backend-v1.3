import { Request, Response } from 'express';
import { stockPriceService } from '../services';
import { AuthRequest } from '../types';
import { STOCK_PRICE_MESSAGES } from '../utils/stockPrice.constants';
import { bigIntSerializer } from '../utils/helpers';

export const getStockPrices = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const { startDate, endDate, page = '1', limit = '30' } = req.query;
    
    const result = await stockPriceService.getStockPrices({
      symbol,
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
    
    return res.status(200).json({
      message: STOCK_PRICE_MESSAGES.GET_STOCK_PRICES_SUCCESS,
      ...bigIntSerializer(result)
    });
  } catch (error) {
    console.error('Error fetching stock prices:', error);
    return res.status(500).json({ message: STOCK_PRICE_MESSAGES.GET_STOCK_PRICES_ERROR });
  }
};

export const getStockPriceByDate = async (req: Request, res: Response) => {
  try {
    const { symbol, date } = req.params;
    
    const stockPrice = await stockPriceService.getStockPriceByDate(symbol, date);
    
    if (!stockPrice) {
      return res.status(404).json({ message: STOCK_PRICE_MESSAGES.STOCK_PRICE_NOT_FOUND });
    }
    
    return res.status(200).json({
      message: STOCK_PRICE_MESSAGES.GET_STOCK_PRICE_SUCCESS,
      stockPrice: bigIntSerializer(stockPrice)
    });
  } catch (error) {
    console.error('Error fetching stock price:', error);
    return res.status(500).json({ message: STOCK_PRICE_MESSAGES.GET_STOCK_PRICE_ERROR });
  }
};

export const createStockPrice = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol, date, open, high, low, close, volume, trendQ, fq, bandDown, bandUp } = req.body;
    
    if (!symbol || !date || !open || !high || !low || !close) {
      return res.status(400).json({ message: STOCK_PRICE_MESSAGES.REQUIRED_FIELDS });
    }
    
    const stockPrice = await stockPriceService.createStockPrice({
      symbol,
      date: new Date(date),
      open: parseFloat(open),
      high: parseFloat(high),
      low: parseFloat(low),
      close: parseFloat(close),
      volume: volume ? parseInt(volume) : undefined,
      trendQ: trendQ ? parseFloat(trendQ) : undefined,
      fq: fq ? parseFloat(fq) : undefined,
      bandDown: bandDown ? parseFloat(bandDown) : undefined,
      bandUp: bandUp ? parseFloat(bandUp) : undefined,
    });
    
    return res.status(201).json({
      message: STOCK_PRICE_MESSAGES.CREATE_STOCK_PRICE_SUCCESS,
      stockPrice: bigIntSerializer(stockPrice)
    });
  } catch (error) {
    console.error('Error creating stock price:', error);
    
    if (error instanceof Error) {
      if (error.message === 'STOCK_NOT_FOUND') {
        return res.status(404).json({ message: 'Stock not found' });
      }
      if (error.message === 'STOCK_PRICE_ALREADY_EXISTS') {
        return res.status(409).json({ message: STOCK_PRICE_MESSAGES.STOCK_PRICE_ALREADY_EXISTS });
      }
    }
    
    return res.status(500).json({ message: STOCK_PRICE_MESSAGES.CREATE_STOCK_PRICE_ERROR });
  }
};

export const updateStockPrice = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol, date } = req.params;
    const { open, high, low, close, volume, trendQ, fq, bandDown, bandUp } = req.body;
    
    const updateData: any = {};
    if (open !== undefined) updateData.open = parseFloat(open);
    if (high !== undefined) updateData.high = parseFloat(high);
    if (low !== undefined) updateData.low = parseFloat(low);
    if (close !== undefined) updateData.close = parseFloat(close);
    if (volume !== undefined) updateData.volume = parseInt(volume);
    if (trendQ !== undefined) updateData.trendQ = parseFloat(trendQ);
    if (fq !== undefined) updateData.fq = parseFloat(fq);
    if (bandDown !== undefined) updateData.bandDown = parseFloat(bandDown);
    if (bandUp !== undefined) updateData.bandUp = parseFloat(bandUp);
    
    const stockPrice = await stockPriceService.updateStockPrice(symbol, date, updateData);
    
    if (!stockPrice) {
      return res.status(404).json({ message: STOCK_PRICE_MESSAGES.STOCK_PRICE_NOT_FOUND });
    }
    
    return res.status(200).json({
      message: STOCK_PRICE_MESSAGES.UPDATE_STOCK_PRICE_SUCCESS,
      stockPrice: bigIntSerializer(stockPrice)
    });
  } catch (error) {
    console.error('Error updating stock price:', error);
    return res.status(500).json({ message: STOCK_PRICE_MESSAGES.UPDATE_STOCK_PRICE_ERROR });
  }
};

export const deleteStockPrice = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol, date } = req.params;
    
    await stockPriceService.deleteStockPrice(symbol, date);
    
    return res.status(200).json({
      message: STOCK_PRICE_MESSAGES.DELETE_STOCK_PRICE_SUCCESS
    });
  } catch (error) {
    console.error('Error deleting stock price:', error);
    
    if (error instanceof Error && error.message === 'STOCK_PRICE_NOT_FOUND') {
      return res.status(404).json({ message: STOCK_PRICE_MESSAGES.STOCK_PRICE_NOT_FOUND });
    }
    
    return res.status(500).json({ message: STOCK_PRICE_MESSAGES.DELETE_STOCK_PRICE_ERROR });
  }
};

export const getLatestStockPrice = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    
    const stockPrice = await stockPriceService.getLatestStockPrice(symbol);
    
    if (!stockPrice) {
      return res.status(404).json({ message: STOCK_PRICE_MESSAGES.STOCK_PRICE_NOT_FOUND });
    }
    
    return res.status(200).json({
      message: STOCK_PRICE_MESSAGES.GET_STOCK_PRICE_SUCCESS,
      stockPrice: bigIntSerializer(stockPrice)
    });
  } catch (error) {
    console.error('Error fetching latest stock price:', error);
    return res.status(500).json({ message: STOCK_PRICE_MESSAGES.GET_STOCK_PRICE_ERROR });
  }
};

export const bulkCreateStockPrices = async (req: AuthRequest, res: Response) => {
  try {
    const { stockPrices } = req.body;
    
    if (!Array.isArray(stockPrices) || stockPrices.length === 0) {
      return res.status(400).json({ message: STOCK_PRICE_MESSAGES.INVALID_DATA });
    }
    
    const processedData = stockPrices.map(item => ({
      symbol: item.symbol,
      date: new Date(item.date),
      open: parseFloat(item.open),
      high: parseFloat(item.high),
      low: parseFloat(item.low),
      close: parseFloat(item.close),
      volume: item.volume ? parseInt(item.volume) : undefined,
      trendQ: item.trendQ ? parseFloat(item.trendQ) : undefined,
      fq: item.fq ? parseFloat(item.fq) : undefined,
      bandDown: item.bandDown ? parseFloat(item.bandDown) : undefined,
      bandUp: item.bandUp ? parseFloat(item.bandUp) : undefined,
    }));
    
    const count = await stockPriceService.bulkCreateStockPrices(processedData);
    
    return res.status(201).json({
      message: STOCK_PRICE_MESSAGES.BULK_CREATE_SUCCESS,
      count: bigIntSerializer(count)
    });
  } catch (error) {
    console.error('Error processing bulk stock prices:', error);
    return res.status(500).json({ message: STOCK_PRICE_MESSAGES.BULK_CREATE_ERROR });
  }
}; 