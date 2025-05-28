import { configurarManejadoresUsuarios } from './userHandlers.js';
import { ControladorProducto } from '../controladores/productoControlador.js';
import { mostrarModalConfirmacionEliminar } from '../utilidades/modalUtilidades.js';
import { ControladorReporte } from '../controladores/reporteControlador.js';
import { ControladorAnalitica } from '../controladores/analiticaControlador.js';
import { renderizarVistaAnalitica } from '../vistas/analiticaVista.js';
import Chart from 'chart.js/auto';

// Keep track of the current section
let seccionActual = 'usuarios';
let charts = [];

export function configurarManejadoresAdmin(callbacks) {
  configurarNavegacionSecciones();
  configurarManejadoresUsuarios(callbacks);
  configurarManejadoresProductos(callbacks);
  configurarManejadoresReportes();
  configurarManejadoresAnalitica();
  
  // Restore the active section
  mostrarSeccion(seccionActual);
}

function mostrarSeccion(seccion) {
  const enlaces = document.querySelectorAll('.nav-link');
  const secciones = {
    usuarios: document.getElementById('usuariosSection'),
    inventario: document.getElementById('inventarioSection'),
    reportes: document.getElementById('reportesSection'),
    analitica: document.getElementById('analiticaSection')
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

  // If showing analytics section, load the data and initialize charts
  if (seccion === 'analitica') {
    cargarDatosAnalitica();
  }
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

async function cargarDatosAnalitica() {
  try {
    const resultado = await ControladorAnalitica.obtenerDatosAnalisis();
    if (resultado.exito) {
      const contenidoAnalitica = document.getElementById('analiticaContent');
      contenidoAnalitica.innerHTML = renderizarVistaAnalitica(resultado.datos);
      inicializarGraficas(resultado.datos);
    }
  } catch (error) {
    console.error('Error al cargar datos de análisis:', error);
  }
}

function inicializarGraficas(datos) {
  // Destruir gráficas existentes
  charts.forEach(chart => chart.destroy());
  charts = [];

  // Configurar gráfica de consumo semanal
  const ctxSemanal = document.getElementById('consumoSemanalChart');
  if (ctxSemanal) {
    const chartSemanal = new Chart(ctxSemanal, {
      type: 'bar',
      data: {
        labels: datos.estadisticas.semanal.map(item => item.nombre),
        datasets: [{
          label: 'Consumo Semanal',
          data: datos.estadisticas.semanal.map(item => item.cantidad),
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    charts.push(chartSemanal);
  }

  // Configurar gráfica de consumo mensual
  const ctxMensual = document.getElementById('consumoMensualChart');
  if (ctxMensual) {
    const chartMensual = new Chart(ctxMensual, {
      type: 'line',
      data: {
        labels: datos.estadisticas.mensual.map(item => item.nombre),
        datasets: [{
          label: 'Consumo Mensual',
          data: datos.estadisticas.mensual.map(item => item.cantidad),
          fill: false,
          borderColor: 'rgb(79, 70, 229)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    charts.push(chartMensual);
  }

  // Configurar gráfica de tendencia semestral
  const ctxSemestral = document.getElementById('consumoSemestralChart');
  if (ctxSemestral) {
    const chartSemestral = new Chart(ctxSemestral, {
      type: 'line',
      data: {
        labels: datos.estadisticas.semestral.map(item => item.nombre),
        datasets: [{
          label: 'Tendencia Semestral',
          data: datos.estadisticas.semestral.map(item => item.cantidad),
          fill: true,
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          borderColor: 'rgb(79, 70, 229)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    charts.push(chartSemestral);
  }
}

function configurarManejadoresAnalitica() {
  // Configurar cualquier interacción adicional en la sección de analítica
}

function configurarManejadoresProductos(callbacks) {
  // Nuevo Producto
  const botonNuevoProducto = document.getElementById('newProductBtn');
  if (botonNuevoProducto) {
    botonNuevoProducto.addEventListener('click', () => {
      const modalProducto = document.getElementById('productModal');
      const formularioProducto = document.getElementById('productForm');
      
      // Reset form
      formularioProducto.reset();
      modalProducto.style.display = 'flex';

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
            modalProducto.style.display = 'none';
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

      document.getElementById('cancelProductBtn').addEventListener('click', () => {
        modalProducto.style.display = 'none';
        formularioProducto.removeEventListener('submit', handleSubmit);
      });
    });
  }

  // Editar Producto
  document.querySelectorAll('.edit-btn[data-type="product"]').forEach(boton => {
    boton.addEventListener('click', async () => {
      const productId = boton.dataset.id;
      const productos = await ControladorProducto.obtenerTodosProductos();
      const producto = productos.datos.find(p => p.id === productId);
      
      if (producto) {
        const modalProducto = document.getElementById('productModal');
        const formularioProducto = document.getElementById('productForm');
        
        document.getElementById('productName').value = producto.nombre;
        document.getElementById('productQuantity').value = producto.cantidad;
        document.getElementById('productUnit').value = producto.unidad;
        document.getElementById('productPrice').value = producto.precio;
        document.getElementById('productType').value = producto.tipo;
        
        modalProducto.style.display = 'flex';

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
              modalProducto.style.display = 'none';
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

        document.getElementById('cancelProductBtn').addEventListener('click', () => {
          modalProducto.style.display = 'none';
          formularioProducto.removeEventListener('submit', handleSubmit);
        });
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

function configurarManejadoresReportes() {
  const botonGenerar = document.getElementById('generarReporteBtn');
  if (botonGenerar) {
    botonGenerar.addEventListener('click', async () => {
      const fechaDesde = document.getElementById('reporteFechaDesde').value;
      const fechaHasta = document.getElementById('reporteFechaHasta').value;

      if (!fechaDesde || !fechaHasta) {
        alert('Por favor, seleccione un rango de fechas');
        return;
      }

      try {
        const resultado = await ControladorReporte.generarReporteVentas(fechaDesde, fechaHasta);
        if (resultado.exito) {
          const url = window.URL.createObjectURL(resultado.datos);
          const link = document.createElement('a');
          link.href = url;
          link.download = `reporte-ventas-${fechaDesde}-${fechaHasta}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          alert('Error al generar el reporte: ' + resultado.mensaje);
        }
      } catch (error) {
        console.error('Error al generar reporte:', error);
        alert('Error al generar el reporte');
      }
    });
  }
}