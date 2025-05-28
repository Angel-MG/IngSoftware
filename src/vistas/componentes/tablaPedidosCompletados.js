import { traducirEstado } from '../../utilidades/traduccionEstados.js';
import { formatearFecha } from '../../utilidades/formatoFecha.js';
import { renderizarFiltrosHistorial } from './filtrosHistorial.js';

export function renderizarTablaPedidosCompletados(pedidos) {
  return `
    ${renderizarFiltrosHistorial()}
    <div class="table-container">
      <table id="historyTable">
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Cliente</th>
            <th>Productos</th>
            <th>Total</th>
            <th>Fecha Entrega</th>
            <th>Fecha Completado</th>
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
              <td>${pedido.fechaEntrega}</td>
              <td>${formatearFecha(pedido.fechaCreacion)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}