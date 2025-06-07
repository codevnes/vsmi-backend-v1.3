import { Router } from 'express';
import { getAllCategories, getCategoryTree, getCategoryById, getCategoryBySlug, createCategory, updateCategory, deleteCategory } from '../controllers';
import { verifyToken, isAdmin, isAuthorOrAdmin } from '../middlewares';

const router = Router();

// Routes công khai - không cần xác thực
router.get('/', getAllCategories);
router.get('/tree', getCategoryTree);
router.get('/id/:id', getCategoryById);
router.get('/slug/:slug', getCategoryBySlug);

// Routes cần xác thực và phân quyền Admin hoặc Author
router.post('/', verifyToken, isAuthorOrAdmin, createCategory);
router.put('/:id', verifyToken, isAuthorOrAdmin, updateCategory);
router.delete('/:id', verifyToken, isAdmin, deleteCategory); // Chỉ admin mới được xóa

export default router; 