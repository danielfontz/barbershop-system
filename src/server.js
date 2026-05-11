import 'dotenv/config'; 
import { PrismaClient } from '@prisma/client';
import express from 'express';
import authRoutes from './routes/auth.routes.js';
import barberRoutes from './routes/barber.routes.js';

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/barber', barberRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ONLINE: http://localhost:${PORT}/`);
});
