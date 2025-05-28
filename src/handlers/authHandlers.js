import { ControladorAutenticacion } from '../controladores/autenticacionControlador.js';

export function configurarManejadoresInicioSesion(callbacks) {
  const formularioLogin = document.getElementById('loginForm');
  formularioLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombreUsuario = document.getElementById('username').value;
    const contrasena = document.getElementById('password').value;
    
    const resultado = await ControladorAutenticacion.iniciarSesion(nombreUsuario, contrasena);
    if (resultado.exito) {
      callbacks.onLoginSuccess(resultado.usuario);
    } else {
      alert('Error de inicio de sesión: ' + resultado.mensaje);
    }
  });
}