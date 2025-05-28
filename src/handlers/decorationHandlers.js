import { ControladorPedido } from '../controladores/pedidoControlador.js';
import { formatearFecha } from '../utilidades/formatoFecha.js';
import { traducirEstado } from '../utilidades/traduccionEstados.js';

export function configurarManejadoresDecoracion(callbacks) {
  configurarFinalizacionPedidos(callbacks);
  configurarVisualizacionDetalles();
}

function configurarFinalizacionPedidos(callbacks) {
  document.querySelectorAll('.finish-order-btn').forEach(boton => {
    boton.addEventListener('click', async (e) => {
      e.stopPropagation(); // Evitar que el click se propague a la fila
      const pedidoId = boton.dataset.id;
      const resultado = await ControladorPedido.actualizarEstadoPedido(pedidoId, 'completed');
      if (resultado.exito) {
        callbacks.onStatusUpdate();
      } else {
        alert('Error al finalizar el pedido: ' + resultado.mensaje);
      }
    });
  });
}

async function mostrarDetallesPedido(pedidoId) {
  const modal = document.getElementById('orderDetailsModal');
  const modalBody = modal?.querySelector('.modal-body');
  
  const pedidos = await ControladorPedido.obtenerTodosPedidos();
  const pedido = pedidos.datos.find(p => p.id === pedidoId);

  if (pedido && modal && modalBody) {
    modalBody.innerHTML = `
      <div class="order-details-content">
        <div class="detail-section">
          <h4>Información del Cliente</h4>
          <p><strong>Nombre:</strong> ${pedido.nombreCliente}</p>
          <p><strong>Fecha de Entrega:</strong> ${formatearFecha(pedido.fechaEntrega)}</p>
          <p><strong>Estado:</strong> ${traducirEstado(pedido.estado)}</p>
        </div>

        <div class="detail-section">
          <h4>Productos</h4>
          <div class="products-grid">
            ${pedido.productos.map(producto => `
              <div class="product-card">
                <h5>${producto.nombre}</h5>
                <p>Cantidad: ${producto.cantidad}</p>
                <p>Precio: $${producto.precio.toFixed(2)}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="detail-section">
          <h4>Instrucciones Especiales</h4>
          <div class="special-instructions">
            ${pedido.instruccionesEspeciales || 'No hay instrucciones especiales'}
          </div>
        </div>

        <div class="detail-section">
          <h4>Resumen</h4>
          <p><strong>Total del Pedido:</strong> $${pedido.total.toFixed(2)}</p>
          <p><strong>Fecha de Creación:</strong> ${formatearFecha(pedido.fechaCreacion)}</p>
        </div>
      </div>
    `;
    modal.style.display = 'flex';
  }
}

function configurarVisualizacionDetalles() {
  const modal = document.getElementById('orderDetailsModal');
  
  // Configurar cierre del modal
  modal?.querySelector('.close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Cerrar modal al hacer click fuera
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Configurar click en las filas
  document.querySelectorAll('.pedido-row').forEach(fila => {
    fila.addEventListener('click', () => {
      const pedidoId = fila.dataset.id;
      mostrarDetallesPedido(pedidoId);
    });
  });
}