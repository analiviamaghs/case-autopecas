import express from 'express';
import { getPainel } from '../controller/painelController.js';

const painelRoutes = express.Router();

painelRoutes.get('/painel', getPainel);

export default painelRoutes;