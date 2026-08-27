const bcrypt = require('bcryptjs');

async function generarHash() {
  const password = "DAPC970613"; // 👈 cambia esto si quieres otra contraseña
  const hash = await bcrypt.hash(password, 10);

  console.log("PASSWORD:", password);
  console.log("HASH:", hash);
}

generarHash();