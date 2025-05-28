import { Usuario } from '../modelos/Usuario.js';

class ControladorAutenticacion {
  static async iniciarSesion(nombreUsuario, contrasena) {
    try {
      const usuario = await Usuario.autenticar(nombreUsuario, contrasena);
      if (usuario) {
        return { exito: true, usuario };
      }
      return { exito: false, mensaje: 'Credenciales inválidas' };
    } catch (error) {
      return { exito: false, mensaje: error.message };
    }
  }
}

export { ControladorAutenticacion };