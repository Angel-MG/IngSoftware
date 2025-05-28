export function traducirEstado(estado) {
  const estados = {
    'pending': 'Pendiente',
    'ready_for_decoration': 'Listo para Decorar',
    'completed': 'Completado'
  };
  return estados[estado] || estado;
}