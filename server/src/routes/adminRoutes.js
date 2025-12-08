import express from 'express';
import { adminLogin, createSalesman, createWarehouse } from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/create-salesman', createSalesman);
router.post('/create-warehouse', createWarehouse);
export default router;

