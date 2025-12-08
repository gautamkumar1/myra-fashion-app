import express from 'express';
import { warehouseLogin, warehouseLogout } from '../controllers/warehouseController.js';

const router = express.Router();

router.post('/login', warehouseLogin);
router.post('/logout', warehouseLogout);

export default router;

