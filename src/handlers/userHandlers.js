import { ControladorUsuario } from '../controladores/usuarioControlador.js';
import { mostrarModalConfirmacionEliminar } from '../utilidades/modalUtilidades.js';
import { validarUsuario, validarContrasena } from '../utilidades/validacionUsuario.js';

export function configurarManejadoresUsuarios(callbacks) {
  // Nuevo Usuario
  const botonNuevoUsuario = document.getElementById('newUserBtn');
  if (botonNuevoUsuario) {
    botonNuevoUsuario.addEventListener('click', () => {
      const modalUsuario = document.getElementById('userModal');
      const formularioUsuario = document.getElementById('userForm');
      const inputUsuario = document.getElementById('username');
      const inputContrasena = document.getElementById('password');
      const errorUsuario = document.getElementById('username-error');
      const errorContrasena = document.getElementById('password-error');
      
      // Reset form and hide error messages
      formularioUsuario.reset();
      errorUsuario.style.display = 'none';
      errorContrasena.style.display = 'none';
      modalUsuario.style.display = 'flex';

      // Limpiar errores al escribir
      inputUsuario.addEventListener('input', () => {
        errorUsuario.style.display = 'none';
        inputUsuario.classList.remove('error');
      });

      inputContrasena.addEventListener('input', () => {
        errorContrasena.style.display = 'none';
        inputContrasena.classList.remove('error');
      });

      const handleSubmit = async (e) => {
        e.preventDefault();
        
        const nombreUsuario = inputUsuario.value;
        const contrasena = inputContrasena.value;

        // Validar usuario
        const validacionUsuario = validarUsuario(nombreUsuario);
        if (!validacionUsuario.esValido) {
          errorUsuario.textContent = validacionUsuario.mensaje;
          errorUsuario.style.display = 'block';
          inputUsuario.classList.add('error');
          return;
        }

        // Validar contraseña
        const validacionContrasena = validarContrasena(contrasena);
        if (!validacionContrasena.esValido) {
          errorContrasena.textContent = validacionContrasena.mensaje;
          errorContrasena.style.display = 'block';
          inputContrasena.classList.add('error');
          return;
        }

        const datosUsuario = {
          nombreUsuario,
          contrasena,
          rol: document.getElementById('role').value
        };

        try {
          const resultado = await ControladorUsuario.crear(datosUsuario);
          if (resultado.exito) {
            modalUsuario.style.display = 'none';
            formularioUsuario.removeEventListener('submit', handleSubmit);
            if (callbacks.onStatusUpdate) {
              await callbacks.onStatusUpdate();
            }
          } else {
            alert('Error al crear usuario: ' + resultado.mensaje);
          }
        } catch (error) {
          console.error('Error al crear usuario:', error);
          alert('Error al crear usuario');
        }
      };

      formularioUsuario.addEventListener('submit', handleSubmit);

      document.getElementById('cancelUserBtn').addEventListener('click', () => {
        modalUsuario.style.display = 'none';
        formularioUsuario.removeEventListener('submit', handleSubmit);
      });
    });
  }

  // Editar Usuario
  document.querySelectorAll('.edit-btn[data-type="user"]').forEach(boton => {
    boton.addEventListener('click', async () => {
      const userId = boton.dataset.id;
      const usuarios = await ControladorUsuario.obtenerTodos();
      const usuario = usuarios.datos.find(u => u.id === userId);
      
      if (usuario) {
        const modalUsuario = document.getElementById('userModal');
        const formularioUsuario = document.getElementById('userForm');
        const inputUsuario = document.getElementById('username');
        const inputContrasena = document.getElementById('password');
        const errorUsuario = document.getElementById('username-error');
        const errorContrasena = document.getElementById('password-error');
        
        inputUsuario.value = usuario.nombreUsuario;
        inputContrasena.value = usuario.contrasena;
        document.getElementById('role').value = usuario.rol;
        
        errorUsuario.style.display = 'none';
        errorContrasena.style.display = 'none';
        modalUsuario.style.display = 'flex';

        // Limpiar errores al escribir
        inputUsuario.addEventListener('input', () => {
          errorUsuario.style.display = 'none';
          inputUsuario.classList.remove('error');
        });

        inputContrasena.addEventListener('input', () => {
          errorContrasena.style.display = 'none';
          inputContrasena.classList.remove('error');
        });

        const handleSubmit = async (e) => {
          e.preventDefault();
          
          const nombreUsuario = inputUsuario.value;
          const contrasena = inputContrasena.value;

          // Validar usuario
          const validacionUsuario = validarUsuario(nombreUsuario);
          if (!validacionUsuario.esValido) {
            errorUsuario.textContent = validacionUsuario.mensaje;
            errorUsuario.style.display = 'block';
            inputUsuario.classList.add('error');
            return;
          }

          // Validar contraseña
          const validacionContrasena = validarContrasena(contrasena);
          if (!validacionContrasena.esValido) {
            errorContrasena.textContent = validacionContrasena.mensaje;
            errorContrasena.style.display = 'block';
            inputContrasena.classList.add('error');
            return;
          }

          const datosUsuario = {
            nombreUsuario,
            contrasena,
            rol: document.getElementById('role').value
          };

          try {
            const resultado = await ControladorUsuario.actualizarUsuario(userId, datosUsuario);
            if (resultado.exito) {
              modalUsuario.style.display = 'none';
              formularioUsuario.removeEventListener('submit', handleSubmit);
              if (callbacks.onStatusUpdate) {
                await callbacks.onStatusUpdate();
              }
            } else {
              alert('Error al actualizar usuario: ' + resultado.mensaje);
            }
          } catch (error) {
            console.error('Error al actualizar usuario:', error);
            alert('Error al actualizar usuario');
          }
        };

        formularioUsuario.addEventListener('submit', handleSubmit);

        document.getElementById('cancelUserBtn').addEventListener('click', () => {
          modalUsuario.style.display = 'none';
          formularioUsuario.removeEventListener('submit', handleSubmit);
        });
      }
    });
  });

  // Eliminar Usuario
  document.querySelectorAll('.delete-btn[data-type="user"]').forEach(boton => {
    boton.addEventListener('click', async () => {
      const userId = boton.dataset.id;
      const confirmar = await mostrarModalConfirmacionEliminar(
        'usuario',
        '¿Está seguro de que desea eliminar este usuario?'
      );
      
      if (confirmar) {
        try {
          const resultado = await ControladorUsuario.eliminarUsuario(userId);
          if (resultado.exito) {
            if (callbacks.onStatusUpdate) {
              await callbacks.onStatusUpdate();
            }
          } else {
            alert('Error al eliminar usuario: ' + resultado.mensaje);
          }
        } catch (error) {
          console.error('Error al eliminar usuario:', error);
          alert('Error al eliminar usuario');
        }
      }
    });
  });
}