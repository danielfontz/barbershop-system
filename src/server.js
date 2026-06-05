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

const origensPermitidas = [
  'http://localhost:4200',        // Angular no seu PC (Desenvolvimento)
  'http://localhost:3000',        // Caso rode algum teste local
  'https://barberhop-front.vercel.app'  // Seu site real na Vercel (Produção)
];

app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origensPermitidas.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Acesso bloqueado pela política de CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
));

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