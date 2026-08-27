const express = require('express');
const pool    = require('../config/db');
const { verificarToken } = require('../middlewares/auth.middleware');
const { soloRoles }      = require('../middlewares/roles.middleware');

const router = express.Router();
router.use(verificarToken);

// ─────────────────────────────────────────────────────────────
// GET /api/historial
// Historial general (admin y monitor)
// Filtros opcionales por query string:
//   ?docente_id=5
//   ?salon_id=2
//   ?desde=2024-01-01&hasta=2024-12-31
// ─────────────────────────────────────────────────────────────
router.get('/', soloRoles('administrador', 'monitor'), async (req, res) => {
  const { docente_id, salon_id, desde, hasta } = req.query;

  // Construcción dinámica del WHERE
  const condiciones = [];
  const params      = [];
  let   contador    = 1;

  if (docente_id) {
    condiciones.push(`h.docente_id = $${contador++}`);
    params.push(docente_id);
  }
  if (salon_id) {
    condiciones.push(`h.salon_id = $${contador++}`);
    params.push(salon_id);
  }
  if (desde) {
    condiciones.push(`h.hora_inicio >= $${contador++}`);
    params.push(desde);
  }
  if (hasta) {
    condiciones.push(`h.hora_inicio <= $${contador++}`);
    params.push(hasta + ' 23:59:59');
  }

  const where = condiciones.length > 0 ? 'WHERE ' + condiciones.join(' AND ') : '';

  try {
    const resultado = await pool.query(
      `SELECT h.id,
              u.nombre  AS docente,
              u.email   AS docente_email,
              s.nombre  AS salon,
              s.bloque,
              m.nombre  AS materia,
              h.hora_inicio,
              h.hora_fin,
              ROUND(EXTRACT(EPOCH FROM (h.hora_fin - h.hora_inicio))/60) AS duracion_minutos,
              h.registrado_en
       FROM historial h
       JOIN usuarios u ON u.id = h.docente_id
       JOIN salones  s ON s.id = h.salon_id
       JOIN materias m ON m.id = h.materia_id
       ${where}
       ORDER BY h.hora_inicio DESC`,
      params
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el historial.' });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/historial/docente/:id
// Historial de un docente específico
// ─────────────────────────────────────────────────────────────
router.get('/docente/:id', soloRoles('administrador', 'monitor'), async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await pool.query(
      `SELECT h.id, s.nombre AS salon, s.bloque, m.nombre AS materia,
              h.hora_inicio, h.hora_fin,
              ROUND(EXTRACT(EPOCH FROM (h.hora_fin - h.hora_inicio))/60) AS duracion_minutos
       FROM historial h
       JOIN salones  s ON s.id = h.salon_id
       JOIN materias m ON m.id = h.materia_id
       WHERE h.docente_id = $1
       ORDER BY h.hora_inicio DESC`,
      [id]
    );
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial del docente.' });
  }
});

module.exports = router;
