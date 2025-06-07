import { Router } from 'express';
import { getAllImages, getImageById, uploadImage, updateImage, deleteImage } from '../controllers';
import { verifyToken, isAdmin, isAuthorOrAdmin, upload, validateFile } from '../middlewares';

const router = Router();

// Routes công khai - không cần xác thực
router.get('/', getAllImages);
router.get('/:id', getImageById);

// Routes cần xác thực và phân quyền Admin hoặc Author
router.post(
  '/',
  verifyToken,
  isAuthorOrAdmin,
  upload.single('image'), 
  validateFile,
  uploadImage
);

router.put('/:id', verifyToken, isAuthorOrAdmin, updateImage);
router.delete('/:id', verifyToken, isAdmin, deleteImage); // Chỉ admin mới được xóa

export default router; 