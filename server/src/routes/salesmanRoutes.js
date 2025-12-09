import express from 'express';
import { salesmanLogin, salesmanLogout } from '../controllers/salesmanController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public route - no authentication required
router.post('/login', salesmanLogin);

// Protected route - require authentication and salesman role
router.post('/logout', authenticate, authorize(['salesman']), salesmanLogout);

export default router;

