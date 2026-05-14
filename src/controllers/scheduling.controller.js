import prisma from '../lib/prisma.js';

export const createScheduling = async (req, res) => {
    try {
        const { barbeiroId, servicoId, dataHora } = req.body;
        const clienteId = req.clienteId;

        // ==========================================
        // 1. VALIDAÇÕES INSTANTÂNEAS (FAIL-FAST)
        // ==========================================
        if (!barbeiroId || !servicoId || !dataHora) {
            return res.status(400).json({ erro: "Barbeiro, serviço e data/hora são obrigatórios." });
        }

        const dataEscolhida = new Date(dataHora);
        const dataAtual = new Date();

        if (dataEscolhida < dataAtual) {
            return res.status(400).json({ erro: "Não é possível agendar no passado!" });
        }

        if (dataEscolhida.getDay() === 0) {
            return res.status(400).json({ erro: "A barbearia encontra-se encerrada ao Domingo." });
        }

        const horaEscolhida = dataEscolhida.getHours();
        if (horaEscolhida < 9 || horaEscolhida > 19) {
            return res.status(400).json({ erro: "O nosso horário de funcionamento é das 09:00 às 20:00." });
        }

        const minutosEscolhidos = dataEscolhida.getMinutes();
        if (minutosEscolhidos !== 0 && minutosEscolhidos !== 30) {
            return res.status(400).json({ erro: "Agendamentos apenas em horas certas (ex: 15:00) ou meias horas (ex: 15:30)." });
        }

        // ==========================================
        // 2. CONSULTAS AO BANCO DE DADOS (PARALELAS)
        // ==========================================

        // Dispara as duas consultas juntas para ganhar velocidade!
        const [barbeiroExiste, servicoExiste] = await Promise.all([
            prisma.barber.findUnique({ where: { id: barbeiroId } }),
            prisma.service.findUnique({ where: { id: servicoId } })
        ]);

        if (!barbeiroExiste) return res.status(404).json({ erro: "O barbeiro selecionado não existe." });
        if (!servicoExiste) return res.status(404).json({ erro: "O serviço selecionado não existe." });

        // Dispara a verificação de choques de horário juntas!
        const [agendamentoBarbeiro, agendamentoCliente] = await Promise.all([
            prisma.scheduling.findFirst({ where: { barbeiro_id: barbeiroId, data_hora: dataEscolhida } }),
            prisma.scheduling.findFirst({ where: { cliente_id: clienteId, data_hora: dataEscolhida } })
        ]);

        if (agendamentoBarbeiro) {
            return res.status(400).json({ erro: "O barbeiro já tem cliente marcado para esta hora." });
        }
        if (agendamentoCliente) {
            return res.status(400).json({ erro: "Já tens um serviço marcado para esta hora." });
        }

        // ==========================================
        // 3. INSERÇÃO (SUCESSO)
        // ==========================================
        const novoAgendamento = await prisma.scheduling.create({
            data: {
                data_hora: dataEscolhida,
                status: "Confirmado",
                cliente_id: clienteId,
                barbeiro_id: barbeiroId,
                servico_id: servicoId
            }
        });

        return res.status(201).json(novoAgendamento);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Erro ao criar o agendamento." });
    }
};

export const getClientSchedules = async (req, res) => {
    try {
        const clienteId = req.clienteId;

        const agendamentos = await prisma.scheduling.findMany({
            where: { cliente_id: clienteId },
            include: {
                barbeiro: true,
                servico: true
            },
            // OPTIMIZAÇÃO EXTRA: Retornar a lista já ordenada por data (do mais antigo para o mais recente)
            orderBy: { data_hora: 'asc' }
        });

        return res.status(200).json(agendamentos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Erro ao buscar agendamentos." });
    }
};