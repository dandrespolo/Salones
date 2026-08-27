import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import useAuthStore from '../store/authStore'

import {
  LayoutDashboard,
  ClipboardList,
  History,
  Users,
  User,
  School,
  BookOpen,
  LogOut,
} from 'lucide-react'

import '../styles/layout.css'

export default function Layout() {

  const { usuario, logout } = useAuthStore()

  const navigate = useNavigate()

  const esAdmin = usuario?.rol === 'administrador'

  function cerrarSesion() {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout-container">

      {/* ───────────── SIDEBAR ───────────── */}
      <aside className="sidebar">

        {/* HEADER */}
        <div className="sidebar-header">

          <h1 className="sidebar-title">
            Gestión de Salones
          </h1>

          <p className="sidebar-role">
            {usuario?.rol}
          </p>

        </div>

        {/* NAV */}
        <nav className="sidebar-nav">

          {/* PRINCIPAL */}
          <div className="sidebar-menu">

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? 'sidebar-link-active' : ''
                }`
              }
            >
              <LayoutDashboard size={20} strokeWidth={2.3} />

              <span className="sidebar-link-text">
                Dashboard
              </span>
            </NavLink>

            

            <NavLink
              to="/historial"
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? 'sidebar-link-active' : ''
                }`
              }
            >
              <History size={20} strokeWidth={2.3} />

              <span className="sidebar-link-text">
                Historial
              </span>
            </NavLink>

            <NavLink
              to="/docentes"
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? 'sidebar-link-active' : ''
                }`
              }
            >
              <Users size={20} strokeWidth={2.3} />

              <span className="sidebar-link-text">
                Docentes
              </span>
            </NavLink>

          </div>

          {/* ADMIN */}
          {esAdmin && (
            <div className="sidebar-section">

              <p className="sidebar-section-title">
                Administración
              </p>

              <div className="sidebar-menu">

                <NavLink
                  to="/usuarios"
                  className={({ isActive }) =>
                    `sidebar-link ${
                      isActive ? 'sidebar-link-active' : ''
                    }`
                  }
                >
                  <User size={20} strokeWidth={2.3} />

                  <span className="sidebar-link-text">
                    Usuarios
                  </span>
                </NavLink>

                <NavLink
                  to="/salones"
                  className={({ isActive }) =>
                    `sidebar-link ${
                      isActive ? 'sidebar-link-active' : ''
                    }`
                  }
                >
                  <School size={20} strokeWidth={2.3} />

                  <span className="sidebar-link-text">
                    Salones
                  </span>
                </NavLink>

                <NavLink
                  to="/materias"
                  className={({ isActive }) =>
                    `sidebar-link ${
                      isActive ? 'sidebar-link-active' : ''
                    }`
                  }
                >
                  <BookOpen size={20} strokeWidth={2.3} />

                  <span className="sidebar-link-text">
                    Materias
                  </span>
                </NavLink>

              </div>
            </div>
          )}
        </nav>

        {/* FOOTER */}
        <div className="sidebar-footer">

          <div className="sidebar-user-box">

            {/* USER */}
            <div className="sidebar-user">

              <div className="sidebar-avatar">
                {usuario?.nombre?.charAt(0)}
              </div>

              <div className="sidebar-user-info">

                <p className="sidebar-user-name">
                  {usuario?.nombre}
                </p>

                <p className="sidebar-user-email">
                  {usuario?.email}
                </p>

              </div>
            </div>

            {/* LOGOUT */}
            <button
              onClick={cerrarSesion}
              className="sidebar-logout"
            >
              <LogOut size={18} />

              Cerrar sesión
            </button>

          </div>
        </div>
      </aside>

      {/* ───────────── CONTENIDO ───────────── */}
      <main className="layout-content">
        <Outlet />
      </main>

    </div>
  )
}