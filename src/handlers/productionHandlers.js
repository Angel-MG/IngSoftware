import { ControladorPedido } from '../controladores/pedidoControlador.js';
import { ControladorProducto } from '../controladores/productoControlador.js';
import { mostrarModalConfirmacionEliminar } from '../utilidades/modalUtilidades.js';
import { formatearFecha } from '../utilidades/formatoFecha.js';
import { traducirEstado } from '../utilidades/traduccionEstados.js';

let seccionActual = 'pedidos';

export function configurarManejadoresProduccion(callbacks) {
  configurarNavegacionSecciones();
  configurarManejadoresPedidos(callbacks);
  configurarManejadoresProductos(callbacks);
  configurarVisualizacionDetalles();
  mostrarSeccion(seccionActual);
}

function mostrarSeccion(seccion) {
  const enlaces = document.querySelectorAll('.nav-link');
  const secciones = {
    pedidos: document.getElementById('pedidosSection'),
    inventario: document.getElementById('inventarioSection')
  };

  // Update active link
  enlaces.forEach(e => {
    if (e.dataset.section === seccion) {
      e.classList.add('active');
    } else {
      e.classList.remove('active');
    }
  });

  // Show correct section
  Object.keys(secciones).forEach(key => {
    if (secciones[key]) {
      secciones[key].style.display = key === seccion ? 'block' : 'none';
    }
  });

  seccionActual = seccion;
}

function configurarNavegacionSecciones() {
  const enlaces = document.querySelectorAll('.nav-link');
  enlaces.forEach(enlace => {
    enlace.addEventListener('click', (e) => {
      e.preventDefault();
      const seccion = enlace.dataset.section;
      if (seccion) {
        mostrarSeccion(seccion);
      }
    });
  });
}

