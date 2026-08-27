require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes        = require('./src/routes/auth.routes.js');
const usuariosRoutes    = require('./src/routes/usuarios.routes');
const salonesRoutes     = require('./src/routes/salones.routes');
const solicitudesRoutes = require('./src/routes/solicitudes.routes');
const historialRoutes   = require('./src/routes/historial.routes');
const materiasRoutes    = require('./src/routes/materias.routes');
const bloquesRoutes     = require('./src/routes/bloques.routes');


const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares globales ────────────────────────────────────
//app.use(cors());
app.use(cors({
  origin: [
    'http://localhost:5173',     // panel web React
    'http://localhost:50400',    // Flutter web (este puerto)
    /^http:\/\/localhost:\d+$/,  // cualquier puerto localhost
    /^http:\/\/192\.168\./,      // celular físico
    /^http:\/\/10\.0\./,         // emulador Android
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json());

// ─── Rutas ──────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/usuarios',    usuariosRoutes);
app.use('/api/salones',     salonesRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/historial',   historialRoutes);
app.use('/api/materias',    materiasRoutes);
app.use('/api/bloques',     bloquesRoutes);

// ─── Ruta de salud (para verificar que el servidor corre) ────
app.get('/api/health', (req, res) => {
  res.json({ ok: true, mensaje: 'Servidor funcionando correctamente' });
});

// ─── Manejo de rutas no encontradas ─────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ─── Manejo global de errores ────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en red`);
});
