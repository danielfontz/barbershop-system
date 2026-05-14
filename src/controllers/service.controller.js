import prisma from '../lib/prisma.js';

// C: um novo serviço no catálogo
export const createService = async (req, res) => {
    try {
        const { nome, descricao, preco } = req.body;

        if (!nome || !preco) {
            return res.status(400).json({ erro: "O nome e o preço são obrigatórios." });
        }

        const novoServico = await prisma.service.create({
            data: { nome, descricao, preco }
        });

        return res.status(201).json(novoServico);

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao criar o serviço." });
    }
};

// R: Ler todos os serviços (Mostrar o Catálogo)
export const getAllServices = async (req, res) => {
    try {
        // usar o findMany() sem filtros para trazer a tabela inteira
        const servicos = await prisma.service.findMany();

        // Devolver a lista de serviços ao cliente com status 200 (OK)
        return res.status(200).json(servicos);

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao buscar o catálogo de serviços." });
    }
};