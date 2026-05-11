import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';

export const register = async (req, res) => {
    try {
        // Captura os dados enviados pelo utilizador
        const { name, email, cpf, pass } = req.body;

        // Faz uma validação simples para garantir que nada vem vazio
        if (!name || !email || !cpf || !pass) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
        }

        // Consulta se o cliente já existe no banco
        const clienteExistente = await prisma.customer.findUnique({
            where: { email: email },
        });
        if (clienteExistente) {
            return res.status(400).json({ erro: "Este e-mail já está em uso." });
        }

        // Criptografia
        const hash = await bcrypt.hash(pass, 10);

        // Guarda na base de dados com o Prisma
        const novoCliente = await prisma.customer.create({
            data: {
                name,
                email,
                cpf,
                pass: hash, // Guarda o hash encriptado
            }
        });

        // Resposta de sucesso
        return res.status(201).json({ mensagem: "Cliente registado com sucesso!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Erro interno do servidor." });
    }
};

export const login = async (req, res) => {
    try {
        const { email, pass } = req.body;
        if (!email || !pass) {
            return res.status(400).json({ erro: "E-mail e palavra-passe são obrigatórios." });
        }

        // Procurar o cliente pelo e-mail
        const clienteExistente = await prisma.customer.findUnique({
            where: { email: email },
        });
        if (!clienteExistente) {
            return res.status(404).json({ erro: "Credenciais inválidas." });
        }

        // Comparar a senha digitada com o hash guardado
        const senhaValida = await bcrypt.compare(pass, clienteExistente.pass);

        // Se senha for diferente do hash, acesso negado
        if (!senhaValida) {
            return res.status(401).json({ erro: "Credenciais inválidas." });
        }

        // Gerar token
        const token = jwt.sign(
            { id: clienteExistente.id }, // Payload
            process.env.JWT_SECRET,      // Chave secreta do .env
            { expiresIn: '1d' }          // Expira em 1 dia
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Erro interno do servidor." });
    }
};