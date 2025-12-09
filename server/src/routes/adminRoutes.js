import express from 'express';
import {
  adminLogin,
  createSalesman,
  createWarehouse,
  createProduct,
  editProduct,
  deleteProduct,
  getProducts,
  getDashboardStats,
  getSalesmen,
  getSalesmanDetails,
  updateSalesman,
  deleteSalesman,
  getWarehouseStaff,
  getWarehouseStaffDetails,
  updateWarehouseStaff,
  deleteWarehouseStaff,
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public route - no authentication required
router.post('/login', adminLogin);

// Protected routes - require authentication and admin role
router.post('/create-salesman', authenticate, authorize(['admin']), createSalesman);
router.post('/create-warehouse', authenticate, authorize(['admin']), createWarehouse);

// Salesmen routes
router.get('/salesmen', authenticate, authorize(['admin']), getSalesmen);
router.get('/salesmen/:id/details', authenticate, authorize(['admin']), getSalesmanDetails);
router.patch('/salesmen/:id', authenticate, authorize(['admin']), updateSalesman);
router.delete('/salesmen/:id', authenticate, authorize(['admin']), deleteSalesman);

// Warehouse staff routes
router.get('/warehouse-staff', authenticate, authorize(['admin']), getWarehouseStaff);
router.get('/warehouse-staff/:id/details', authenticate, authorize(['admin']), getWarehouseStaffDetails);
router.patch('/warehouse-staff/:id', authenticate, authorize(['admin']), updateWarehouseStaff);
router.delete('/warehouse-staff/:id', authenticate, authorize(['admin']), deleteWarehouseStaff);

// Middleware to log file upload info
const logFileUpload = (req, res, next) => {
  console.log('File upload middleware - Request received');
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Has file:', !!req.file);
  if (req.file) {
    console.log('File info:', {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      encoding: req.file.encoding,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferLength: req.file.buffer ? req.file.buffer.length : 0,
    });
  }
  next();
};

// Product routes
router.post(
  '/products',
  authenticate,
  authorize(['admin']),
  uploadSingleImage,
  logFileUpload,
  createProduct
);
router.patch(
  '/products/:id',
  authenticate,
  authorize(['admin']),
  uploadSingleImage,
  logFileUpload,
  editProduct
);
router.delete(
  '/products/:id',
  authenticate,
  authorize(['admin']),
  deleteProduct
);
router.get('/products', getProducts);
router.get('/dashboard/stats', authenticate, authorize(['admin']), getDashboardStats);

export default router;

