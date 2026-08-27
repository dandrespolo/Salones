import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getSalones,
  crearSalon,
  eliminarSalon,
  getBloques,
  crearBloque,
} from "../../../../../Proyecto-Cloud-main/Proyecto-Cloud-main/frontend-web/src/api/endpoints";

import "../styles/Salones.css";

const FORM_VACIO = {
  nombre: "",
  bloque: "",
  piso: 1,
  capacidad: 30,
};

const BLOQUE_VACIO = {
  nombre: "",
};

export default function Salones() {

  const queryClient = useQueryClient();

  const [mostrarForm, setMostrarForm] =
    useState(false);

  const [mostrarBloque, setMostrarBloque] =
    useState(false);

  const [form, setForm] =
    useState(FORM_VACIO);

  const [nuevoBloque, setNuevoBloque] =
    useState(BLOQUE_VACIO);

  const [pisoFiltro, setPisoFiltro] =
    useState("todos");

  // SALONES

  const {
    data: salones = [],
    isLoading,
  } = useQuery({

    queryKey: ["salones"],

    queryFn: () =>
      getSalones()
        .then(r => r.data),

    refetchInterval: 10000

  });

  // BLOQUES

  const {
    data: bloques = []
  } = useQuery({
    queryKey: ["bloques"],
    queryFn: () =>
      getBloques()
        .then(r => r.data)

  });

  // CREAR SALON

  const crear = useMutation({

    mutationFn: crearSalon,
    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["salones"]
      });
      setMostrarForm(false);
      setForm(FORM_VACIO);
    }

  });

  // ELIMINAR

  const eliminar = useMutation({

    mutationFn: eliminarSalon,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["salones"]
      });

    }

  });

  // CREAR BLOQUE

  const crearBloqueMutation =
    useMutation({
      mutationFn: crearBloque,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["bloques"]
        });
        setMostrarBloque(false);
        setNuevoBloque(
          BLOQUE_VACIO
        );
      }
    });

  function handleChange(e) {

    setForm(prev => ({
      ...prev,
      [e.target.name]:
        e.target.value
    }));

  }

  const salonesFiltrados =

    pisoFiltro === "todos"

      ? salones
      : salones.filter( s => String(s.piso) === pisoFiltro

      );

  return (

    <div className="salones-container">

      {/* HEADER */}
      <div className="salones-header">
        <div>
          <h2 className="salones-title">
            Gestión de Salones
          </h2>

          <p className="salones-subtitle">
            Administración de salones por piso
          </p>
        </div>
   <div className="acciones-header">

          <button
            className="btn-bloque"
            onClick={() =>
              setMostrarBloque(
                !mostrarBloque
              )}
          >

            {mostrarBloque
              ? "Cancelar"
              : "+ Nuevo bloque"}

          </button>

          <button
            className="btn-nuevo"
            onClick={() =>
              setMostrarForm(
                !mostrarForm
              )}
          >

            {mostrarForm
              ? "Cancelar"
              : "+ Nuevo salón"}

          </button>

        </div>

      </div>

      {/* FILTROS */}

      <div className="filtros-container">

        {[
          "todos",
          "1",
          "2",
          "3"
        ].map(item => (

          <button

            key={item}

            onClick={() =>
              setPisoFiltro(item)
            }

            className={

              pisoFiltro === item

                ? "activo"

                : ""

            }

          >

            {

              item === "todos"

                ? "Todos"

                : `Piso ${item}`

            }

          </button>

        ))}

      </div>

      {/* CREAR BLOQUE */}

      {

        mostrarBloque && (

          <div className="bloque-form">

            <h3>

              Crear bloque

            </h3>

            <input

              placeholder="Bloque A"

              value={
                nuevoBloque.nombre
              }

              onChange={(e) =>

                setNuevoBloque({

                  ...nuevoBloque,

                  nombre:
                    e.target.value

                })

              }

            />
            <button className="btn-crear"
               onClick={() => crearBloqueMutation.mutate(nuevoBloque)
              }          
            >
              Crear bloque
            </button>
          </div>
        )     }

      {/* FORM SALON */}

      {
        mostrarForm && (
         <div className="form-container">
              <h3>
              Nuevo salón
            </h3>
            <div className="form-grid">
              <div>
                <label>
                  Nombre
                </label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                 placeholder="Salón 101"
                />
              </div>
              <div>
                <label>
                  Bloque
                </label>
                <select
                  name="bloque"
                  value={form.bloque}
                  onChange={handleChange}
                >
                  <option value="">
                    Seleccione
                  </option>
                  {
                    bloques.map(
                      (b) => (
                       <option
                          key={b.id}
                          value={b.nombre}
                        >
                          {b.nombre}
                        </option>
                      )
                    )
                  }
                </select>
              </div>
              <div>
                <label>
                  Piso
                </label>

               <select
                  name="piso"
                  value={form.piso}
                  onChange={handleChange}
                >
                  <option value={1}>
                    Piso 1
                  </option>

                  <option value={2}>
                    Piso 2
                  </option>

                  <option value={3}>
                    Piso 3
                  </option>

                </select>

              </div>

              <div>
                <label>
                  Capacidad
                </label>
                <input
                  type="number"
                  name="capacidad"
                  value={
                    form.capacidad
                  }
                  onChange={
                    handleChange
                  }

                />
              </div>
            </div>
            <div className="form-actions">
              <button
                className="btn-crear"
                disabled={
                  crear.isPending
                }
                onClick={() =>crear.mutate(form)
                }
              >
              {
                  crear.isPending
                    ? "Creando..."
                    : "Crear salón"
              }
              </button>
            </div>
           </div>
        )
      }

      {/* GRID */}
      { isLoading
         ?
          <p>Cargando... </p>
          :
          <div className="salones-grid">
            { salonesFiltrados
                .map(s => (
                  <div
                    key={s.id}
                    className={`salon-card piso-${s.piso}`
                    }
                  >
                    <div className="salon-top">
                      <div>
                        <h3> {s.nombre}  </h3>
                        <p>{s.bloque}</p>
                      </div>

                      <span
                        className={s.disponible
                          ? "estado-libre"
                          : "estado-ocupado"
                        }
                      >
                        {
                          s.disponible
                            ? "Libre"
                            : "Ocupado"
                        }
                      </span>
                    </div>

                    <div className="salon-info">
                      <p>Piso:{s.piso} </p>
                      <p>Capacidad:{s.capacidad} </p>
                    </div>

                    <button className="btn-eliminar"
                      onClick={() => {
                        if (confirm(`Eliminar ${s.nombre}?`)
                        ) {
                          eliminar.mutate(s.id)
                        }
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                ))
            }
          </div>
      }
    </div>
  )
}