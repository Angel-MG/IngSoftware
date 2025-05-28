import { validarUsuario, validarContrasena } from '../utilidades/validacionUsuario.js';

describe('Validación de Usuario', () => {
  describe('validarUsuario', () => {
    test('debe rechazar un nombre de usuario vacío', () => {
      const resultado = validarUsuario('');
      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toBe('El nombre de usuario es requerido');
    });

    test('debe rechazar un nombre de usuario muy corto', () => {
      const resultado = validarUsuario('ab');
      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toBe('El nombre de usuario debe tener al menos 3 caracteres');
    });

    test('debe rechazar un nombre de usuario muy largo', () => {
      const resultado = validarUsuario('usuariodemasiadolargo');
      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toBe('El nombre de usuario no puede tener más de 15 caracteres');
    });

    test('debe aceptar un nombre de usuario válido', () => {
      const resultado = validarUsuario('usuario123');
      expect(resultado.esValido).toBe(true);
      expect(resultado.mensaje).toBe('');
    });

    test('debe rechazar un nombre de usuario que no comienza con letra', () => {
      const resultado = validarUsuario('123usuario');
      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toBe('El nombre de usuario debe comenzar con una letra');
    });

    test('debe rechazar un nombre de usuario con caracteres especiales', () => {
      const resultado = validarUsuario('usuario@123');
      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toBe('El nombre de usuario solo puede contener letras y números');
    });

    test('debe rechazar un nombre de usuario con más de 4 números', () => {
      const resultado = validarUsuario('usuario12345');
      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toBe('El nombre de usuario no puede contener más de 4 números');
    });
  });

  describe('validarContrasena', () => {
    test('debe rechazar una contraseña vacía', () => {
      const resultado = validarContrasena('');
      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toBe('La contraseña es requerida');
    });

    test('debe rechazar una contraseña muy corta', () => {
      const resultado = validarContrasena('12345');
      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toBe('La contraseña debe tener al menos 6 caracteres');
    });

    test('debe rechazar una contraseña muy larga', () => {
      const resultado = validarContrasena('a'.repeat(21));
      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toBe('La contraseña no puede tener más de 20 caracteres');
    });

    test('debe aceptar una contraseña válida', () => {
      const resultado = validarContrasena('contraseña123');
      expect(resultado.esValido).toBe(true);
      expect(resultado.mensaje).toBe('');
    });

    test('debe aceptar una contraseña con caracteres especiales', () => {
      const resultado = validarContrasena('Contraseña@123');
      expect(resultado.esValido).toBe(true);
      expect(resultado.mensaje).toBe('');
    });
  });
});