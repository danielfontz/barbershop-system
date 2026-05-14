export const eAdmin = (req, res, next) => {
    // verificamos o cargo que guardámos no middleware anterior
    if (req.clienteRole !== 'ADMIN') {
        return res.status(403).json({ erro: "Acesso negado. Apenas administradores podem fazer isto." });
    }
    // se for ADMIN, pode passar
    next();
};