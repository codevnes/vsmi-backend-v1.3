import { Router } from 'express';
import * as postController from '../controllers/post.controller';
import { verifyToken, isAdmin, isAuthorOrAdmin } from '../middlewares';

const router = Router();

// Public routes
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.get('/slug/:slug', postController.getPostBySlug);

// Protected routes - Yêu cầu đăng nhập
router.post('/', verifyToken, isAuthorOrAdmin, postController.createPost);
router.put('/:id', verifyToken, isAuthorOrAdmin, postController.updatePost);
router.delete('/:id', verifyToken, isAuthorOrAdmin, postController.softDeletePost);

// Admin routes - Yêu cầu quyền admin
router.put('/restore/:id', verifyToken, isAdmin, postController.restorePost);
router.delete('/permanent/:id', verifyToken, isAdmin, postController.deletePost);

export default router; 