import { Producto } from '../modelos/Producto.js';

export class ControladorProducto {
  static async obtenerTodosProductos() {
    try {
      const productos = await Producto.obtenerTodos();
      return { exito: true, datos: productos };
    } catch (error) {
      return { exito: false, mensaje: error.message };
    }
  }

  static async crearProducto(datosProducto) {
    try {
      const producto = await Producto.crear(datosProducto);
      return { exito: true, datos: producto };
    } catch (error) {
      return { exito: false, mensaje: error.message };
    }
  }

  static async actualizarProducto(id, datosProducto) {
    try {
      const producto = await Producto.actualizar(id, datosProducto);
      return { exito: true, datos: producto };
    } catch (error) {
      return { exito: false, mensaje: error.message };
    }
  }

  static async eliminarProducto(id) {
    try {
      await Producto.eliminar(id);
      return { exito: true };
    } catch (error) {
      return { exito: false, mensaje: error.message };
    }
  }
}