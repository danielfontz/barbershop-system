import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  try {
    // Captura o cabeçalho de autorização
    const authHeader = req.headers.authorization;
    
    // Se não houver cabeçalho, bloqueamos o acesso
    if (!authHeader) {
      return res.status(401).json({ erro: "Acesso negado. Token não fornecido." });
    }

    // Separar e guardar o token
    const token = authHeader.split(' ')[1];

    // Token válido?
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);

    // Guardar o ID do utilizador no próprio pedido (req)
    req.clienteId = decodificado.id;
    
    // Deixar passar para o controller
    next(); 

  } catch (error) {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
};