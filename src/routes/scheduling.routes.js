import express from 'express';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { createScheduling, getClientSchedules } from '../controllers/scheduling.controller.js';

const router = express.Router();

router.post('/', verificarToken, createScheduling);

router.get('/me', verificarToken, getClientSchedules);

export default router;