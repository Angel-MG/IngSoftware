import { traducirEstado } from '../../utilidades/traduccionEstados.js';
import { formatearFecha } from '../../utilidades/formatoFecha.js';

export function renderizarTablaPedidosProduccion(pedidos) {
  const pedidosPendientes = pedidos.filter(p => p.estado === 'pending');
  
  return `
    <table id="productionTable">
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
        ${pedidosPendientes.map(pedido => `
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
              ${pedido.estado === 'pending' ? `
                <button class="ready-for-decoration-btn" data-id="${pedido.id}">
                  Listo para Decorar
                </button>
              ` : '-'}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}