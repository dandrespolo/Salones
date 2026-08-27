import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Layout         from './components/Layout'
import RutaProtegida  from './components/RutaProtegida'
import Login          from './pages/Login'
import Dashboard      from './pages/Dashboard'
import Solicitudes    from './pages/Solicitudes'
import Historial      from './pages/Historial'
import Docentes       from './pages/Docentes'
import Usuarios       from './pages/Usuarios'
import Salones        from './pages/Salones'
import Materias       from './pages/Materias'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000, // datos frescos por 30 segundos
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas dentro del Layout */}
          <Route
            path="/"
            element={
              <RutaProtegida>
                <Layout />
              </RutaProtegida>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"   element={<Dashboard />} />
            <Route path="solicitudes" element={<Solicitudes />} />
            <Route path="historial"   element={<Historial />} />
            <Route path="docentes"    element={<Docentes />} />
            <Route path="materias"    element={<Materias />} />

            {/* Solo admin */}
            <Route
              path="usuarios"
              element={
                <RutaProtegida roles={['administrador']}>
                  <Usuarios />
                </RutaProtegida>
              }
            />
            <Route
              path="salones"
              element={
                <RutaProtegida roles={['administrador']}>
                  <Salones />
                </RutaProtegida>
              }
            />
          </Route>

          <Route
              path="materias"
              element={
                <RutaProtegida roles={['administrador']}>
                  <Materias />
                </RutaProtegida>
              }
          />

          {/* Cualquier ruta desconocida → dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
