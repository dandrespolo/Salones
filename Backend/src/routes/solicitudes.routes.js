const express = require('express');
const pool    = require('../config/db');
const { verificarToken } = require('../middlewares/auth.middleware');
const { soloRoles }      = require('../middlewares/roles.middleware');
const { enviarNotificacion } = require('../config/firebase');

const router = express.Router();
router.use(verificarToken);

// ─── Función auxiliar: notificar a admins y monitores ────────
async function notificarAdminsYMonitores(tipo, mensaje, solicitud_id) {
  try {
    // Obtener todos los admins y monitores con token FCM guardado
    const destinatarios = await pool.query(
      `SELECT u.id, u.fcm_token FROM usuarios u
       JOIN roles r ON r.id = u.rol_id
       WHERE r.nombre IN ('administrador','monitor') AND u.activo = TRUE AND u.fcm_token IS NOT NULL`
    );

    for (const dest of destinatarios.rows) {
      // Guardar notificación en la base de datos
      await pool.query(
        `INSERT INTO notificaciones (usuario_id, solicitud_id, tipo, mensaje)
         VALUES ($1, $2, $3, $4)`,
        [dest.id, solicitud_id, tipo, mensaje]
      );
      // Enviar push
      await enviarNotificacion(dest.fcm_token, tipo, mensaje, { solicitud_id: String(solicitud_id) });
    }
  } catch (err) {
    console.error('Error notificando:', err.message);
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/solicitudes
// Admin/Monitor: todas las solicitudes pendientes
// Docente: solo sus solicitudes
// ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  const { rol, id } = req.usuario;
  try {
    let query, params;

    if (rol === 'docente') {
      query = `
        SELECT s.*, u.nombre AS docente, sa.nombre AS salon, sa.bloque, m.nombre AS materia
        FROM solicitudes s
        JOIN usuarios u ON u.id = s.docente_id
        JOIN salones sa ON sa.id = s.salon_id
        JOIN materias m ON m.id = s.materia_id
        WHERE s.docente_id = $1
        ORDER BY s.hora_solicitud DESC`;
      params = [id];
    } else {
      query = `
        SELECT s.*, u.nombre AS docente, sa.nombre AS salon, sa.bloque, m.nombre AS materia
        FROM solicitudes s
        JOIN usuarios u ON u.id = s.docente_id
        JOIN salones sa ON sa.id = s.salon_id
        JOIN materias m ON m.id = s.materia_id
        ORDER BY s.hora_solicitud DESC`;
      params = [];
    }

    const resultado = await pool.query(query, params);
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener solicitudes.' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/solicitudes
// Docente solicita un salón
// Cuerpo: { salon_id, materia_id }
// ─────────────────────────────────────────────────────────────
router.post('/', soloRoles('docente'), async (req, res) => {
  const { salon_id, materia_id } = req.body;
  const docente_id = req.usuario.id;

  if (!salon_id || !materia_id) {
    return res.status(400).json({ error: 'salon_id y materia_id son obligatorios.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verificar que el salón esté disponible
    const salon = await client.query(
      'SELECT * FROM salones WHERE id = $1 AND disponible = TRUE',
      [salon_id]
    );
    if (!salon.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'El salón no está disponible.' });
    }

    // Verificar que la materia esté asignada al docente
    const tieneMateria = await client.query(
      'SELECT 1 FROM docente_materias WHERE usuario_id = $1 AND materia_id = $2',
      [docente_id, materia_id]
    );
    if (!tieneMateria.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Esa materia no está asignada a tu perfil.' });
    }

    // Crear la solicitud
    const nueva = await client.query(
      `INSERT INTO solicitudes (docente_id, salon_id, materia_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [docente_id, salon_id, materia_id]
    );

    await client.query('COMMIT');

    // Notificar a admins y monitores
    const docente = await pool.query('SELECT nombre FROM usuarios WHERE id = $1', [docente_id]);
    const mensaje = `${docente.rows[0].nombre} solicitó el ${salon.rows[0].nombre} (${salon.rows[0].bloque})`;
    await notificarAdminsYMonitores('nueva_solicitud', mensaje, nueva.rows[0].id);

    res.status(201).json({ mensaje: 'Solicitud enviada. Espera aprobación.', solicitud: nueva.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Error al crear la solicitud.' });
  } finally {
    client.release();
  }
});

// ─────────────────────────────────────────────────────────────
// PATCH /api/solicitudes/:id/aprobar
// Admin o Monitor aprueban la solicitud
// ─────────────────────────────────────────────────────────────
router.patch('/:id/aprobar', soloRoles('administrador', 'monitor'), async (req, res) => {
  const { id } = req.params;
  const aprobado_por = req.usuario.id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const solicitud = await client.query(
      "SELECT * FROM solicitudes WHERE id = $1 AND estado = 'pendiente'",
      [id]
    );
    if (!solicitud.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Solicitud no encontrada o ya procesada.' });
    }

    const s = solicitud.rows[0];

    // Actualizar solicitud
    await client.query(
      `UPDATE solicitudes SET estado = 'aprobada', hora_inicio = NOW(), aprobado_por = $1 WHERE id = $2`,
      [aprobado_por, id]
    );
    // Marcar salón como ocupado
    await client.query('UPDATE salones SET disponible = FALSE WHERE id = $1', [s.salon_id]);

    await client.query('COMMIT');

    // Notificar al docente
    const docente = await pool.query(
      'SELECT nombre, fcm_token FROM usuarios WHERE id = $1',
      [s.docente_id]
    );
    const salon = await pool.query('SELECT nombre, bloque FROM salones WHERE id = $1', [s.salon_id]);
    const mensaje = `Tu solicitud para ${salon.rows[0].nombre} fue aprobada`;

    await pool.query(
      `INSERT INTO notificaciones (usuario_id, solicitud_id, tipo, mensaje) VALUES ($1,$2,$3,$4)`,
      [s.docente_id, id, 'solicitud_aprobada', mensaje]
    );
    if (docente.rows[0].fcm_token) {
      await enviarNotificacion(docente.rows[0].fcm_token, 'Solicitud aprobada', mensaje, { solicitud_id: id });
    }

    res.json({ mensaje: 'Solicitud aprobada. Salón marcado como ocupado.' });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Error al aprobar la solicitud.' });
  } finally {
    client.release();
  }
});

// ─────────────────────────────────────────────────────────────
// PATCH /api/solicitudes/:id/rechazar
// Admin o Monitor rechazan la solicitud
// ─────────────────────────────────────────────────────────────
router.patch('/:id/rechazar', soloRoles('administrador', 'monitor'), async (req, res) => {
  const { id } = req.params;

  try {
    const solicitud = await pool.query(
      "UPDATE solicitudes SET estado = 'rechazada' WHERE id = $1 AND estado = 'pendiente' RETURNING *",
      [id]
    );
    if (!solicitud.rows[0]) {
      return res.status(404).json({ error: 'Solicitud no encontrada o ya procesada.' });
    }

    const s = solicitud.rows[0];
    const docente = await pool.query('SELECT nombre, fcm_token FROM usuarios WHERE id = $1', [s.docente_id]);
    const salon   = await pool.query('SELECT nombre FROM salones WHERE id = $1', [s.salon_id]);
    const mensaje = `Tu solicitud para ${salon.rows[0].nombre} fue rechazada`;

    await pool.query(
      `INSERT INTO notificaciones (usuario_id, solicitud_id, tipo, mensaje) VALUES ($1,$2,$3,$4)`,
      [s.docente_id, id, 'solicitud_rechazada', mensaje]
    );
    if (docente.rows[0].fcm_token) {
      await enviarNotificacion(docente.rows[0].fcm_token, 'Solicitud rechazada', mensaje);
    }

    res.json({ mensaje: 'Solicitud rechazada.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al rechazar la solicitud.' });
  }
});

// ─────────────────────────────────────────────────────────────
// PATCH /api/solicitudes/:id/finalizar
// Docente libera el salón cuando termina de usarlo
// ─────────────────────────────────────────────────────────────
router.patch('/:id/finalizar', soloRoles('docente'), async (req, res) => {
  const { id } = req.params;
  const docente_id = req.usuario.id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const solicitud = await client.query(
      "SELECT * FROM solicitudes WHERE id = $1 AND docente_id = $2 AND estado = 'aprobada'",
      [id, docente_id]
    );
    if (!solicitud.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Solicitud no encontrada o no está activa.' });
    }

    const s = solicitud.rows[0];

    // Marcar como finalizada y registrar hora_fin
    await client.query(
      "UPDATE solicitudes SET estado = 'finalizada', hora_fin = NOW() WHERE id = $1",
      [id]
    );
    // Liberar el salón
    await client.query('UPDATE salones SET disponible = TRUE WHERE id = $1', [s.salon_id]);

    // Crear registro en historial
    await client.query(
      `INSERT INTO historial (solicitud_id, docente_id, salon_id, materia_id, hora_inicio, hora_fin)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [id, s.docente_id, s.salon_id, s.materia_id, s.hora_inicio]
    );

    await client.query('COMMIT');

    // Notificar a admins y monitores que el salón fue liberado
    const salon   = await pool.query('SELECT nombre, bloque FROM salones WHERE id = $1', [s.salon_id]);
    const docente = await pool.query('SELECT nombre FROM usuarios WHERE id = $1', [docente_id]);
    const mensaje = `${docente.rows[0].nombre} liberó el ${salon.rows[0].nombre} (${salon.rows[0].bloque})`;
    await notificarAdminsYMonitores('salon_liberado', mensaje, id);

    res.json({ mensaje: 'Salón liberado. Ahora está disponible.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Error al finalizar la solicitud.' });
  } finally {
    client.release();
  }
});

module.exports = router;
