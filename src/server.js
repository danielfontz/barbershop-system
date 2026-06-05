import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import barberRoutes from './routes/barber.routes.js';
import schedulingRoutes from './routes/scheduling.routes.js';
import serviceRoutes from './routes/service.routes.js';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Bem-vindo à API de agendamento de barbearia!');
});

// 4. ROTAS DA APLICAÇÃO
app.use('/api/auth', authRoutes);
app.use('/api/barber', barberRoutes);
app.use('/api/schedules', schedulingRoutes);
app.use('/api/services', serviceRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ONLINE: http://localhost:${PORT}/`);
});