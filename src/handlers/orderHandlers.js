import { ControladorPedido } from '../controladores/pedidoControlador.js';
import { ControladorProducto } from '../controladores/productoControlador.js';
import { mostrarModalConfirmacionEliminar } from '../utilidades/modalUtilidades.js';
import { validarNombreCliente } from '../utilidades/validacionPedido.js';

export function configurarManejadoresVentas(callbacks) {
  configurarNuevoPedido(callbacks);
  configurarEdicionPedidos(callbacks);
  configurarEliminacionPedidos(callbacks);
}

async function mostrarFormularioPedido(productos, pedidoExistente = null) {
  const productosTerminados = productos.datos.filter(p => p.tipo === 'terminado');
  const titulo = pedidoExistente ? 'Editar Pedido' : 'Crear Nuevo Pedido';
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.display = 'flex';
  
  modal.innerHTML = `
    <div class="modal-content">
      <h3>${titulo}</h3>
      <form id="orderForm" class="order-form">
        <div class="form-group">
          <label for="customerName">Nombre del Cliente:</label>
          <input type="text" id="customerName" required value="${pedidoExistente?.nombreCliente || ''}">
          <span class="error-message" id="customerName-error"></span>
        </div>
        
        <div class="order-products">
          <h4>Productos</h4>
          <div id="productsList">
            ${pedidoExistente ? pedidoExistente.productos.map(prod => `
              <div class="product-item">
                <select class="product-select" required>
                  <option value="">Seleccionar producto</option>
                  ${productosTerminados.map(p => `
                    <option value="${p.id}" data-precio="${p.precio}" 
                      ${p.id === prod.id ? 'selected' : ''}>
                      ${p.nombre} - $${p.precio}
                    </option>
                  `).join('')}
                </select>
                <input type="number" class="product-quantity" min="1" value="${prod.cantidad}" required>
                <button type="button" class="remove-product">Eliminar</button>
              </div>
            `).join('') : `
              <div class="product-item">
                <select class="product-select" required>
                  <option value="">Seleccionar producto</option>
                  ${productosTerminados.map(p => `
                    <option value="${p.id}" data-precio="${p.precio}">
                      ${p.nombre} - $${p.precio}
                    </option>
                  `).join('')}
                </select>
                <input type="number" class="product-quantity" min="1" value="1" required>
                <button type="button" class="remove-product">Eliminar</button>
              </div>
            `}
          </div>
          <button type="button" id="addProductBtn" class="add-product-btn">Agregar Producto</button>
          <div class="order-total">Total: $<span id="orderTotal">0.00</span></div>
        </div>

        <div class="form-group">
          <label for="deliveryDate">Fecha de Entrega:</label>
          <input type="date" id="deliveryDate" required value="${pedidoExistente?.fechaEntrega || ''}">
        </div>
        
        <div class="form-group">
          <label for="specialInstructions">Instrucciones Especiales:</label>
          <textarea id="specialInstructions" rows="3">${pedidoExistente?.instruccionesEspeciales || ''}</textarea>
        </div>

        <div class="form-actions">
          <button type="submit">${pedidoExistente ? 'Guardar Cambios' : 'Crear Pedido'}</button>
          <button type="button" id="cancelOrderBtn">Cancelar</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const formularioPedido = document.getElementById('orderForm');
  const botonCancelar = document.getElementById('cancelOrderBtn');
  const botonAgregarProducto = document.getElementById('addProductBtn');
  const listaProductos = document.getElementById('productsList');
  const inputNombreCliente = document.getElementById('customerName');
  const errorNombreCliente = document.getElementById('customerName-error');

  // Limpiar mensaje de error cuando el usuario comience a escribir
  inputNombreCliente.addEventListener('input', () => {
    errorNombreCliente.style.display = 'none';
    inputNombreCliente.classList.remove('error');
  });

  function actualizarTotal() {
    let total = 0;
    document.querySelectorAll('.product-item').forEach(item => {
      const select = item.querySelector('.product-select');
      const quantity = item.querySelector('.product-quantity');
      const option = select.selectedOptions[0];
      if (option && option.dataset.precio) {
        total += parseFloat(option.dataset.precio) * parseInt(quantity.value || 0);
      }
    });
    document.getElementById('orderTotal').textContent = total.toFixed(2);
  }

  function agregarProductoAlFormulario() {
    const nuevoProducto = document.createElement('div');
    nuevoProducto.className = 'product-item';
    nuevoProducto.innerHTML = `
      <select class="product-select" required>
        <option value="">Seleccionar producto</option>
        ${productosTerminados.map(p => `
          <option value="${p.id}" data-precio="${p.precio}">${p.nombre} - $${p.precio}</option>
        `).join('')}
      </select>
      <input type="number" class="product-quantity" min="1" value="1" required>
      <button type="button" class="remove-product">Eliminar</button>
    `;
    
    listaProductos.appendChild(nuevoProducto);
    
    const removeBtn = nuevoProducto.querySelector('.remove-product');
    const select = nuevoProducto.querySelector('.product-select');
    const quantity = nuevoProducto.querySelector('.product-quantity');
    
    removeBtn.addEventListener('click', () => {
      if (document.querySelectorAll('.product-item').length > 1) {
        nuevoProducto.remove();
        actualizarTotal();
      }
    });
    
    select.addEventListener('change', actualizarTotal);
    quantity.addEventListener('input', actualizarTotal);
  }

  document.querySelectorAll('.product-item').forEach(item => {
    const removeBtn = item.querySelector('.remove-product');
    const select = item.querySelector('.product-select');
    const quantity = item.querySelector('.product-quantity');

    removeBtn.addEventListener('click', () => {
      if (document.querySelectorAll('.product-item').length > 1) {
        item.remove();
        actualizarTotal();
      }
    });

    select.addEventListener('change', actualizarTotal);
    quantity.addEventListener('input', actualizarTotal);
  });

  botonAgregarProducto.addEventListener('click', agregarProductoAlFormulario);
  actualizarTotal();

  return new Promise((resolve) => {
    formularioPedido.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nombreCliente = inputNombreCliente.value;
      const validacion = validarNombreCliente(nombreCliente);

      if (!validacion.esValido) {
        errorNombreCliente.textContent = validacion.mensaje;
        errorNombreCliente.style.display = 'block';
        inputNombreCliente.classList.add('error');
        return;
      }

      const productosSeleccionados = [];
      document.querySelectorAll('.product-item').forEach(item => {
        const select = item.querySelector('.product-select');
        const quantity = item.querySelector('.product-quantity');
        const option = select.selectedOptions[0];
        
        if (select.value && option) {
          productosSeleccionados.push({
            id: parseInt(select.value),
            nombre: option.text.split(' - ')[0],
            cantidad: parseInt(quantity.value),
            precio: parseFloat(option.dataset.precio)
          });
        }
      });

      const datosPedido = {
        nombreCliente,
        productos: productosSeleccionados,
        fechaEntrega: document.getElementById('deliveryDate').value,
        instruccionesEspeciales: document.getElementById('specialInstructions').value,
        estado: pedidoExistente?.estado || 'pending',
        total: parseFloat(document.getElementById('orderTotal').textContent)
      };

      modal.remove();
      resolve(datosPedido);
    });

    botonCancelar.addEventListener('click', () => {
      modal.remove();
      resolve(null);
    });
  });
}

function configurarNuevoPedido(callbacks) {
  const botonNuevoPedido = document.getElementById('newOrderBtn');
  if (botonNuevoPedido) {
    botonNuevoPedido.addEventListener('click', async () => {
      try {
        const productos = await ControladorProducto.obtenerTodosProductos();
        if (!productos.exito) {
          alert('Error al cargar productos');
          return;
        }

        const datosPedido = await mostrarFormularioPedido(productos);
        if (datosPedido) {
          const resultado = await ControladorPedido.crearPedido(datosPedido);
          if (resultado.exito) {
            if (callbacks.onStatusUpdate) {
              await callbacks.onStatusUpdate();
            }
          } else {
            alert('Error al crear pedido: ' + resultado.mensaje);
          }
        }
      } catch (error) {
        console.error('Error al crear pedido:', error);
        alert('Error al crear pedido');
      }
    });
  }
}

function configurarEdicionPedidos(callbacks) {
  document.querySelectorAll('.edit-btn').forEach(boton => {
    boton.addEventListener('click', async () => {
      try {
        const pedidoId = boton.dataset.id;
        const pedidos = await ControladorPedido.obtenerTodosPedidos();
        const productos = await ControladorProducto.obtenerTodosProductos();
        
        if (!pedidos.exito || !productos.exito) {
          alert('Error al cargar datos');
          return;
        }

        const pedido = pedidos.datos.find(p => p.id === pedidoId);
        if (!pedido) {
          alert('Pedido no encontrado');
          return;
        }

        const datosPedido = await mostrarFormularioPedido(productos, pedido);
        if (datosPedido) {
          const resultado = await ControladorPedido.actualizarPedido(pedidoId, datosPedido);
          if (resultado.exito) {
            if (callbacks.onStatusUpdate) {
              await callbacks.onStatusUpdate();
            }
          } else {
            alert('Error al actualizar pedido: ' + resultado.mensaje);
          }
        }
      } catch (error) {
        console.error('Error al editar pedido:', error);
        alert('Error al editar pedido');
      }
    });
  });
}

function configurarEliminacionPedidos(callbacks) {
  document.querySelectorAll('.delete-btn').forEach(boton => {
    boton.addEventListener('click', async () => {
      const pedidoId = boton.dataset.id;
      const confirmar = await mostrarModalConfirmacionEliminar(
        'pedido',
        '¿Está seguro de que desea eliminar este pedido?'
      );
      
      if (confirmar) {
        try {
          const resultado = await ControladorPedido.eliminarPedido(pedidoId);
          if (resultado.exito) {
            if (callbacks.onStatusUpdate) {
              await callbacks.onStatusUpdate();
            }
          } else {
            alert('Error al eliminar el pedido: ' + resultado.mensaje);
          }
        } catch (error) {
          console.error('Error al eliminar pedido:', error);
          alert('Error al eliminar pedido');
        }
      }
    });
  });
}