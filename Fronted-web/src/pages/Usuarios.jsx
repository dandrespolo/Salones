import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsuarios, crearUsuario, actualizarUsuario } from '../api/endpoints'
import '../styles/Usuarios.css'
import {
  User,
  Mail,
  Shield,
  Plus,
  CheckCircle,
  XCircle,
  Loader2,
  Users,
  GraduationCap,
  UserCog,
  Filter,
} from 'lucide-react'

const rolesOpciones = [
  { id: 1, nombre: 'administrador' },
  { id: 2, nombre: 'monitor' },
  { id: 3, nombre: 'docente' },
]

const FORM_VACIO = {
  nombre: '',
  apellidos: '',
  email: '',
  password: '',
  rol_id: 3,
}

export default function Usuarios() {
  const queryClient = useQueryClient()

  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState(FORM_VACIO)
  const [error, setError] = useState('')
  const [filtroRol, setFiltroRol] = useState('todos')

  const { data: usuarios = [], isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => getUsuarios().then(r => r.data),
  })

  const crear = useMutation({
    mutationFn: crearUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['usuarios'],
      })

      setMostrarForm(false)
      setForm(FORM_VACIO)
      setError('')
    },

    onError: (err) =>
      setError(
        err.response?.data?.error ||
        'Error al crear usuario.'
      ),
  })

  const toggleActivo = useMutation({
    mutationFn: ({ id, activo }) =>
      actualizarUsuario(id, { activo }),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['usuarios'],
      }),
  })

  const admins = usuarios.filter(
    u => u.rol?.toLowerCase() === 'administrador'
  ).length

  const monitores = usuarios.filter(
    u => u.rol?.toLowerCase() === 'monitor'
  ).length

  const docentes = usuarios.filter(
    u => u.rol?.toLowerCase() === 'docente'
  ).length

  const usuariosFiltrados =
    filtroRol === 'todos'
      ? usuarios
      : usuarios.filter(
          u => u.rol?.toLowerCase() === filtroRol
        )

  function handleChange(e) {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    crear.mutate(form)
  }

  return (
    <div className="usuarios-container">

      <div className="usuarios-header">
        <div>
          <h1 className="usuarios-title">
            Gestión de Usuarios
          </h1>

          <p className="usuarios-subtitle">
            Administra los usuarios del sistema
          </p>
        </div>

        <button
          onClick={() =>
            setMostrarForm(!mostrarForm)
          }
          className="usuarios-btn-primary"
        >
          <Plus size={18} />

          {mostrarForm
            ? 'Cancelar'
            : 'Nuevo usuario'}
        </button>
      </div>

      <div className="usuarios-stats">

        <div className="stat-card">
          <div className="stat-icon admin">
            <UserCog size={24} />
          </div>

          <div>
            <h3>{admins}</h3>
            <p>Administradores</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon monitor">
            <Users size={24} />
          </div>

          <div>
            <h3>{monitores}</h3>
            <p>Monitores</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon docente">
            <GraduationCap size={24} />
          </div>

          <div>
            <h3>{docentes}</h3>
            <p>Docentes</p>
          </div>
        </div>

      </div>

      <div className="usuarios-filtro">

        <div className="filtro-label">
          <Filter size={18} />
          <span>Filtrar por rol</span>
        </div>

        <select
          value={filtroRol}
          onChange={(e) =>
            setFiltroRol(e.target.value)
          }
          className="filtro-select"
        >
          <option value="todos">
            Todos
          </option>

          <option value="administrador">
            Administradores
          </option>

          <option value="monitor">
            Monitores
          </option>

          <option value="docente">
            Docentes
          </option>

        </select>

      </div>

      {mostrarForm && (

        <div className="usuarios-form-card">

          <div className="usuarios-form-header">
            <h2>
              Crear nuevo usuario
            </h2>
          </div>

          {error && (
            <div className="usuarios-error">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="usuarios-form"
          >

            <div className="usuarios-input-group">

              <label>Nombre</label>

              <div className="usuarios-input-wrapper">

                <User size={18} />

                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  required
                />

              </div>

            </div>

            <div className="usuarios-input-group">

              <label>Apellidos</label>

              <div className="usuarios-input-wrapper">

                <User size={18} />

                <input
                  type="text"
                  name="apellidos"
                  value={form.apellidos}
                  onChange={handleChange}
                  placeholder="Apellidos"
                  required
                />

              </div>

            </div>

            <div className="usuarios-input-group">

              <label>Email</label>

              <div className="usuarios-input-wrapper">

                <Mail size={18} />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="correo@email.com"
                  required
                />

              </div>

            </div>

            <div className="usuarios-input-group">

              <label>Contraseña</label>

              <div className="usuarios-input-wrapper">

                <Shield size={18} />

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />

              </div>

            </div>

            <div className="usuarios-input-group">

              <label>Rol</label>

              <div className="usuarios-input-wrapper">

                <Shield size={18} />

                <select
                  name="rol_id"
                  value={form.rol_id}
                  onChange={handleChange}
                >

                  {rolesOpciones.map(r => (

                    <option
                      key={r.id}
                      value={r.id}
                    >
                      {r.nombre}
                    </option>

                  ))}

                </select>

              </div>

            </div>

            <div className="usuarios-form-actions">

              <button
                type="submit"
                disabled={crear.isPending}
                className="usuarios-btn-save"
              >

                {crear.isPending ? (

                  <>
                    <Loader2
                      size={18}
                      className="spin"
                    />
                    Creando...
                  </>

                ) : (

                  <>
                    <Plus size={18} />
                    Crear usuario
                  </>

                )}

              </button>

            </div>

          </form>

        </div>

      )}

      <div className="usuarios-table-card">

        <table className="usuarios-table">

          <thead>

            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>

          </thead>

          <tbody>

            {isLoading ? (

              <tr>

                <td
                  colSpan={5}
                  className="usuarios-loading"
                >
                  Cargando usuarios...
                </td>

              </tr>

            ) : usuariosFiltrados.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="usuarios-loading"
                >
                  No existen usuarios
                </td>

              </tr>

            ) : (

              usuariosFiltrados.map(u => (

                <tr key={u.id}>

                  <td>

                    <div className="usuario-info">

                      <div className="usuario-avatar">

                        {`${u.nombre?.[0] || ''}${u.apellidos?.[0] || ''}`
                          .toUpperCase()}

                      </div>

                      <div>

                        <span className="usuario-nombre">

                          {u.nombre} {u.apellidos}

                        </span>

                      </div>

                    </div>

                  </td>

                  <td>
                    {u.email}
                  </td>

                  <td>

                    <span className="usuario-rol">
                      {u.rol}
                    </span>

                  </td>

                  <td>

                    {u.activo ? (

                      <span className="estado activo">
                        <CheckCircle size={15}/>
                        Activo
                      </span>

                    ) : (

                      <span className="estado inactivo">
                        <XCircle size={15}/>
                        Inactivo
                      </span>

                    )}

                  </td>

                  <td>

                    <button
                      onClick={() =>
                        toggleActivo.mutate({
                          id: u.id,
                          activo: !u.activo,
                        })
                      }

                      className={
                        u.activo
                          ? 'btn-estado desactivar'
                          : 'btn-estado activar'
                      }
                    >

                      {u.activo
                        ? 'Desactivar'
                        : 'Activar'}

                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}