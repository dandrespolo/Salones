const admin = require('firebase-admin');

// Solo inicializar una vez
if (!admin.apps.length) {
  const serviceAccount = require(process.env.FIREBASE_CREDENTIALS);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

/**
 * Envía una notificación push a un dispositivo específico.
 * @param {string} token   - Token FCM del dispositivo destino
 * @param {string} titulo  - Título de la notificación
 * @param {string} cuerpo  - Texto del mensaje
 * @param {object} datos   - Datos extra (opcional)
 */
async function enviarNotificacion(token, titulo, cuerpo, datos = {}) {
  try {
    await admin.messaging().send({
      token,
      notification: { title: titulo, body: cuerpo },
      data: datos,
    });
  } catch (error) {
    // No interrumpir el flujo principal si falla la notificación
    console.error('Error enviando notificación push:', error.message);
  }
}

module.exports = { admin, enviarNotificacion };
