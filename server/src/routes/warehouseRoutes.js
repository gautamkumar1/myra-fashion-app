import express from 'express';
import { warehouseLogin, warehouseLogout } from '../controllers/warehouseController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public route - no authentication required
router.post('/login', warehouseLogin);

// Protected route - require authentication and warehouse role
router.post('/logout', authenticate, authorize(['warehouse']), warehouseLogout);

export default router;

