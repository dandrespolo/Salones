import { create } from 'zustand'

const useAuthStore = create((set) => ({
  // Cargar desde localStorage si ya había una sesión
  token:   localStorage.getItem('token')   || null,
  usuario: JSON.parse(localStorage.getItem('usuario') || 'null'),

  setAuth: (token, usuario) => {
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(usuario))
    set({ token, usuario })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    set({ token: null, usuario: null })
  },
}))

export default useAuthStore
