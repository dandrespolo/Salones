import { useState } from 'react'

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import {
  getMaterias,
  crearMateria,
  eliminarMateria,
} from '../api/endpoints'

import '../styles/Materias.css'

const FORM_VACIO = {
  nombre: '',
  codigo: '',
}

export default function Materias() {
  const queryClient = useQueryClient()

  const [mostrarForm, setMostrarForm] =
    useState(false)

  const [form, setForm] =
    useState(FORM_VACIO)

  const [error, setError] =
    useState('')

  /* ───────── QUERY ───────── */

  const {
    data: materias = [],
    isLoading,
  } = useQuery({
    queryKey: ['materias'],
    queryFn: () =>
      getMaterias().then((r) => r.data),
  })

  /* ───────── CREAR ───────── */

  const crear = useMutation({
    mutationFn: crearMateria,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['materias'],
      })

      setMostrarForm(false)
      setForm(FORM_VACIO)
      setError('')
    },

    onError: (err) => {
      setError(
        err.response?.data?.error ||
          'Error al crear la materia.'
      )
    },
  })

  /* ───────── ELIMINAR ───────── */

  const eliminarMutation = useMutation({
    mutationFn: eliminarMateria,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['materias'],
      })
    },
  })

  /* ───────── INPUTS ───────── */

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="materias-page">

      {/* HEADER */}
      <div className="materias-header">

        <div>
          <h1 className="materias-title">
            Materias
          </h1>

          <p className="materias-subtitle">
            Administración de materias académicas
          </p>
        </div>

        <button
          onClick={() =>
            setMostrarForm(!mostrarForm)
          }
          className="materias-btn"
        >
          {mostrarForm
            ? 'Cancelar'
            : '+ Nueva materia'}
        </button>

      </div>

      {/* FORMULARIO */}
      {mostrarForm && (
        <div className="materias-form-card">

          <div className="materias-form-header">
            <h3>Nueva materia</h3>

            <span>
              Completa la información
            </span>
          </div>

          {error && (
            <div className="materias-error">
              {error}
            </div>
          )}

          <div className="materias-grid">

            <div className="materias-field">

              <label>
                Nombre
              </label>

              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Matemáticas"
              />

            </div>

            <div className="materias-field">

              <label>
                Código
              </label>

              <input
                type="text"
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
                placeholder="Ej: MAT101"
              />

            </div>

          </div>

          <div className="materias-actions">

            <button
              onClick={() =>
                crear.mutate(form)
              }
              disabled={
                crear.isPending ||
                !form.nombre ||
                !form.codigo
              }
              className="guardar-btn"
            >
              {crear.isPending
                ? 'Creando...'
                : 'Crear materia'}
            </button>

          </div>

        </div>
      )}

      {/* LISTA */}
      <div className="materias-lista">

        {isLoading ? (

          <div className="materias-empty">
            Cargando materias...
          </div>

        ) : materias.length === 0 ? (

          <div className="materias-empty">
            No hay materias registradas.
          </div>

        ) : (

          <div className="materias-table">

            {materias.map((m) => (

              <div
                key={m.id}
                className="materia-row"
              >

                {/* NOMBRE */}
                <div className="materia-block">
                  <h4>{m.nombre}</h4>
                </div>

                {/* LABEL */}
                <div className="materia-label">
                  Código académico:
                </div>

                {/* CÓDIGO */}
                <div className="materia-code">
                  {m.codigo}
                </div>

                {/* ELIMINAR */}
                <button
                  className="eliminar-btn"
                  onClick={() =>
                    eliminarMutation.mutate(m.id)
                  }
                  disabled={
                    eliminarMutation.isPending
                  }
                >
                  ✕
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  )
}