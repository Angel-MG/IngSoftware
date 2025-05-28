import { formatearFecha } from '../../utilidades/formatoFecha.js';

export function renderizarFiltrosHistorial() {
  const fechaHoy = new Date().toISOString().split('T')[0];
  
  return `
    <div class="filters-container">
      <div class="filter-group">
        <input 
          type="text" 
          id="clienteFilter" 
          placeholder="Filtrar por cliente..."
          class="filter-input"
        >
        <div class="date-filters">
          <div class="filter-date-group">
            <label for="fechaDesde">Desde:</label>
            <input 
              type="date" 
              id="fechaDesde" 
              class="filter-input"
              max="${fechaHoy}"
            >
          </div>
          <div class="filter-date-group">
            <label for="fechaHasta">Hasta:</label>
            <input 
              type="date" 
              id="fechaHasta" 
              class="filter-input"
              max="${fechaHoy}"
            >
          </div>
        </div>
        <button id="aplicarFiltros" class="filter-btn">Aplicar Filtros</button>
        <button id="limpiarFiltros" class="filter-btn clear">Limpiar Filtros</button>
      </div>
    </div>
  `;
}