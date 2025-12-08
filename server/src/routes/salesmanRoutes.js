import express from 'express';
import { salesmanLogin, salesmanLogout } from '../controllers/salesmanController.js';

const router = express.Router();

router.post('/login', salesmanLogin);
router.post('/logout', salesmanLogout);

export default router;

