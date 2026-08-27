const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const pool     = require('../config/db');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// ─────────────────────────────────────────────────────────────
// POST /api/auth/login
// Cuerpo: { email, password }
// Respuesta: { token, usuario: { id, nombre, email, rol } }
// ─────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
  }

  try {
    // Buscar usuario con su rol
    const resultado = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.password_hash, u.activo, r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON r.id = u.rol_id
       WHERE u.email = $1:: text`,
      [email]
    );

    const usuario = resultado.rows[0];

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    if (!usuario.activo) {
      return res.status(403).json({ error: 'Usuario desactivado. Contacta al administrador.' });
    }

    // Comparar contraseña con el hash guardado
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      usuario: {
        id:     usuario.id,
        nombre: usuario.nombre,
        email:  usuario.email,
        rol:    usuario.rol,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/auth/yo
// Devuelve los datos del usuario autenticado (para la app al cargar)
// ─────────────────────────────────────────────────────────────
router.get('/yo', verificarToken, async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT u.id, u.nombre, u.email, r.nombre AS rol
       FROM usuarios u JOIN roles r ON r.id = u.rol_id
       WHERE u.id = $1:: text`,
      [req.usuario.id]
    );
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor.' });
  }
});

module.exports = router;
