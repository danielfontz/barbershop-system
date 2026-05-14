import express from 'express';
import { createService, getAllServices } from '../controllers/service.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { eAdmin } from '../middlewares/admin.middleware.js';

const router = express.Router();

// Rota PÚBLICA: Qualquer pessoa pode ver a lista de serviços
router.get('/', getAllServices);

// Rota PROTEGIDA: Só quem tem o Token (fez login) consegue criar um serviço
router.post('/', verificarToken, eAdmin, createService);

export default router;