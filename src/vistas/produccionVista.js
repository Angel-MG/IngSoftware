import { renderizarTablaPedidosProduccion } from './componentes/tablaPedidosProduccion.js';
import { renderizarModalDetallesPedido } from './componentes/modalDetallesPedido.js';

export function renderizarVistaProduccion(pedidos = [], productos = []) {
  const ingredientes = productos.filter(p => p.tipo === 'ingrediente');
  const productosTerminados = productos.filter(p => p.tipo === 'terminado');

  return `
    <div class="app-layout">
      <nav class="nav-menu">
        <div class="nav-container">
          <div class="nav-brand">Pastelería El Ángel</div>
          <div class="nav-links">
            <a href="#" class="nav-link active" data-section="pedidos">Pedidos</a>
            <a href="#" class="nav-link" data-section="inventario">Inventario</a>
          </div>
          <div class="nav-actions">
            <button id="logoutBtn" class="logout-btn">
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </nav>

      <div class="main-content">
        <!-- Sección de Pedidos -->
        <div id="pedidosSection" class="section">
          <div class="section-header">
            <h2 class="section-title">Pedidos Actuales</h2>
          </div>
          <div class="table-container">
            ${renderizarTablaPedidosProduccion(pedidos)}
          </div>
        </div>

        <!-- Sección de Inventario -->
        <div id="inventarioSection" class="section" style="display: none;">
          <div class="section-header">
            <h2 class="section-title">Inventario</h2>
            <button id="newProductBtn" class="primary-btn">Nuevo Producto</button>
          </div>
          <div class="table-container">
            <h3 class="section-subtitle">Ingredientes</h3>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Unidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${ingredientes.map(producto => `
                  <tr>
                    <td>${producto.nombre}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.unidad}</td>
                    <td>
                      <button class="edit-btn" data-id="${producto.id}" data-type="product">Editar</button>
                      <button class="delete-btn" data-id="${producto.id}" data-type="product">Eliminar</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <h3 class="section-subtitle">Productos Terminados</h3>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Unidad</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${productosTerminados.map(producto => `
                  <tr>
                    <td>${producto.nombre}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.unidad}</td>
                    <td>$${producto.precio.toFixed(2)}</td>
                    <td>
                      <button class="edit-btn" data-id="${producto.id}" data-type="product">Editar</button>
                      <button class="delete-btn" data-id="${producto.id}" data-type="product">Eliminar</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        ${renderizarModalDetallesPedido()}
      </div>
    </div>
  `;
}