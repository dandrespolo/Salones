const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = express.Router();


// ─────────────────────────────────────────────
// POST /api/usuarios → CREAR USUARIO
// ─────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {

    let {
      nombre,
      apellidos,
      email,
      password,
      rol_id
    } = req.body;

    // Normalizar datos
    nombre = nombre?.trim();
    apellidos = apellidos?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();

    console.log("CREAR USUARIO:", email);

    if (
      !nombre ||
      !apellidos ||
      !email ||
      !password ||
      !rol_id
    ) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios.'
      });
    }

    // Verificar si ya existe
    const existe = await pool.query(
      `
      SELECT id
      FROM usuarios
      WHERE email = $1
      `,
      [email]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({
        error: 'El usuario ya existe.'
      });
    }

    // Generar hash
    const password_hash =
      await bcrypt.hash(password, 10);

    // Insertar usuario
    const resultado = await pool.query(
      `
      INSERT INTO usuarios
      (
        nombre,
        apellidos,
        email,
        password_hash,
        rol_id,
        activo
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        true
      )
      RETURNING
        id,
        nombre,
        apellidos,
        email
      `,
      [
        nombre,
        apellidos,
        email,
        password_hash,
        rol_id
      ]
    );

    console.log("USUARIO CREADO");

    res.status(201).json(
      resultado.rows[0]
    );

  } catch (error) {

    console.error(
      "ERROR CREAR USUARIO:",
      error
    );

    res.status(500).json({
      error: 'Error en el servidor.'
    });

  }
});


// ─────────────────────────────────────────────
// POST /api/usuarios/login
// ─────────────────────────────────────────────
router.post('/login', async (req, res) => {

  try {

    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y contraseña obligatorios.'
      });
    }

    const resultado = await pool.query(
      `
      SELECT
        u.id,
        u.nombre,
        u.apellidos,
        u.email,
        u.password_hash,
        u.activo,
        r.nombre AS rol
      FROM usuarios u
      JOIN roles r
      ON r.id = u.rol_id
      WHERE u.email = $1
      `,
      [email]
    );

    const usuario = resultado.rows[0];

    if (!usuario) {
      return res.status(401).json({
        error: 'Usuario o contraseña incorrectos.'
      });
    }

    if (!usuario.activo) {
      return res.status(403).json({
        error: 'Usuario deshabilitado.'
      });
    }

    const passwordValida =
      await bcrypt.compare(
        password,
        usuario.password_hash
      );

    if (!passwordValida) {
      return res.status(401).json({
        error: 'Usuario o contraseña incorrectos.'
      });
    }

    console.log(
      "LOGIN EXITOSO:",
      usuario.email
    );

    res.json({
      ok: true,

      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        nombreCompleto:
          `${usuario.nombre} ${usuario.apellidos}`,
        email: usuario.email,
        rol: usuario.rol
      }

    });

  } catch (error) {

    console.error(
      "ERROR LOGIN:",
      error
    );

    res.status(500).json({
      error: 'Error en servidor.'
    });

  }

});


// ─────────────────────────────────────────────
// GET /api/usuarios/docentes
// ─────────────────────────────────────────────
router.get('/docentes', async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT
        u.id,
        u.id AS docente_id,
        u.nombre,
        u.apellidos,
        u.email,
        COALESCE(
          ARRAY_AGG(m.nombre) FILTER (WHERE m.nombre IS NOT NULL),
          ARRAY[]::text[]
        ) AS materias
      FROM usuarios u
      JOIN roles r ON r.id = u.rol_id
      LEFT JOIN docente_materias dm ON dm.usuario_id = u.id
      LEFT JOIN materias m ON m.id = dm.materia_id
      WHERE r.nombre = 'docente'
      GROUP BY u.id, u.nombre, u.apellidos, u.email
      ORDER BY u.nombre`
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error('ERROR DOCENTES:', error);
    res.status(500).json({ error: 'Error en servidor.' });
  }
});


// ─────────────────────────────────────────────
// GET /api/usuarios
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {

  try {

    const resultado = await pool.query(
      `
      SELECT
        u.id,
        u.nombre,
        u.apellidos,
        u.email,
        u.activo,
        r.nombre AS rol
      FROM usuarios u
      JOIN roles r
      ON r.id = u.rol_id
      ORDER BY u.id DESC
      `
    );

    res.json(
      resultado.rows
    );

  } catch (error) {

    console.error(
      "ERROR USUARIOS:",
      error
    );

    res.status(500).json({
      error: 'Error en servidor.'
    });

  }

});
// ─────────────────────────────────────────────
// POST /api/usuarios/:id/materias
// Asignar materias a un docente
// ─────────────────────────────────────────────
router.post('/:id/materias', async (req, res) => {
  const { id } = req.params;
  const { materias } = req.body; // array de IDs

  if (!Array.isArray(materias)) {
    return res.status(400).json({
      error: 'materias debe ser un arreglo de IDs.'
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Eliminar asignaciones previas
    await client.query(
      'DELETE FROM docente_materias WHERE usuario_id = $1',
      [id]
    );

    // Insertar las nuevas
    for (const materia_id of materias) {
      await client.query(
        'INSERT INTO docente_materias (usuario_id, materia_id) VALUES ($1, $2)',
        [id, materia_id]
      );
    }

    await client.query('COMMIT');
    res.json({ mensaje: 'Materias asignadas correctamente.' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('ERROR ASIGNAR MATERIAS:', error);
    res.status(500).json({ error: 'Error al asignar materias.' });
  } finally {
    client.release();
  }
});
// ─────────────────────────────────────────────
// GET /api/usuarios/:id
// Devuelve usuario con sus materias asignadas
// ─────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await pool.query(
      `SELECT u.id, u.nombre, u.apellidos, u.email, r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON r.id = u.rol_id
       WHERE u.id = $1`,
      [id]
    );

    if (!usuario.rows[0]) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const materias = await pool.query(
      `SELECT m.id, m.nombre, m.codigo
       FROM docente_materias dm
       JOIN materias m ON m.id = dm.materia_id
       WHERE dm.usuario_id = $1`,
      [id]
    );

    res.json({
      ...usuario.rows[0],
      materias: materias.rows,
    });

  } catch (error) {
    console.error('ERROR GET USUARIO:', error);
    res.status(500).json({ error: 'Error en servidor.' });
  }
});
module.exports = router;