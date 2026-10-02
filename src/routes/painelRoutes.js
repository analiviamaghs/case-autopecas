import express from 'express';
import { getPainel } from '../controller/painelController.js';

const router = express.Router();

router.get('/painel', getPainel);

export default router;