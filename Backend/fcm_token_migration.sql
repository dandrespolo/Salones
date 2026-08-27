-- Agregar columna para el token de notificaciones push de Firebase
-- Ejecutar este script después del database.sql principal

ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS fcm_token VARCHAR(255);
