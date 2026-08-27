import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSolicitudes, aprobarSolicitud, rechazarSolicitud } from '../api/endpoints'

const colores = {
  pendiente:  'bg-amber-50 text-amber-700',
  aprobada:   'bg-green-50 text-green-700',
  rechazada:  'bg-red-50 text-red-700',
  finalizada: 'bg-gray-100 text-gray-600',
}

export default function Solicitudes() {
  const queryClient = useQueryClient()

  const { data: solicitudes = [], isLoading } = useQuery({
    queryKey: ['solicitudes'],
    queryFn: () => getSolicitudes().then(r => r.data),
    refetchInterval: 15000, // refrescar cada 15 segundos automáticamente
  })

  const aprobar = useMutation({
    mutationFn: aprobarSolicitud,
    onSuccess: () => queryClient.invalidateQueries(['solicitudes']),
  })

  const rechazar = useMutation({
    mutationFn: rechazarSolicitud,
    onSuccess: () => queryClient.invalidateQueries(['solicitudes']),
  })

  if (isLoading) return <p className="text-sm text-gray-400">Cargando...</p>

  const pendientes  = solicitudes.filter(s => s.estado === 'pendiente')
  const historial   = solicitudes.filter(s => s.estado !== 'pendiente')

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Solicitudes</h2>

      {/* ── Pendientes ─────────────────────────────────────── */}
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
        Pendientes ({pendientes.length})
      </h3>

      <div className="bg-white rounded-xl border border-gray-200 mb-8">
        <div className="divide-y divide-gray-100">
          {pendientes.length === 0 ? (
            <p className="px-6 py-10 text-sm text-gray-400 text-center">
              No hay solicitudes pendientes
            </p>
          ) : (
            pendientes.map(s => (
              <div key={s.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{s.docente}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {s.salon} · {s.bloque} · {s.materia}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Solicitado: {new Date(s.hora_solicitud).toLocaleString('es-CO')}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => aprobar.mutate(s.id)}
                    disabled={aprobar.isPending}
                    className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => rechazar.mutate(s.id)}
                    disabled={rechazar.isPending}
                    className="px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Historial reciente ──────────────────────────────── */}
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
        Recientes
      </h3>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="divide-y divide-gray-100">
          {historial.slice(0, 10).map(s => (
            <div key={s.id} className="px-6 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{s.docente}</p>
                <p className="text-xs text-gray-500">{s.salon} · {s.materia}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full capitalize ${colores[s.estado]}`}>
                {s.estado}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
