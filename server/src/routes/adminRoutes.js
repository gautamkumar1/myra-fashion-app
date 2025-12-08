import express from 'express';
import { adminLogin, createSalesman } from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/create-salesman', createSalesman);

export default router;

