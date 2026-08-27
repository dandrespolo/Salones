const express = require('express');
const pool    = require('../config/db');
const { verificarToken } = require('../middlewares/auth.middleware');
const { soloRoles }      = require('../middlewares/roles.middleware');

const router = express.Router();
router.use(verificarToken); // todas las rutas requieren login

// ─────────────────────────────────────────────────────────────
// GET /api/salones
// Lista todos los salones — visible para todos los roles
// ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM salones ORDER BY bloque, nombre'
    );
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener salones.' });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/salones/disponibles
// Solo los salones que están libres (para que el docente solicite)
// ─────────────────────────────────────────────────────────────
router.get('/disponibles', async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM salones WHERE disponible = TRUE ORDER BY bloque, nombre"
    );
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener salones disponibles.' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/salones
// Crear salón (solo admin)
// Cuerpo: { nombre, bloque, capacidad }
// ─────────────────────────────────────────────────────────────
router.post('/', soloRoles('administrador'), async (req, res) => {
  const { nombre, bloque, capacidad } = req.body;

  if (!nombre || !bloque) {
    return res.status(400).json({ error: 'Nombre y bloque son obligatorios.' });
  }

  try {
    const resultado = await pool.query(
      'INSERT INTO salones (nombre, bloque, capacidad) VALUES ($1, $2, $3) RETURNING *',
      [nombre, bloque, capacidad || 30]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el salón.' });
  }
});

// ─────────────────────────────────────────────────────────────
// PUT /api/salones/:id
// Actualizar datos de un salón (solo admin)
// ─────────────────────────────────────────────────────────────
router.put('/:id', soloRoles('administrador'), async (req, res) => {
  const { id } = req.params;
  const { nombre, bloque, capacidad } = req.body;

  try {
    await pool.query(
      `UPDATE salones SET nombre    = COALESCE($1, nombre),
                          bloque    = COALESCE($2, bloque),
                          capacidad = COALESCE($3, capacidad)
       WHERE id = $4`,
      [nombre, bloque, capacidad, id]
    );
    res.json({ mensaje: 'Salón actualizado.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el salón.' });
  }
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/salones/:id
// Eliminar salón (solo admin)
// ─────────────────────────────────────────────────────────────
router.delete('/:id', soloRoles('administrador'), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM salones WHERE id = $1', [id]);
    res.json({ mensaje: 'Salón eliminado.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el salón.' });
  }
});

module.exports = router;
