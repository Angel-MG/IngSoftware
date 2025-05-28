import { ControladorPedido } from '../controladores/pedidoControlador.js';
import { formatearFecha } from './formatoFecha.js';
import { traducirEstado } from './traduccionEstados.js';

export async function mostrarDetallesPedido(pedidoId) {
  const modal = document.getElementById('orderDetailsModal');
  const modalBody = modal?.querySelector('.modal-body');
  
  try {
    const resultado = await ControladorPedido.obtenerTodosPedidos();
    if (!resultado.exito) {
      throw new Error(resultado.mensaje);
    }

    const pedido = resultado.datos.find(p => p.id === pedidoId);
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }

    if (modal && modalBody) {
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

      // Configurar cierre del modal
      const closeBtn = modal.querySelector('.close-modal');
      const handleClose = () => {
        modal.style.display = 'none';
        closeBtn.removeEventListener('click', handleClose);
      };
      closeBtn.addEventListener('click', handleClose);

      // Cerrar al hacer click fuera del modal
      const handleOutsideClick = (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
          modal.removeEventListener('click', handleOutsideClick);
        }
      };
      modal.addEventListener('click', handleOutsideClick);
    }
  } catch (error) {
    console.error('Error al mostrar detalles del pedido:', error);
    alert('Error al cargar los detalles del pedido');
  }
}