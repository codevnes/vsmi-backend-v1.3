import { Request, Response } from 'express';
import { FScoreService } from '../services/fscore.service';
import { IFScoreCreate, IFScoreUpdate } from '../repositories/fscore.repository';
import { FSCORE_MESSAGES } from '../utils/fscore.constants';

export class FScoreController {
  private fscoreService: FScoreService;

  constructor() {
    this.fscoreService = new FScoreService();
  }

  /**
   * Get all FScores
   */
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const fscores = await this.fscoreService.getAll();
      res.status(200).json({
        message: FSCORE_MESSAGES.GET_FSCORES_SUCCESS,
        data: fscores
      });
    } catch (error) {
      console.error('Error getting all FScores:', error);
      res.status(500).json({ 
        message: FSCORE_MESSAGES.GET_FSCORES_ERROR 
      });
    }
  };

  /**
   * Get FScore by ID
   */
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const fscore = await this.fscoreService.getById(id);
      
      if (!fscore) {
        res.status(404).json({ 
          message: FSCORE_MESSAGES.FSCORE_NOT_FOUND 
        });
        return;
      }
      
      res.status(200).json({
        message: FSCORE_MESSAGES.GET_FSCORE_SUCCESS,
        data: fscore
      });
    } catch (error) {
      console.error('Error getting FScore by ID:', error);
      res.status(500).json({ 
        message: FSCORE_MESSAGES.GET_FSCORE_ERROR 
      });
    }
  };

  /**
   * Get FScore by symbol
   */
  getBySymbol = async (req: Request, res: Response): Promise<void> => {
    try {
      const symbol = req.params.symbol;
      const fscore = await this.fscoreService.getBySymbol(symbol);
      
      if (!fscore) {
        res.status(404).json({ 
          message: FSCORE_MESSAGES.FSCORE_NOT_FOUND_FOR_SYMBOL 
        });
        return;
      }
      
      res.status(200).json({
        message: FSCORE_MESSAGES.GET_FSCORE_SUCCESS,
        data: fscore
      });
    } catch (error) {
      console.error('Error getting FScore by symbol:', error);
      res.status(500).json({ 
        message: FSCORE_MESSAGES.GET_FSCORE_ERROR 
      });
    }
  };

  /**
   * Create a new FScore
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: IFScoreCreate = req.body;
      
      // Validate required fields
      if (!data.symbol) {
        res.status(400).json({ 
          message: FSCORE_MESSAGES.SYMBOL_REQUIRED 
        });
        return;
      }
      
      // Check if FScore already exists for this symbol
      const existing = await this.fscoreService.getBySymbol(data.symbol);
      if (existing) {
        res.status(409).json({ 
          message: FSCORE_MESSAGES.FSCORE_ALREADY_EXISTS 
        });
        return;
      }

      const fscore = await this.fscoreService.create(data);
      res.status(201).json({
        message: FSCORE_MESSAGES.CREATE_FSCORE_SUCCESS,
        data: fscore
      });
    } catch (error) {
      console.error('Error creating FScore:', error);
      res.status(500).json({ 
        message: FSCORE_MESSAGES.CREATE_FSCORE_ERROR 
      });
    }
  };

  /**
   * Update FScore by ID
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const data: IFScoreUpdate = req.body;
      
      const existingFScore = await this.fscoreService.getById(id);
      
      if (!existingFScore) {
        res.status(404).json({ 
          message: FSCORE_MESSAGES.FSCORE_NOT_FOUND 
        });
        return;
      }
      
      const updatedFScore = await this.fscoreService.update(id, data);
      res.status(200).json({
        message: FSCORE_MESSAGES.UPDATE_FSCORE_SUCCESS,
        data: updatedFScore
      });
    } catch (error) {
      console.error('Error updating FScore:', error);
      res.status(500).json({ 
        message: FSCORE_MESSAGES.UPDATE_FSCORE_ERROR 
      });
    }
  };

  /**
   * Update FScore by symbol
   */
  updateBySymbol = async (req: Request, res: Response): Promise<void> => {
    try {
      const symbol = req.params.symbol;
      const data: IFScoreUpdate = req.body;
      
      const existingFScore = await this.fscoreService.getBySymbol(symbol);
      
      if (!existingFScore) {
        res.status(404).json({ 
          message: FSCORE_MESSAGES.FSCORE_NOT_FOUND_FOR_SYMBOL 
        });
        return;
      }
      
      const updatedFScore = await this.fscoreService.updateBySymbol(symbol, data);
      res.status(200).json({
        message: FSCORE_MESSAGES.UPDATE_FSCORE_SUCCESS,
        data: updatedFScore
      });
    } catch (error) {
      console.error('Error updating FScore by symbol:', error);
      res.status(500).json({ 
        message: FSCORE_MESSAGES.UPDATE_FSCORE_ERROR 
      });
    }
  };

  /**
   * Delete FScore by ID
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      
      const existingFScore = await this.fscoreService.getById(id);
      
      if (!existingFScore) {
        res.status(404).json({ 
          message: FSCORE_MESSAGES.FSCORE_NOT_FOUND 
        });
        return;
      }
      
      await this.fscoreService.delete(id);
      res.status(200).json({
        message: FSCORE_MESSAGES.DELETE_FSCORE_SUCCESS
      });
    } catch (error) {
      console.error('Error deleting FScore:', error);
      res.status(500).json({ 
        message: FSCORE_MESSAGES.DELETE_FSCORE_ERROR 
      });
    }
  };

  /**
   * Delete FScore by symbol
   */
  deleteBySymbol = async (req: Request, res: Response): Promise<void> => {
    try {
      const symbol = req.params.symbol;
      
      const existingFScore = await this.fscoreService.getBySymbol(symbol);
      
      if (!existingFScore) {
        res.status(404).json({ 
          message: FSCORE_MESSAGES.FSCORE_NOT_FOUND_FOR_SYMBOL 
        });
        return;
      }
      
      await this.fscoreService.deleteBySymbol(symbol);
      res.status(200).json({
        message: FSCORE_MESSAGES.DELETE_FSCORE_SUCCESS
      });
    } catch (error) {
      console.error('Error deleting FScore by symbol:', error);
      res.status(500).json({ 
        message: FSCORE_MESSAGES.DELETE_FSCORE_ERROR 
      });
    }
  };

  /**
   * Create or update FScore by symbol
   */
  upsert = async (req: Request, res: Response): Promise<void> => {
    try {
      const symbol = req.params.symbol;
      const data: IFScoreCreate = req.body;
      
      const fscore = await this.fscoreService.upsert(symbol, { ...data, symbol });
      res.status(200).json({
        message: FSCORE_MESSAGES.UPSERT_FSCORE_SUCCESS,
        data: fscore
      });
    } catch (error) {
      console.error('Error upserting FScore:', error);
      res.status(500).json({ 
        message: FSCORE_MESSAGES.UPSERT_FSCORE_ERROR 
      });
    }
  };
} 