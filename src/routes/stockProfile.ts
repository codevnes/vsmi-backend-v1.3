import { Router } from 'express';
import { 
  getAllStockProfiles, 
  getStockProfileBySymbol, 
  createStockProfile, 
  updateStockProfile,
  deleteStockProfile,
  upsertStockProfile
} from '../controllers';
import { verifyToken, isAdmin } from '../middlewares';

const router = Router();

// Public routes
router.get('/', getAllStockProfiles);
router.get('/:symbol', getStockProfileBySymbol);

// Protected routes - Admin only
router.post('/', verifyToken, isAdmin, createStockProfile);
router.put('/:symbol', verifyToken, isAdmin, updateStockProfile);
router.delete('/:symbol', verifyToken, isAdmin, deleteStockProfile);
router.post('/upsert', verifyToken, isAdmin, upsertStockProfile);

export default router; 