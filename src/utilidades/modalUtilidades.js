export function mostrarModalConfirmacionEliminar(tipoElemento, mensaje) {
  const modalExistente = document.getElementById('modalConfirmacionEliminar');
  if (modalExistente) {
    modalExistente.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'modalConfirmacionEliminar';
  modal.className = 'modal';
  modal.style.display = 'flex';
  
  modal.innerHTML = `
    <div class="modal-content">
      <h3>Confirmar Eliminación</h3>
      <p>${mensaje}</p>
      <div class="form-actions">
        <button id="botonConfirmar" class="delete-btn">Eliminar</button>
        <button id="botonCancelar">Cancelar</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);

  return new Promise((resolve) => {
    const botonConfirmar = document.getElementById('botonConfirmar');
    const botonCancelar = document.getElementById('botonCancelar');
    
    const limpiar = () => {
      botonConfirmar.removeEventListener('click', manejarConfirmacion);
      botonCancelar.removeEventListener('click', manejarCancelacion);
      modal.remove();
    };

    const manejarConfirmacion = () => {
      limpiar();
      resolve(true);
    };

    const manejarCancelacion = () => {
      limpiar();
      resolve(false);
    };

    botonConfirmar.addEventListener('click', manejarConfirmacion);
    botonCancelar.addEventListener('click', manejarCancelacion);
  });
}