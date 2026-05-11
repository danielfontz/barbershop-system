import 'dotenv/config'; 
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

// Rota que checa o status do banco...
app.get('/api/status', async (req, res) => {
  try {
    console.log("Enviando requisição ao banco da barbearia...");
    
    // Busca os clientes no banco
    const clientes = await prisma.customer.findMany();
    
    res.status(200).json({
      sucesso: true,
      mensagem: "Requisição recebida com sucesso! Enviando resposta: ",
      banco: "Barbearia",
      total_clientes: clientes.length,
    });
  } catch (error) {
    console.error("Erro na consulta:", error);
    res.status(500).json({ erro: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ONLINE: http://localhost:${PORT}/api/status`);
});
