import express from 'express';
// Importamos todas as funções do nosso CRUD de barbeiros
import {
    createBarber,
    getAllBarbers,
    getBarberById,
    updateBarber,
    deleteBarber
} from '../controllers/barber.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { eAdmin } from '../middlewares/admin.middleware.js';

const router = express.Router();

// C - Novo barbeiro
router.post('/', verificarToken, eAdmin,createBarber);

// R - todos os barbeiros
router.get('/', getAllBarbers);

// R - Um barbeiro pelo seu ID
router.get('/:id', getBarberById);

// U - Um barbeiro existente pelo ID
router.put('/:id', verificarToken, eAdmin, updateBarber);

// D - Um barbeiro pelo ID
router.delete('/:id', verificarToken, eAdmin, deleteBarber);

export default router;