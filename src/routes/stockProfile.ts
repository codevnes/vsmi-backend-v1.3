import { Router } from 'express';
import { 
  getAllStockProfiles, 
  getStockProfileBySymbol, 
  createStockProfile, 
  updateStockProfile,
  deleteStockProfile,
  upsertStockProfile
} from '../controllers/stockProfile.controller';
import { verifyToken, isAdmin } from '../middlewares';
import { AsyncRequestHandler } from '../types/express';

const router = Router();

// Public routes
router.get('/', getAllStockProfiles as AsyncRequestHandler);
router.get('/:symbol', getStockProfileBySymbol as AsyncRequestHandler);

// Protected routes - Admin only
router.post('/', verifyToken, isAdmin, createStockProfile as AsyncRequestHandler);
router.put('/:symbol', verifyToken, isAdmin, updateStockProfile as AsyncRequestHandler);
router.delete('/:symbol', verifyToken, isAdmin, deleteStockProfile as AsyncRequestHandler);
router.post('/upsert', verifyToken, isAdmin, upsertStockProfile as AsyncRequestHandler);

export default router; 