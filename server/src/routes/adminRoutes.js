import express from 'express';
import {
  adminLogin,
  createSalesman,
  createWarehouse,
  createProduct,
  editProduct,
  getProducts,
  getDashboardStats,
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { uploadMultipleImages } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public route - no authentication required
router.post('/login', adminLogin);

// Protected routes - require authentication and admin role
router.post('/create-salesman', authenticate, authorize(['admin']), createSalesman);
router.post('/create-warehouse', authenticate, authorize(['admin']), createWarehouse);

// Product routes
router.post(
  '/products',
  authenticate,
  authorize(['admin']),
  uploadMultipleImages,
  createProduct
);
router.patch(
  '/products/:id',
  authenticate,
  authorize(['admin']),
  uploadMultipleImages,
  editProduct
);
router.get('/products', getProducts);
router.get('/dashboard/stats', authenticate, authorize(['admin']), getDashboardStats);

export default router;

