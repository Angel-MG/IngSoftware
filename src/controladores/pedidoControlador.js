import { Pedido } from '../modelos/Pedido.js';

export class ControladorPedido {
  static async obtenerTodosPedidos() {
    try {
      const pedidos = await Pedido.obtenerTodos();
      return { exito: true, datos: pedidos };
    } catch (error) {
      return { exito: false, mensaje: error.message };
    }
  }

  static async crearPedido(datosPedido) {
    try {
      const pedido = await Pedido.crear(datosPedido);
      return { exito: true, datos: pedido };
    } catch (error) {
      return { exito: false, mensaje: error.message };
    }
  }

  static async actualizarPedido(id, datosPedido) {
    try {
      const pedido = await Pedido.actualizar(id, datosPedido);
      return { exito: true, datos: pedido };
    } catch (error) {
      return { exito: false, mensaje: error.message };
    }
  }

  static async eliminarPedido(id) {
    try {
      await Pedido.eliminar(id);
      return { exito: true };
    } catch (error) {
      return { exito: false, mensaje: error.message };
    }
  }

  static async actualizarEstadoPedido(id, estado) {
    try {
      const pedido = await Pedido.actualizar(id, { estado });
      return { exito: true, datos: pedido };
    } catch (error) {
      return { exito: false, mensaje: error.message };
    }
  }
}