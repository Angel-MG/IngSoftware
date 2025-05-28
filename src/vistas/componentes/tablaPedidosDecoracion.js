import { traducirEstado } from '../../utilidades/traduccionEstados.js';
import { formatearFecha } from '../../utilidades/formatoFecha.js';

export function renderizarTablaPedidosDecoracion(pedidos) {
  return `
    <table id="decorationTable">
      <thead>
        <tr>
          <th>ID Pedido</th>
          <th>Cliente</th>
          <th>Productos</th>
          <th>Fecha de Entrega</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${pedidos.map(pedido => `
          <tr class="pedido-row clickable" data-id="${pedido.id}">
            <td>${pedido.id}</td>
            <td>${pedido.nombreCliente}</td>
            <td>
              <ul class="product-list">
                ${pedido.productos.map(producto => `
                  <li>${producto.cantidad}x ${producto.nombre}</li>
                `).join('')}
              </ul>
            </td>
            <td>${formatearFecha(pedido.fechaEntrega)}</td>
            <td>
              <span class="status-tag status-${pedido.estado}">
                ${traducirEstado(pedido.estado)}
              </span>
            </td>
            <td>
              ${pedido.estado === 'ready_for_decoration' ? `
                <button class="finish-order-btn" data-id="${pedido.id}">
                  Finalizar Pedido
                </button>
              ` : ''}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}