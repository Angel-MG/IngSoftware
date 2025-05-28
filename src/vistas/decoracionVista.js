import { renderizarTablaPedidosDecoracion } from './componentes/tablaPedidosDecoracion.js';
import { renderizarModalDetallesPedido } from './componentes/modalDetallesPedido.js';

export function renderizarVistaDecoracion(pedidos = []) {
  const pedidosParaDecorar = pedidos.filter(p => 
    p.estado === 'ready_for_decoration' || p.estado === 'pending'
  );

  return `
    <div class="app-layout">
      <nav class="nav-menu">
        <div class="nav-container">
          <div class="nav-brand">Pastelería El Ángel</div>
          <div class="nav-links">
            <a href="#" class="nav-link active" data-view="decoracion">Decoración</a>
          </div>
          <div class="nav-actions">
            <button id="logoutBtn" class="logout-btn">
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </nav>

      <div class="main-content">
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">Pedidos para Decorar</h2>
          </div>
          <div class="table-container">
            ${renderizarTablaPedidosDecoracion(pedidosParaDecorar)}
          </div>
        </div>
        ${renderizarModalDetallesPedido()}
      </div>
    </div>
  `;
}