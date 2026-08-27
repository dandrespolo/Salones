const { Pool } = require('pg');

// Pool de conexiones: reutiliza conexiones en lugar de abrir una nueva por cada petición
const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Verificar conexión al iniciar
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
  } else {
    console.log('Conectado a PostgreSQL correctamente');
    release();
  }
});

module.exports = pool;
