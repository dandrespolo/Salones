const express = require('express')
const pool    = require('../config/db')
const { verificarToken } = require('../middlewares/auth.middleware')
const { soloRoles }      = require('../middlewares/roles.middleware')

const router = express.Router()
router.use(verificarToken)

// GET /api/materias — todas las materias (todos los roles)
router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM materias ORDER BY nombre'
    )
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener materias.' })
  }
})

// POST /api/materias — crear materia (solo admin)
router.post('/', soloRoles('administrador'), async (req, res) => {
  const { nombre, codigo } = req.body

  if (!nombre || !codigo) {
    return res.status(400).json({ error: 'Nombre y código son obligatorios.' })
  }

  try {
    const resultado = await pool.query(
      'INSERT INTO materias (nombre, codigo) VALUES ($1::text, $2::text) RETURNING *',
      [nombre, codigo]
    )
    res.status(201).json(resultado.rows[0])
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ya existe una materia con ese código.' })
    }
    res.status(500).json({ error: 'Error al crear la materia.' })
  }
})

// DELETE /api/materias/:id — eliminar materia (solo admin)
router.delete('/:id', soloRoles('administrador'), async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM materias WHERE id = $1::int', [id])
    res.json({ mensaje: 'Materia eliminada.' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la materia.' })
  }
})

module.exports = router