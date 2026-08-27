const jwt = require('jsonwebtoken');

/**
 * Verifica que el request tenga un token JWT válido.
 * Si es válido, agrega req.usuario con los datos del token.
 */
function verificarToken(req, res, next) {
  // El token llega en el header: Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = datos; // { id, email, rol }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
}

module.exports = { verificarToken };
