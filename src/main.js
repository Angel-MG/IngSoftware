import './style.css';

// Vistas
import { renderizarFormularioInicioSesion } from './vistas/inicioSesionVista.js';
import { renderizarVistaVentas } from './vistas/ventasVista.js';
import { renderizarVistaProduccion } from './vistas/produccionVista.js';
import { renderizarVistaDecoracion } from './vistas/decoracionVista.js';
import { renderizarVistaAdmin } from './vistas/adminVista.js';

// Manejadores
import { configurarManejadoresInicioSesion } from './handlers/authHandlers.js';
import { configurarManejadoresNavegacion } from './handlers/navigationHandlers.js';
import { configurarManejadoresVentas } from './handlers/orderHandlers.js';
import { configurarManejadoresProduccion } from './handlers/productionHandlers.js';
import { configurarManejadoresDecoracion } from './handlers/decorationHandlers.js';
import { configurarManejadoresAdmin } from './handlers/adminHandlers.js';

// Controladores
import { ControladorPedido } from './controladores/pedidoControlador.js';
import { ControladorProducto } from './controladores/productoControlador.js';
import { ControladorUsuario } from './controladores/usuarioControlador.js';

// Firebase
import { db } from './config/firebase.js';
import { collection, onSnapshot, query } from 'firebase/firestore';

// Inicializadores
import { inicializarVistaVentas } from './inicializadores/inicializadorVentas.js';

// Estado global de la aplicación
let usuarioActual = null;
let vistaActual = 'login';
let unsubscribePedidos = null;

// Función para configurar escucha en tiempo real
function configurarEscuchaPedidos() {
  if (unsubscribePedidos) {
    unsubscribePedidos();
  }

  const pedidosQuery = query(collection(db, 'pedidos'));
  unsubscribePedidos = onSnapshot(pedidosQuery, (snapshot) => {
    if (usuarioActual && vistaActual !== 'login') {
      renderizarVistaActual();
    }
  });
}

// Función principal de inicialización
async function inicializarApp() {
  try {
    const app = document.querySelector('#app');
    
    if (!usuarioActual) {
      if (unsubscribePedidos) {
        unsubscribePedidos();
        unsubscribePedidos = null;
      }
      app.innerHTML = renderizarFormularioInicioSesion();
      configurarManejadoresInicioSesion({
        onLoginSuccess: (usuario) => {
          usuarioActual = usuario;
          vistaActual = usuario.obtenerVistaDefecto();
          configurarEscuchaPedidos();
          inicializarApp();
        }
      });
    } else {
      await renderizarVistaActual();
      configurarManejadoresNavegacion(usuarioActual, {
        onNavigate: (nuevaVista) => {
          vistaActual = nuevaVista;
          renderizarVistaActual();
        },
        onLogout: () => {
          if (unsubscribePedidos) {
            unsubscribePedidos();
            unsubscribePedidos = null;
          }
          usuarioActual = null;
          vistaActual = 'login';
          inicializarApp();
        }
      });
    }
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error);
    document.querySelector('#app').innerHTML = `
      <div class="error-container">
        <h2>Error de Inicialización</h2>
        <p>Ha ocurrido un error al inicializar la aplicación. Por favor, intente nuevamente.</p>
        <button onclick="window.location.reload()">Recargar página</button>
      </div>
    `;
  }
}

async function renderizarVistaActual() {
  const app = document.querySelector('#app');
  
  if (!usuarioActual.puedeAccederVista(vistaActual)) {
    vistaActual = usuarioActual.obtenerVistaDefecto();
  }

  const callbacks = {
    onStatusUpdate: () => renderizarVistaActual(),
    onEdit: () => renderizarVistaActual(),
    onDelete: () => renderizarVistaActual()
  };

  try {
    switch(vistaActual) {
      case 'admin':
        const usuarios = await ControladorUsuario.obtenerTodos();
        const productosAdmin = await ControladorProducto.obtenerTodosProductos();
        app.innerHTML = renderizarVistaAdmin(usuarios.datos, productosAdmin.datos);
        configurarManejadoresAdmin(callbacks);
        break;

      case 'ventas':
        const pedidos = await ControladorPedido.obtenerTodosPedidos();
        app.innerHTML = renderizarVistaVentas(pedidos.datos);
        configurarManejadoresVentas(callbacks);
        inicializarVistaVentas(pedidos.datos, callbacks);
        break;

      case 'produccion':
        const pedidosProduccion = await ControladorPedido.obtenerTodosPedidos();
        const productosProduccion = await ControladorProducto.obtenerTodosProductos();
        app.innerHTML = renderizarVistaProduccion(pedidosProduccion.datos, productosProduccion.datos);
        configurarManejadoresProduccion(callbacks);
        break;

      case 'decoracion':
        const pedidosDecoracion = await ControladorPedido.obtenerTodosPedidos();
        app.innerHTML = renderizarVistaDecoracion(pedidosDecoracion.datos);
        configurarManejadoresDecoracion(callbacks);
        break;

      default:
        app.innerHTML = renderizarFormularioInicioSesion();
        configurarManejadoresInicioSesion({
          onLoginSuccess: (usuario) => {
            usuarioActual = usuario;
            vistaActual = usuario.obtenerVistaDefecto();
            configurarEscuchaPedidos();
            inicializarApp();
          }
        });
    }
  } catch (error) {
    console.error('Error al renderizar la vista:', error);
    app.innerHTML = `
      <div class="error-container">
        <h2>Error</h2>
        <p>Ha ocurrido un error al cargar la vista. Por favor, intente nuevamente.</p>
        <button onclick="window.location.reload()">Recargar página</button>
      </div>
    `;
  }
}

// Iniciar la aplicación
inicializarApp();