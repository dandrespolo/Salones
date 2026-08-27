import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import {
  ClipboardList,
  Home,
  CheckCircle2,
  Users,
  ClipboardCheck,
  X,
} from 'lucide-react'

import {
  getSolicitudes,
  getSalones,
  getDocentes,
} from '../api/endpoints'

import '../styles/dashboard.css'

function Tarjeta({
  titulo,
  valor,
  descripcion,
  color,
  bgIcon,
  icono,
  onClick,
}) {
  return (
    <div
      className="dashboard-card dashboard-card-clickable"
      onClick={onClick}
    >
      <div
        className={`dashboard-card-line ${color}`}
      ></div>

      <div className="dashboard-card-body">

        <div className="dashboard-card-content">

          <div>

            <p className="dashboard-card-title">
              {titulo}
            </p>

            <h2
              className={`dashboard-card-value ${color.replace(
                'bg-',
                'text-'
              )}`}
            >
              {valor}
            </h2>

            <p className="dashboard-card-description">
              {descripcion}
            </p>

          </div>

          <div
            className={`dashboard-card-icon ${bgIcon}`}
          >
            {icono}
          </div>

        </div>

      </div>

    </div>
  )
}

function ModalInfo({
  abierto,
  titulo,
  datos,
  onClose,
}) {
  if (!abierto) return null

  return (
    <div className="dashboard-modal-overlay">

      <div className="dashboard-modal">

        <div className="dashboard-modal-header">

          <h2>{titulo}</h2>

          <button
            onClick={onClose}
            className="dashboard-modal-close"
          >
            <X size={20} />
          </button>

        </div>

        <div className="dashboard-modal-body">

          {datos.length === 0 ? (

            <div className="dashboard-empty">

              <div className="dashboard-empty-icon">

                <ClipboardCheck
                  size={42}
                  className="text-gray-400"
                />

              </div>

              <h4 className="dashboard-empty-title">
                Sin información
              </h4>

              <p className="dashboard-empty-text">
                No hay registros disponibles.
              </p>

            </div>

          ) : (

            <div className="dashboard-list">

              {datos.map((item, index) => (

                <div
                  key={index}
                  className="dashboard-item"
                >

                  <div>

                    <p className="dashboard-item-name">
                      {item.titulo}
                    </p>

                    <p className="dashboard-item-info">
                      {item.descripcion}
                    </p>

                  </div>

                  {item.estado && (

                    <span className="dashboard-badge">
                      {item.estado}
                    </span>

                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  )
}

export default function Dashboard() {

  const [modalOpen, setModalOpen] =
    useState(false)

  const [modalTitle, setModalTitle] =
    useState('')

  const [modalData, setModalData] =
    useState([])

  const [fechaHora, setFechaHora] =
    useState(new Date())

  useEffect(() => {

    const intervalo = setInterval(() => {

      setFechaHora(new Date())

    }, 1000)

    return () =>
      clearInterval(intervalo)

  }, [])

  const fechaActual =
    fechaHora.toLocaleDateString(
      'es-CO',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    )

  const horaActual =
    fechaHora.toLocaleTimeString(
      'es-CO',
      {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }
    )

  const {
    data: solicitudes = [],
  } = useQuery({
    queryKey: ['solicitudes'],
    queryFn: () =>
      getSolicitudes().then(
        (r) => r.data
      ),
  })

  const {
    data: salones = [],
  } = useQuery({
    queryKey: ['salones'],
    queryFn: () =>
      getSalones().then(
        (r) => r.data
      ),
  })

  const {
    data: docentes = [],
  } = useQuery({
    queryKey: ['docentes'],
    queryFn: () =>
      getDocentes().then(
        (r) => r.data
      ),
  })

  const pendientes =
    solicitudes.filter(
      (s) =>
        s.estado === 'pendiente'
    ).length

  const disponibles =
    salones.filter(
      (s) => s.disponible
    ).length

  const ocupados =
    salones.filter(
      (s) => !s.disponible
    ).length

  const solicitudesPendientes =
    solicitudes.filter(
      (s) =>
        s.estado === 'pendiente'
    )

  const abrirModal = (
    titulo,
    datos
  ) => {

    setModalTitle(titulo)
    setModalData(datos)
    setModalOpen(true)

  }

  const cerrarModal = () => {

    setModalOpen(false)

  }

  const salonesOcupados =
    salones
      .filter(
        (s) => !s.disponible
      )
      .map((s) => ({
        titulo:
          s.nombre ||
          s.salon,
        descripcion:
          `${s.bloque || 'Bloque'} • Ocupado`,
        estado: 'En uso',
      }))

  const salonesDisponibles =
    salones
      .filter(
        (s) => s.disponible
      )
      .map((s) => ({
        titulo:
          s.nombre ||
          s.salon,
        descripcion:
          `${s.bloque || 'Bloque'} • Disponible`,
        estado: 'Libre',
      }))

  const docentesActivos =
    solicitudes
      .filter(
        (s) =>
          s.estado ===
          'aprobado'
      )
      .map((s) => ({
        titulo:
          s.docente,
        descripcion:
          `${s.salon} — ${s.materia}`,
        estado: 'Activo',
      }))

  return (

    <div className="dashboard-container">

      <div className="dashboard-header">

        <h1 className="dashboard-title">
          Dashboard
        </h1>

        <div className="dashboard-header-right">

          <span className="dashboard-date">

            {fechaActual
              .charAt(0)
              .toUpperCase() +
              fechaActual.slice(1)}

            {' • '}

            {horaActual}

          </span>

          <span className="dashboard-role">
            Administrador
          </span>

        </div>

      </div>

      <div className="dashboard-grid">

        <Tarjeta
          titulo="Solicitudes pendientes"
          valor={pendientes}
          descripcion="Esperando aprobación"
          color="bg-amber-500"
          bgIcon="bg-amber-50"
          onClick={() =>
            abrirModal(
              'Solicitudes pendientes',
              solicitudesPendientes.map(
                (s) => ({
                  titulo:
                    s.docente,
                  descripcion:
                    `${s.salon} — ${s.materia}`,
                  estado:
                    'Pendiente',
                })
              )
            )
          }
          icono={
            <ClipboardList
              size={22}
              className="text-amber-500"
            />
          }
        />

        <Tarjeta
          titulo="Salones en uso"
          valor={ocupados}
          descripcion="Actualmente ocupados"
          color="bg-red-500"
          bgIcon="bg-red-50"
          onClick={() =>
            abrirModal(
              'Salones en uso',
              salonesOcupados
            )
          }
          icono={
            <Home
              size={22}
              className="text-red-500"
            />
          }
        />

        <Tarjeta
          titulo="Salones disponibles"
          valor={disponibles}
          descripcion={`De ${salones.length} en total`}
          color="bg-green-500"
          bgIcon="bg-green-50"
          onClick={() =>
            abrirModal(
              'Salones disponibles',
              salonesDisponibles
            )
          }
          icono={
            <CheckCircle2
              size={22}
              className="text-green-500"
            />
          }
        />

        <Tarjeta
          titulo="Docentes activos"
          valor={docentes.length}
          descripcion="Registrados en el sistema"
          color="bg-emerald-600"
          bgIcon="bg-emerald-50"
          onClick={() =>
            abrirModal(
              'Docentes activos',
              docentesActivos
            )
          }
          icono={
            <Users
              size={22}
              className="text-emerald-600"
            />
          }
        />

      </div>
{/* SOLICITUDES */}
<div className="dashboard-box">

  <div className="dashboard-box-header">

    <div className="dashboard-box-title">

      <div className="dashboard-box-dot"></div>

      <h3>
        Solicitudes pendientes
      </h3>

    </div>

    <button className="dashboard-button">
      Ver todas
    </button>

  </div>

  <div className="dashboard-box-content">

    {solicitudesPendientes.length === 0 ? (

      <div className="dashboard-empty">

        <div className="dashboard-empty-icon">

          <ClipboardCheck
            size={42}
            className="text-gray-400"
          />

        </div>

        <h4 className="dashboard-empty-title">
          Todo al día
        </h4>

        <p className="dashboard-empty-text">
          No hay solicitudes pendientes
          de aprobación en este momento.
        </p>

      </div>

    ) : (

      <div className="dashboard-list">

        {solicitudesPendientes
          .slice(0, 5)
          .map((s) => (

            <div
              key={s.id}
              className="dashboard-item"
            >

              <div>

                <p className="dashboard-item-name">
                  {s.docente}
                </p>

                <p className="dashboard-item-info">
                  {s.salon} — {s.bloque} · {s.materia}
                </p>

              </div>

              <span className="dashboard-badge">
                Pendiente
              </span>

            </div>

          ))}

      </div>

    )}

  </div>

</div>
      <ModalInfo
        abierto={modalOpen}
        titulo={modalTitle}
        datos={modalData}
        onClose={cerrarModal}
      />

    </div>

  )
}