import { ControladorPedido } from './pedidoControlador.js';
import { generarPDFReporte } from '../utilidades/generadorPDF.js';

export class ControladorReporte {
  static async generarReporteVentas(fechaInicio, fechaFin) {
    try {
      const pedidos = await ControladorPedido.obtenerTodosPedidos();
      const pedidosCompletados = pedidos.datos.filter(pedido => 
        pedido.estado === 'completed' &&
        new Date(pedido.fechaCreacion) >= new Date(fechaInicio) &&
        new Date(pedido.fechaCreacion) <= new Date(fechaFin)
      );

      const datosReporte = {
        fechaInicio,
        fechaFin,
        totalVentas: pedidosCompletados.reduce((sum, pedido) => sum + pedido.total, 0),
        cantidadPedidos: pedidosCompletados.length,
        pedidos: pedidosCompletados
      };

      const pdfBlob = await generarPDFReporte(datosReporte);
      return { exito: true, datos: pdfBlob };
    } catch (error) {
      return { exito: false, mensaje: error.message };
    }
  }
}