async function mostrarFormularioConsumo(pedidoId, productos, callbacks) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.display = 'flex';
  
  // Filtrar solo ingredientes
  const ingredientes = productos.datos.filter(p => p.tipo === 'ingrediente');
  
  modal.innerHTML = `
    <div class="modal-content">
      <h3>Registrar Consumo de Ingredientes</h3>
      <form id="consumptionForm">
        <div class="ingredients-list">
          ${ingredientes.map(producto => `
            <div class="form-group">
              <label for="ingredient_${producto.id}">
                ${producto.nombre} (${producto.unidad}) - Disponible: ${producto.cantidad}
              </label>
              <input 
                type="number" 
                id="ingredient_${producto.id}" 
                min="0" 
                max="${producto.cantidad}"
                step="0.01"
                placeholder="Cantidad consumida"
              >
            </div>
          `).join('')}
        </div>
        <div class="form-actions">
          <button type="submit">Confirmar y Marcar como Listo</button>
          <button type="button" id="cancelConsumptionBtn">Cancelar</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const form = document.getElementById('consumptionForm');
  const cancelBtn = document.getElementById('cancelConsumptionBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Recopilar consumos
    const consumos = [];
    ingredientes.forEach(producto => {
      const cantidad = document.getElementById(`ingredient_${producto.id}`).value;
      if (cantidad && cantidad > 0) {
        consumos.push({
          id: producto.id,
          cantidad: parseFloat(cantidad)
        });
      }
    });

    try {
      // Actualizar inventario
      for (const consumo of consumos) {
        const producto = productos.datos.find(p => p.id === consumo.id);
        if (producto) {
          const nuevaCantidad = producto.cantidad - consumo.cantidad;
          if (nuevaCantidad < 0) {
            alert(`No hay suficiente cantidad de ${producto.nombre}`);
            return;
          }
          await ControladorProducto.actualizarProducto(consumo.id, {
            ...producto,
            cantidad: nuevaCantidad
          });
        }
      }

      // Actualizar estado del pedido
      const resultado = await ControladorPedido.actualizarEstadoPedido(pedidoId, 'ready_for_decoration');
      if (resultado.exito) {
        modal.remove();
        if (callbacks.onStatusUpdate) {
          await callbacks.onStatusUpdate();
        }
        mostrarSeccion(seccionActual);
      } else {
        alert('Error al actualizar el estado del pedido: ' + resultado.mensaje);
      }
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      alert('Error al procesar el pedido');
    }
  });

  cancelBtn.addEventListener('click', () => {
    modal.remove();
  });
}

function configurarManejadoresPedidos(callbacks) {
  document.querySelectorAll('.ready-for-decoration-btn').forEach(boton => {
    boton.addEventListener('click', async () => {
      const pedidoId = boton.dataset.id;
      const productos = await ControladorProducto.obtenerTodosProductos();
      if (productos.exito) {
        await mostrarFormularioConsumo(pedidoId, productos, callbacks);
      } else {
        alert('Error al cargar productos: ' + productos.mensaje);
      }
    });
  });
}

function configurarManejadoresProductos(callbacks) {
  // Nuevo Producto
  const botonNuevoProducto = document.getElementById('newProductBtn');
  if (botonNuevoProducto) {
    botonNuevoProducto.addEventListener('click', () => {
      const modalProducto = document.createElement('div');
      modalProducto.id = 'productModal';
      modalProducto.className = 'modal';
      modalProducto.style.display = 'flex';
      
      modalProducto.innerHTML = `
        <div class="modal-content">
          <h3>Agregar Nuevo Producto</h3>
          <form id="productForm">
            <div class="form-group">
              <label for="productName">Nombre del Producto:</label>
              <input type="text" id="productName" required>
            </div>
            <div class="form-group">
              <label for="productType">Tipo de Producto:</label>
              <select id="productType" required>
                <option value="ingrediente">Ingrediente</option>
                <option value="terminado">Producto Terminado</option>
              </select>
            </div>
            <div class="form-group">
              <label for="productQuantity">Cantidad:</label>
              <input type="number" id="productQuantity" min="0" required>
            </div>
            <div class="form-group">
              <label for="productUnit">Unidad:</label>
              <select id="productUnit" required>
                <option value="pieza">Pieza</option>
                <option value="kg">Kilogramo</option>
                <option value="g">Gramo</option>
                <option value="litro">Litro</option>
                <option value="ml">Mililitro</option>
              </select>
            </div>
            <div class="form-group">
              <label for="productPrice">Precio:</label>
              <input type="number" id="productPrice" min="0" step="0.01" required>
            </div>
            <div class="form-actions">
              <button type="submit">Guardar</button>
              <button type="button" id="cancelProductBtn">Cancelar</button>
            </div>
          </form>
        </div>
      `;

      document.body.appendChild(modalProducto);
      
      const formularioProducto = document.getElementById('productForm');
      const botonCancelar = document.getElementById('cancelProductBtn');

      const handleSubmit = async (e) => {
        e.preventDefault();
        const datosProducto = {
          nombre: document.getElementById('productName').value,
          cantidad: parseFloat(document.getElementById('productQuantity').value),
          unidad: document.getElementById('productUnit').value,
          precio: parseFloat(document.getElementById('productPrice').value),
          tipo: document.getElementById('productType').value
        };

        try {
          const resultado = await ControladorProducto.crearProducto(datosProducto);
          if (resultado.exito) {
            modalProducto.remove();
            formularioProducto.removeEventListener('submit', handleSubmit);
            if (callbacks.onStatusUpdate) {
              await callbacks.onStatusUpdate();
            }
            mostrarSeccion(seccionActual);
          } else {
            alert('Error al crear producto: ' + resultado.mensaje);
          }
        } catch (error) {
          console.error('Error al crear producto:', error);
          alert('Error al crear producto');
        }
      };

      formularioProducto.addEventListener('submit', handleSubmit);

      botonCancelar.addEventListener('click', () => {
        modalProducto.remove();
        formularioProducto.removeEventListener('submit', handleSubmit);
      });
    });
  }

  // Editar Producto
  document.querySelectorAll('.edit-btn[data-type="product"]').forEach(boton => {
    boton.addEventListener('click', async () => {
      const productId = boton.dataset.id;
      try {
        const productos = await ControladorProducto.obtenerTodosProductos();
        const producto = productos.datos.find(p => p.id === productId);
        
        if (producto) {
          const modalProducto = document.createElement('div');
          modalProducto.id = 'productModal';
          modalProducto.className = 'modal';
          modalProducto.style.display = 'flex';
          
          modalProducto.innerHTML = `
            <div class="modal-content">
              <h3>Editar Producto</h3>
              <form id="productForm">
                <div class="form-group">
                  <label for="productName">Nombre del Producto:</label>
                  <input type="text" id="productName" value="${producto.nombre}" required>
                </div>
                <div class="form-group">
                  <label for="productType">Tipo de Producto:</label>
                  <select id="productType" required>
                    <option value="ingrediente" ${producto.tipo === 'ingrediente' ? 'selected' : ''}>Ingrediente</option>
                    <option value="terminado" ${producto.tipo === 'terminado' ? 'selected' : ''}>Producto Terminado</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="productQuantity">Cantidad:</label>
                  <input type="number" id="productQuantity" value="${producto.cantidad}" min="0" required>
                </div>
                <div class="form-group">
                  <label for="productUnit">Unidad:</label>
                  <select id="productUnit" required>
                    <option value="pieza" ${producto.unidad === 'pieza' ? 'selected' : ''}>Pieza</option>
                    <option value="kg" ${producto.unidad === 'kg' ? 'selected' : ''}>Kilogramo</option>
                    <option value="g" ${producto.unidad === 'g' ? 'selected' : ''}>Gramo</option>
                    <option value="litro" ${producto.unidad === 'litro' ? 'selected' : ''}>Litro</option>
                    <option value="ml" ${producto.unidad === 'ml' ? 'selected' : ''}>Mililitro</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="productPrice">Precio:</label>
                  <input type="number" id="productPrice" value="${producto.precio}" min="0" step="0.01" required>
                </div>
                <div class="form-actions">
                  <button type="submit">Guardar Cambios</button>
                  <button type="button" id="cancelProductBtn">Cancelar</button>
                </div>
              </form>
            </div>
          `;

          document.body.appendChild(modalProducto);
          
          const formularioProducto = document.getElementById('productForm');
          const botonCancelar = document.getElementById('cancelProductBtn');

          const handleSubmit = async (e) => {
            e.preventDefault();
            const datosProducto = {
              nombre: document.getElementById('productName').value,
              cantidad: parseFloat(document.getElementById('productQuantity').value),
              unidad: document.getElementById('productUnit').value,
              precio: parseFloat(document.getElementById('productPrice').value),
              tipo: document.getElementById('productType').value
            };

            try {
              const resultado = await ControladorProducto.actualizarProducto(productId, datosProducto);
              if (resultado.exito) {
                modalProducto.remove();
                formularioProducto.removeEventListener('submit', handleSubmit);
                if (callbacks.onStatusUpdate) {
                  await callbacks.onStatusUpdate();
                }
                mostrarSeccion(seccionActual);
              } else {
                alert('Error al actualizar producto: ' + resultado.mensaje);
              }
            } catch (error) {
              console.error('Error al actualizar producto:', error);
              alert('Error al actualizar producto');
            }
          };

          formularioProducto.addEventListener('submit', handleSubmit);

          botonCancelar.addEventListener('click', () => {
            modalProducto.remove();
            formularioProducto.removeEventListener('submit', handleSubmit);
          });
        }
      } catch (error) {
        console.error('Error al cargar producto:', error);
        alert('Error al cargar producto');
      }
    });
  });

  // Eliminar Producto
  document.querySelectorAll('.delete-btn[data-type="product"]').forEach(boton => {
    boton.addEventListener('click', async () => {
      const productId = boton.dataset.id;
      const confirmar = await mostrarModalConfirmacionEliminar(
        'producto',
        '¿Está seguro de que desea eliminar este producto?'
      );
      
      if (confirmar) {
        try {
          const resultado = await ControladorProducto.eliminarProducto(productId);
          if (resultado.exito) {
            if (callbacks.onStatusUpdate) {
              await callbacks.onStatusUpdate();
            }
            mostrarSeccion(seccionActual);
          } else {
            alert('Error al eliminar producto: ' + resultado.mensaje);
          }
        } catch (error) {
          console.error('Error al eliminar producto:', error);
          alert('Error al eliminar producto');
        }
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