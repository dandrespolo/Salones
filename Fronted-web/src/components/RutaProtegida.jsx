import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

// roles: array de roles permitidos, ej: ['administrador'] o ['administrador','monitor']
export default function RutaProtegida({ children, roles = [] }) {
  const { token, usuario } = useAuthStore()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (roles.length > 0 && !roles.includes(usuario?.rol)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
