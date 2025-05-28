import { db } from '../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ControladorProducto } from './productoControlador.js';

export class ControladorAnalitica {
  static async obtenerDatosAnalisis() {
    try {
      // Obtener productos terminados actuales
      const productos = await ControladorProducto.obtenerTodosProductos();
      const productosTerminados = productos.datos.filter(p => p.tipo === 'terminado');

      // Obtener fechas para los diferentes períodos
      const ahora = new Date();
      const inicioSemana = new Date(ahora.getTime() - (7 * 24 * 60 * 60 * 1000));
      const inicioMes = new Date(ahora.getTime() - (30 * 24 * 60 * 60 * 1000));
      const inicioSemestre = new Date(ahora.getTime() - (180 * 24 * 60 * 60 * 1000));

      // Consultas para cada período
      const pedidosRef = collection(db, 'pedidos');
      
      const [snapSemanal, snapMensual, snapSemestral] = await Promise.all([
        getDocs(query(
          pedidosRef,
          where('estado', '==', 'completed'),
          where('fechaCreacion', '>=', inicioSemana.toISOString()),
          orderBy('fechaCreacion', 'desc')
        )),
        getDocs(query(
          pedidosRef,
          where('estado', '==', 'completed'),
          where('fechaCreacion', '>=', inicioMes.toISOString()),
          orderBy('fechaCreacion', 'desc')
        )),
        getDocs(query(
          pedidosRef,
          where('estado', '==', 'completed'),
          where('fechaCreacion', '>=', inicioSemestre.toISOString()),
          orderBy('fechaCreacion', 'desc')
        ))
      ]);

      // Procesar datos de ventas
      const datosSemanal = this.procesarDatosVentas(snapSemanal, productosTerminados);
      const datosMensual = this.procesarDatosVentas(snapMensual, productosTerminados);
      const datosSemestral = this.procesarDatosVentas(snapSemestral, productosTerminados);

      // Calcular tendencias y predicciones
      const tendencias = this.calcularTendencias(datosSemestral, datosMensual);
      const predicciones = this.calcularPredicciones(datosMensual, productosTerminados);

      return {
        exito: true,
        datos: {
          estadisticas: {
            semanal: datosSemanal,
            mensual: datosMensual,
            semestral: datosSemestral
          },
          tendencias,
          predicciones
        }
      };
    } catch (error) {
      console.error('Error al obtener datos de análisis:', error);
      return {
        exito: false,
        mensaje: error.message
      };
    }
  }

  static procesarDatosVentas(snapshot, productosTerminados) {
    const ventasPorProducto = {};

    // Inicializar todos los productos terminados con 0 ventas
    productosTerminados.forEach(producto => {
      ventasPorProducto[producto.nombre] = {
        nombre: producto.nombre,
        cantidad: 0,
        ingresos: 0
      };
    });

    // Procesar ventas
    snapshot.forEach(doc => {
      const pedido = doc.data();
      if (pedido.productos && Array.isArray(pedido.productos)) {
        pedido.productos.forEach(producto => {
          if (ventasPorProducto[producto.nombre]) {
            ventasPorProducto[producto.nombre].cantidad += producto.cantidad;
            ventasPorProducto[producto.nombre].ingresos += producto.cantidad * producto.precio;
          }
        });
      }
    });

    return Object.values(ventasPorProducto);
  }

  static calcularTendencias(datosSemestral, datosMensual) {
    return datosSemestral.map(productoSemestral => {
      const productoMensual = datosMensual.find(p => p.nombre === productoSemestral.nombre);
      
      // Evitar división por cero
      const ventaPromedioSemestral = productoSemestral.cantidad / 180 || 0.01;
      const ventaPromedioMensual = (productoMensual?.cantidad || 0) / 30;
      
      const tendencia = ((ventaPromedioMensual - ventaPromedioSemestral) / ventaPromedioSemestral * 100);

      return {
        nombre: productoSemestral.nombre,
        tendencia: tendencia.toFixed(2),
        estable: Math.abs(tendencia) < 10
      };
    });
  }

  static calcularPredicciones(datosMensual, productosTerminados) {
    return productosTerminados.map(producto => {
      const datosVenta = datosMensual.find(p => p.nombre === producto.nombre);
      const ventaPromedioDiaria = (datosVenta?.cantidad || 0) / 30;
      
      // Evitar división por cero
      const diasHastaAgotamiento = ventaPromedioDiaria > 0 
        ? Math.floor(producto.cantidad / ventaPromedioDiaria)
        : 999; // Si no hay ventas, asumimos stock para mucho tiempo
      
      return {
        nombre: producto.nombre,
        stockActual: producto.cantidad,
        ventaPromedioDiaria: ventaPromedioDiaria.toFixed(2),
        diasHastaAgotamiento,
        fechaEstimadaAgotamiento: diasHastaAgotamiento === 999 
          ? 'Sin datos suficientes'
          : new Date(Date.now() + (diasHastaAgotamiento * 24 * 60 * 60 * 1000)).toLocaleDateString()
      };
    });
  }
}