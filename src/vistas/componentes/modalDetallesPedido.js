export function renderizarModalDetallesPedido() {
  return `
    <div id="orderDetailsModal" class="modal" style="display: none;">
      <div class="modal-content order-details">
        <div class="modal-header">
          <h3>Detalles del Pedido</h3>
          <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <!-- El contenido se llenará dinámicamente -->
        </div>
      </div>
    </div>
  `;
}