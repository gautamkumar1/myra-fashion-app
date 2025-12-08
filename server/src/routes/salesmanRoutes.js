import express from 'express';
import { salesmanLogin } from '../controllers/salesmanController.js';

const router = express.Router();

router.post('/login', salesmanLogin);

export default router;

