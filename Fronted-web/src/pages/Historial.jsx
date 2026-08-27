// Historial.jsx

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import {
  CalendarDays,
  Clock3,
  User2,
  School,
  BookOpen,
  FilterX,
  History,
  Search,
} from 'lucide-react'

import {
  getHistorial,
  getDocentes,
  getSalones,
} from '../api/endpoints'

import '../styles/historial.css'

export default function Historial() {

  const [filtros, setFiltros] = useState({
    docente_id: '',
    salon_id: '',
    desde: '',
    hasta: '',
  })

  /* ─────────────────────────────
     CONSULTAS
  ───────────────────────────── */

  const { data: docentes = [] } = useQuery({
    queryKey: ['docentes'],
    queryFn: () =>
      getDocentes().then((r) => r.data),
  })

  const { data: salones = [] } = useQuery({
    queryKey: ['salones'],
    queryFn: () =>
      getSalones().then((r) => r.data),
  })

  const {
    data: historial = [],
    isLoading,
  } = useQuery({
    queryKey: ['historial', filtros],
    queryFn: () =>
      getHistorial(filtros).then((r) => r.data),
  })

  /* ─────────────────────────────
     FILTROS
  ───────────────────────────── */

  function handleFiltro(e) {
    setFiltros((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  function limpiarFiltros() {
    setFiltros({
      docente_id: '',
      salon_id: '',
      desde: '',
      hasta: '',
    })
  }

  return (
    <div className="historial-container">

      {/* HEADER */}
      <div className="historial-header">
        <div className="historial-title-box">
          <div>
            <h1 className="historial-title">
              Historial de uso
            </h1>

            <p className="historial-subtitle">
              Consulta el historial de docentes y salones
            </p>

          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="historial-filtros">

        {/* DOCENTES */}
        <div className="historial-input-group">

          <label>
            Filtrar por docente
          </label>

          <div className="historial-input-icon">

            <User2 size={18} />

            <select
              name="docente_id"
              value={filtros.docente_id}
              onChange={handleFiltro}
            >

              <option value="">
                Todos los docentes
              </option>

              {docentes.map((d) => (

                <option
                  key={d.id}
                  value={d.id}
                >
                  {d.nombre}
                </option>
              ))}

            </select>

          </div>
        </div>

        {/* SALONES */}
        <div className="historial-input-group">

          <label>
            Filtrar por salón
          </label>

          <div className="historial-input-icon">

            <School size={18} />

            <select
              name="salon_id"
              value={filtros.salon_id}
              onChange={handleFiltro}
            >

              <option value="">
                Todos los salones
              </option>

              {salones.map((s) => (

                <option
                  key={s.id}
                  value={s.id}
                >
                  {s.nombre || s.salon}
                </option>
              ))}

            </select>

          </div>
        </div>

        {/* DESDE */}
        <div className="historial-input-group">

          <label>
            Desde
          </label>

          <div className="historial-input-icon">

            <CalendarDays size={18} />

            <input
              type="date"
              name="desde"
              value={filtros.desde}
              onChange={handleFiltro}
            />

          </div>
        </div>

        {/* HASTA */}
        <div className="historial-input-group">

          <label>
            Hasta
          </label>

          <div className="historial-input-icon">

            <CalendarDays size={18} />

            <input
              type="date"
              name="hasta"
              value={filtros.hasta}
              onChange={handleFiltro}
            />

          </div>
        </div>

        {/* LIMPIAR */}
        <button
          onClick={limpiarFiltros}
          className="historial-clear-btn"
        >

          <FilterX size={16} />

          Limpiar filtros

        </button>

      </div>

      {/* TABLA */}
      <div className="historial-table-container">

        <table className="historial-table">

          <thead>

            <tr>

              <th>Docente</th>
              <th>Salón</th>
              <th>Materia</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Duración</th>

            </tr>

          </thead>

          <tbody>

            {isLoading ? (

              <tr>

                <td
                  colSpan={6}
                  className="historial-empty"
                >
                  Cargando historial...
                </td>

              </tr>

            ) : historial.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="historial-empty"
                >

                  <div className="historial-empty-box">

                    <Search size={40} />

                    <h3>
                      No se encontraron registros
                    </h3>

                    <p>
                      Intenta modificar los filtros
                      de búsqueda
                    </p>

                  </div>

                </td>

              </tr>

            ) : (

              historial.map((h) => (

                <tr key={h.id}>

                  {/* DOCENTE */}
                  <td>

                    <div className="historial-docente">

                      <div className="historial-avatar">
                        <User2 size={16} />
                      </div>

                      <span>
                        {h.docente}
                      </span>

                    </div>

                  </td>

                  {/* SALON */}
                  <td>

                    <div className="historial-info">

                      <School size={15} />

                      {h.salon} · {h.bloque}

                    </div>

                  </td>

                  {/* MATERIA */}
                  <td>

                    <div className="historial-info">

                      <BookOpen size={15} />

                      {h.materia}

                    </div>

                  </td>

                  {/* FECHA INICIO */}
                  <td>
                    {new Date(
                      h.hora_inicio
                    ).toLocaleString('es-CO')}
                  </td>

                  {/* FECHA FIN */}
                  <td>
                    {new Date(
                      h.hora_fin
                    ).toLocaleString('es-CO')}
                  </td>

                  {/* DURACION */}
                  <td>

                    <span className="historial-badge">

                      <Clock3 size={14} />

                      {h.duracion_minutos} min

                    </span>

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