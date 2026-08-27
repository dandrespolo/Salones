import api from './axios'

// ─── Auth ────────────────────────────────────────────────────
export const login = (email, password) =>
  api.post('/auth/login', { email, password })

// ─── Usuarios ────────────────────────────────────────────────
export const getUsuarios    = ()           => api.get('/usuarios')
export const getDocentes    = ()           => api.get('/usuarios/docentes')
export const getUsuario     = (id)         => api.get(`/usuarios/${id}`)
export const crearUsuario   = (datos)      => api.post('/usuarios', datos)
export const actualizarUsuario = (id, datos) => api.put(`/usuarios/${id}`, datos)
export const asignarMaterias   = (id, materias) =>
  api.post(`/usuarios/${id}/materias`, { materias })

// ─── Salones ─────────────────────────────────────────────────
export const getSalones     = ()           => api.get('/salones')
export const crearSalon     = (datos)      => api.post('/salones', datos)
export const actualizarSalon = (id, datos) => api.put(`/salones/${id}`, datos)
export const eliminarSalon  = (id)         => api.delete(`/salones/${id}`)

// ─── Solicitudes ─────────────────────────────────────────────
export const getSolicitudes  = ()   => api.get('/solicitudes')
export const aprobarSolicitud = (id) => api.patch(`/solicitudes/${id}/aprobar`)
export const rechazarSolicitud = (id) => api.patch(`/solicitudes/${id}/rechazar`)

// ─── Historial ───────────────────────────────────────────────
export const getHistorial = (filtros = {}) =>
  api.get('/historial', { params: filtros })

export const getHistorialDocente = (id) =>
  api.get(`/historial/docente/${id}`)

// ─── Materias ───────────────────────────────────────────────
export const getMaterias   = ()      => api.get('/materias')
export const crearMateria  = (datos) => api.post('/materias', datos)
export const eliminarMateria = (id) => api.delete(`/materias/${id}`)

//──── bloques ───────────────────────────────────────────────
export const getBloques = () => api.get("/bloques");
export const crearBloque = (data)=> api.post("/bloques",data);
// endpoints.js




