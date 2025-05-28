import { Usuario } from '../modelos/Usuario.js';

export class ControladorUsuario {
  static async obtenerTodos() {
    try {
      const usuarios = await Usuario.obtenerTodos();
      return { exito: true, datos: usuarios };
    } catch (error) {
      return { exito: false, mensaje: error.message };
    }
  }

  static async crear(datosUsuario) {
    try {
      const usuario = await Usuario.crear(datosUsuario);
      return { exito: true, datos: usuario };
    } catch (error) {
      return { exito: false, mensaje: error.message };
    }
  }

  static async actualizarUsuario(id, datosUsuario) {
    try {
      const usuario = await Usuario.actualizar(id, datosUsuario);
      return { exito: true, datos: usuario };
    } catch (error) {
      return { exito: false, mensaje: error.message };
    }
  }

  static async eliminarUsuario(id) {
    try {
      await Usuario.eliminar(id);
      return { exito: true };
    } catch (error) {
      return { exito: false, mensaje: error.message };
    }
  }
}