import { traducirEstado } from '../../utilidades/traduccionEstados.js';

export function renderizarTablaPedidosActivos(pedidos) {
  return `
    <table id="ordersTable">
      <thead>
        <tr>
          <th>ID Pedido</th>
          <th>Cliente</th>
          <th>Productos</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Fecha Entrega</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${pedidos.map(pedido => `
          <tr>
            <td>${pedido.id}</td>
            <td>${pedido.nombreCliente}</td>
            <td>
              <ul class="product-list">
                ${pedido.productos.map(producto => `
                  <li>${producto.cantidad}x ${producto.nombre}</li>
                `).join('')}
              </ul>
            </td>
            <td>$${pedido.total.toFixed(2)}</td>
            <td>
              <span class="status-tag status-${pedido.estado}">
                ${traducirEstado(pedido.estado)}
              </span>
            </td>
            <td>${pedido.fechaEntrega}</td>
            <td>
              <button class="edit-btn" data-id="${pedido.id}">Editar</button>
              <button class="delete-btn" data-id="${pedido.id}">Eliminar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}