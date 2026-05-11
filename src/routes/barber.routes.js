import express from 'express';
// Importamos todas as funções do nosso CRUD de barbeiros
import {
    createBarber,
    getAllBarbers,
    getBarberById,
    updateBarber,
    deleteBarber
} from '../controllers/barber.controller.js';

const router = express.Router();

// C - Novo barbeiro
router.post('/', createBarber);

// R - todos os barbeiros
router.get('/', getAllBarbers);

// R - Um barbeiro pelo seu ID
router.get('/:id', getBarberById);

// U - Um barbeiro existente pelo ID
router.put('/:id', updateBarber);

// D - Um barbeiro pelo ID
router.delete('/:id', deleteBarber);

export default router;