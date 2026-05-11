import express from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = express.Router();

// Quando o cliente faz um POST para uma rota, a função da rota é executada
router.post('/register', register);
router.post('/login', login);

export default router;