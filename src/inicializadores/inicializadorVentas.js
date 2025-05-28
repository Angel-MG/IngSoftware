import { inicializarNavegacionVentas } from '../handlers/ventasNavigationHandlers.js';
import { inicializarFiltrosHistorial } from '../handlers/historialHandlers.js';
import { renderizarTablaPedidosCompletados } from '../vistas/componentes/tablaPedidosCompletados.js';

export function inicializarVistaVentas(pedidos, callbacks) {
  const pedidosCompletados = pedidos.filter(p => p.estado === 'completed');
  
  // Inicializar navegación
  inicializarNavegacionVentas();

  // Inicializar filtros de historial
  const manejadoresFiltros = inicializarFiltrosHistorial(pedidosCompletados, {
    onFiltrar: (pedidosFiltrados) => {
      const contenidoHistorial = document.getElementById('historialContent');
      if (contenidoHistorial) {
        contenidoHistorial.innerHTML = renderizarTablaPedidosCompletados(pedidosFiltrados);
        // Reconfigurar los manejadores después de actualizar el contenido
        manejadoresFiltros.actualizarFiltros();
      }
    }
  });
}