import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers';
import { verifyToken, isAdmin } from '../middlewares';

const router = Router();

// Tất cả các routes đều yêu cầu xác thực
router.use(verifyToken);

// Routes quản lý người dùng - chỉ cho admin
router.get('/', isAdmin, getAllUsers);
router.get('/:id', isAdmin, getUserById);
router.post('/', isAdmin, createUser);
router.put('/:id', isAdmin, updateUser);
router.delete('/:id', isAdmin, deleteUser);

export default router; 