import express from 'express';
import { warehouseLogin } from '../controllers/warehouseController.js';

const router = express.Router();

router.post('/login', warehouseLogin);

export default router;

