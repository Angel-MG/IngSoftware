import { Usuario } from "../modelos/Usuario.js";

class ControladorAutenticacion {
  static async iniciarSesion(nombreUsuario, contrasena) {
    try {
      // Trim whitespace from username
      const nombreUsuarioLimpio = nombreUsuario.trim();
      const usuario = await Usuario.autenticar(nombreUsuarioLimpio, contrasena);
      if (usuario) {
        return { exito: true, usuario };
      }
      return { exito: false, mensaje: "Credenciales inválidas" };
    } catch (error) {
      return { exito: false, mensaje: error.message };
    }
  }
}

export { ControladorAutenticacion };

