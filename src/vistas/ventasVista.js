import { renderizarTablaPedidosActivos } from "./componentes/tablaPedidosActivos.js";
import { renderizarTablaPedidosCompletados } from "./componentes/tablaPedidosCompletados.js";

export function renderizarVistaVentas(pedidos = [], productos = []) {
  const pedidosActivos = pedidos.filter((p) => p.estado !== "completed");
  const pedidosCompletados = pedidos.filter((p) => p.estado === "completed");
  const productosTerminados = productos.filter((p) => p.tipo === "terminado");

  return `
    <div class="app-layout">
      <nav class="nav-menu">
        <div class="nav-container">
          <div class="nav-brand">Pastelería El Ángel</div>
          <div class="nav-links">
            <a href="#" class="nav-link active" data-section="pedidos">Pedidos</a>
            <a href="#" class="nav-link" data-section="inventario">Inventario</a>
            <a href="#" class="nav-link" data-section="historial">Historial</a>
          </div>
          <div class="nav-actions">
            <button id="logoutBtn" class="logout-btn">
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </nav>

      <div class="main-content">
        <!-- Sección de Pedidos Activos -->
        <div id="pedidosSection" class="section">
          <div class="section-header">
            <h2 class="section-title">Pedidos Activos</h2>
            <button id="newOrderBtn" class="primary-btn">Nuevo Pedido</button>
          </div>
          <div class="table-container">
            ${renderizarTablaPedidosActivos(pedidosActivos)}
          </div>
        </div>

        <!-- Sección de Inventario -->
        <div id="inventarioSection" class="section" style="display: none;">
          <div class="section-header">
            <h2 class="section-title">Productos Disponibles</h2>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Unidad</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                ${productosTerminados
                  .map(
                    (producto) => `
                  <tr>
                    <td>${producto.nombre}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.unidad}</td>
                    <td>$${producto.precio.toFixed(2)}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Sección de Historial -->
        <div id="historialSection" class="section" style="display: none;">
          <div class="section-header">
            <h2 class="section-title">Historial de Pedidos</h2>
          </div>
          <div id="historialContent">
            ${renderizarTablaPedidosCompletados(pedidosCompletados)}
          </div>
        </div>
      </div>
    </div>
  `;
}

