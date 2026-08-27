/**
 * Fábrica de middleware para controlar acceso por rol.
 * Uso: router.get('/ruta', verificarToken, soloRoles('administrador', 'monitor'), handler)
 *
 * @param  {...string} rolesPermitidos - Roles que pueden acceder
 */
function soloRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado.' });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        error: `Acceso denegado. Se requiere rol: ${rolesPermitidos.join(' o ')}.`,
      });
    }

    next();
  };
}

module.exports = { soloRoles };
