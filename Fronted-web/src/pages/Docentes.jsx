import '../styles/Docentes.css'

import { useState } from 'react'

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import {
  getDocentes,
  getMaterias,
  asignarMaterias,
} from '../api/endpoints'

import useAuthStore from '../store/authStore'

import {
  GraduationCap,
  Mail,
  Sparkles,
  X,
  Check,
  Search,
  BookOpen,
} from 'lucide-react'

export default function Docentes() {
  const { usuario } = useAuthStore()

  const esAdmin = usuario?.rol === 'administrador'

  const queryClient = useQueryClient()

  const [docenteSeleccionado, setDocenteSeleccionado] =
    useState(null)

  const [docenteActivo, setDocenteActivo] =
    useState(null)

  const [materiasElegidas, setMateriasElegidas] =
    useState([])

  const [busqueda, setBusqueda] =
    useState('')

  // DATA
  const {
    data: docentes = [],
    isLoading,
  } = useQuery({
    queryKey: ['docentes'],
    queryFn: () =>
      getDocentes().then(r => r.data),
  })

  const {
    data: materias = [],
  } = useQuery({
    queryKey: ['materias'],
    queryFn: () =>
      getMaterias().then(r => r.data),
    enabled: esAdmin,
  })

  // FILTRO
  const docentesFiltrados = docentes.filter(d => {
    const texto =
      `${d.nombre || d.docente} ${
        d.email
      } ${(d.materias || []).join(' ')}`
        .toLowerCase()

    return texto.includes(busqueda.toLowerCase())
  })

  // MUTATION — corregido para usar docente_id
  const guardar = useMutation({
    mutationFn: () => {
      const id = docenteSeleccionado.docente_id || docenteSeleccionado.id
      return asignarMaterias(id, materiasElegidas)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['docentes'],
      })
      setDocenteSeleccionado(null)
      setDocenteActivo(null)
    },
    onError: (err) => {
      alert(err.response?.data?.error || 'Error al asignar materias.')
    },
  })

  // FUNCIONES
  function abrirAsignacion(docente) {
    setDocenteSeleccionado(docente)

    const idsActuales = materias
      .filter(m =>
        docente.materias?.includes(m.nombre)
      )
      .map(m => m.id)

    setMateriasElegidas(idsActuales)
  }

  function toggleMateria(id) {
    setMateriasElegidas(prev =>
      prev.includes(id)
        ? prev.filter(m => m !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="docentes-container">

      {/* HEADER */}
      <div className="docentes-header">

        <div>
          <h1 className="docentes-title">
            Gestión Docentes
          </h1>

          <p className="docentes-subtitle">
            Administra docentes y materias
          </p>
        </div>

        <div className="docentes-stats">
          <BookOpen className="w-5 h-5" />

          <span>
            {docentesFiltrados.length} docentes
          </span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="search-container">

        <Search className="search-icon w-5 h-5" />

        <input
          type="text"
          placeholder="Buscar docente o materia..."
          value={busqueda}
          onChange={e =>
            setBusqueda(e.target.value)
          }
          className="search-input"
        />
      </div>

      {/* GRID */}
      <div className="docentes-grid">

        {isLoading ? (
          <div className="empty-box">
            Cargando docentes...
          </div>
        ) : docentesFiltrados.length === 0 ? (
          <div className="empty-box">
            No se encontraron docentes.
          </div>
        ) : (
          docentesFiltrados.map(d => (
            <div
              key={d.id || d.docente_id}
              className="docente-card"
              onClick={() =>
                setDocenteActivo(d)
              }
            >

              <div className="docente-top">

                <div className="docente-avatar">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>

                <div className="docente-info">

                  <h3 className="docente-name">
                    {d.nombre || d.docente}
                  </h3>

                  <div className="docente-email">
                    <Mail className="w-4 h-4" />
                    {d.email}
                  </div>
                </div>
              </div>

              <div className="docente-tags">

                {(d.materias || []).length > 0 ? (
                  d.materias
                    .filter(Boolean)
                    .slice(0, 3)
                    .map(m => (
                      <span
                        key={m}
                        className="materia-tag"
                      >
                        {m}
                      </span>
                    ))
                ) : (
                  <span className="docente-empty">
                    Sin materias
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL INFO */}
      {docenteActivo && (
        <div
          className="modal-overlay"
          onClick={() =>
            setDocenteActivo(null)
          }
        >

          <div
            className="details-modal"
            onClick={e => e.stopPropagation()}
          >

            <button
              className="close-btn"
              onClick={() =>
                setDocenteActivo(null)
              }
            >
              <X className="w-5 h-5" />
            </button>

            <div className="details-top">

              <div className="details-avatar">
                <GraduationCap className="w-12 h-12 text-green-600" />
              </div>

              <h2 className="details-name">
                {docenteActivo.nombre ||
                  docenteActivo.docente}
              </h2>

              <p className="details-email">
                {docenteActivo.email}
              </p>
            </div>

            <div className="details-section">

              <h3 className="details-title">
                Materias asignadas
              </h3>

              <div className="materias-list-tags">

                {(docenteActivo.materias || [])
                  .length > 0 ? (
                  docenteActivo.materias
                    .filter(Boolean)
                    .map(m => (
                      <span
                        key={m}
                        className="materia-big-tag"
                      >
                        {m}
                      </span>
                    ))
                ) : (
                  <div className="no-materias">
                    Este docente no tiene materias.
                  </div>
                )}
              </div>
            </div>

            {esAdmin && (
              <button
                onClick={() =>
                  abrirAsignacion(
                    docenteActivo
                  )
                }
                className="assign-btn modal-assign"
              >
                <Sparkles className="w-4 h-4" />
                Asignar materias
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODAL MATERIAS */}
      {docenteSeleccionado && (
        <div className="modal-overlay">

          <div className="modal-container">

            <div className="modal-content">

              <div className="modal-header">

                <div>
                  <h3 className="modal-title">
                    Asignar materias
                  </h3>

                  <p className="modal-subtitle">
                    {docenteSeleccionado.nombre ||
                      docenteSeleccionado.docente}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setDocenteSeleccionado(
                      null
                    )
                  }
                  className="close-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="materias-list">

                {materias.map(m => {
                  const active =
                    materiasElegidas.includes(
                      m.id
                    )

                  return (
                    <button
                      key={m.id}
                      onClick={() =>
                        toggleMateria(m.id)
                      }
                      className={`materia-item ${
                        active ? 'active' : ''
                      }`}
                    >

                      <div>
                        <p className="materia-name">
                          {m.nombre}
                        </p>

                        <p className="materia-code">
                          {m.codigo}
                        </p>
                      </div>

                      <div
                        className={`check-box ${
                          active ? 'checked' : ''
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="modal-footer">

                <button
                  onClick={() =>
                    setDocenteSeleccionado(null)
                  }
                  className="cancel-btn"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => guardar.mutate()}
                  disabled={guardar.isPending}
                  className="save-btn"
                >
                  {guardar.isPending
                    ? 'Guardando...'
                    : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}