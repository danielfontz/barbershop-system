import prisma from '../lib/prisma.js';

export const createBarber = async (req, res) => {
    try {
        const { name, specialty } = req.body;

        if (!name) {
            return res.status(400).json({ erro: "O nome do barbeiro é obrigatório." });
        }

        // Guardar na banco com o Prisma
        const novoBarbeiro = await prisma.barber.create({
            data: { name, specialty }
        });

        // Devolver resposta de sucesso
        return res.status(201).json(novoBarbeiro);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Erro interno do servidor." });
    }
};

export const getAllBarbers = async (req, res) => {
    try {
        // Buscar todos os barbeiros no banco
        const barbeiros = await prisma.barber.findMany();

        // Devolver a lista ao cliente
        return res.status(200).json(barbeiros);

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao procurar barbeiros." });
    }
};

export const getBarberById = async (req, res) => {
    try {
        // Captura o ID da URL
        const id = Number(req.params.id);

        // Buscar o barbeiro específico no banco
        const barbeiro = await prisma.barber.findUnique({
            where: { id: id }
        });

        if (!barbeiro) {
            return res.status(404).json({ erro: "Barbeiro não encontrado." });
        }

        return res.status(200).json(barbeiro);

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao procurar o barbeiro." });
    }
};

export const updateBarber = async (req, res) => {
    try {
        const id = Number(req.params.id); // id para qual atualizar
        const { name, specialty } = req.body; // novos dados

        // Dizer ao Prisma para atualizar o registo
        const barbeiroAtualizado = await prisma.barber.update({
            where: { id: id }, // Qual barbeiro
            data: { name, specialty } // Novos dados
        });

        return res.status(200).json(barbeiroAtualizado);

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao atualizar o barbeiro." });
    }
};

export const deleteBarber = async (req, res) => {
    try {
        // Qual id para apagar
        const id = Number(req.params.id);

        // dizer ao Prisma para apagar os dados
        await prisma.barber.delete({
            where: { id: id }
        });

        // retornar status 204 (No Content) indicando que foi apagado com sucesso
        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao apagar o barbeiro." });
    }
};